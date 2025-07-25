// this is the IoT code

#include <WiFi.h>
#include <HTTPClient.h> // Library ini masih digunakan untuk parsing URL
#include <WiFiClientSecure.h> // Diperlukan untuk koneksi HTTPS manual
#include <SPIFFS.h>
#include <ArduinoJson.h>  // --- Library BARU untuk mem-parsing respons server

// --- Add Dependent Libraries ---
#include <driver/i2s.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// --- WiFi Credentials ---
const char* MY_WIFI_SSID = "royalmeatresto21";
const char* MY_WIFI_PASSWORD = "meatroyal2022";

// --- Server URL Details ---
const char* SERVER_HOST = "suara-nusa.vercel.app";
const char* SERVER_PATH = "/api/stt";
const int SERVER_PORT = 443; // Port standar untuk HTTPS

// --- ESP32 Pin Definitions ---
#define BUTTON_PIN 22
#define scl 4
#define sda 5
#define I2S_WS_PIN   21
#define I2S_SD_PIN   18
#define I2S_SCK_PIN  19
#define I2S_PORT_NUM I2S_NUM_0

// --- OLED Display Configuration ---
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
#define SCREEN_ADDRESS 0x3C
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// --- I2S Audio Configuration ---
#define I2S_SAMPLE_RATE   (16000)
#define I2S_SAMPLE_BITS   (16)
#define I2S_READ_LEN      (2 * 1024)

// --- File System Configuration ---
const char* FILENAME_WITH_PATH = "/recording.wav";
const char* FILENAME_ONLY = "recording.wav"; // Nama file untuk header multipart
File file;

// --- State Machine ---
enum State { IDLE, RECORDING, SENDING };
State currentState = IDLE;

// --- Button Debouncing variables ---
unsigned long lastDebounceTime = 0;
int lastButtonStateStable = HIGH;
const long debounceDelay = 50;

// --- Function Prototypes ---
bool connectToWiFi();
void initI2S();
void displayTextOnOLED(const String &text, bool clear = true, int y_pos = 0);
void updateDisplayInfo();
void startRecording();
void stopRecordingAndSend();
void recordAudioChunk();
void sendWavToServer();
void writeWavHeader(File& file, uint32_t sampleRate, uint16_t bitDepth, uint16_t channels);
void updateWavHeader(const char* filename);


void setup() {
  Serial.begin(115200);
  while (!Serial);
  Serial.println("\n--- ESP32 WAV Recorder & HTTP Uploader ---");

  pinMode(BUTTON_PIN, INPUT_PULLUP);

  Wire.begin(sda, scl);
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;);
  }
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  displayTextOnOLED("Booting...");

  if (!SPIFFS.begin(true)) {
    Serial.println("An Error has occurred while mounting SPIFFS");
    displayTextOnOLED("SPIFFS Mount Fail!");
    return;
  }
  Serial.println("SPIFFS mounted successfully.");

  if (connectToWiFi()) {
    Serial.println("WiFi Connected. IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("WiFi connection failed.");
  }
  
  initI2S();

  Serial.println("Setup complete. Ready to record.");
  updateDisplayInfo();
}

void loop() {
  int currentButtonStateRaw = digitalRead(BUTTON_PIN);
  if (currentButtonStateRaw != lastButtonStateStable) {
    if (millis() - lastDebounceTime > debounceDelay) {
      lastDebounceTime = millis();
      if (currentButtonStateRaw == LOW && lastButtonStateStable == HIGH) {
        Serial.println("Button Pressed!");
        if (currentState == IDLE) {
          currentState = RECORDING;
          startRecording();
          updateDisplayInfo();
        } else if (currentState == RECORDING) {
          currentState = SENDING;
          stopRecordingAndSend();
        }
      }
      lastButtonStateStable = currentButtonStateRaw;
    }
  }

  if (currentState == RECORDING) {
    recordAudioChunk();
  }
}

// --- OLED Display Functions ---
void displayTextOnOLED(const String &text, bool clear, int y_pos) {
  if (clear) display.clearDisplay();
  display.setCursor(0, y_pos);
  display.println(text);
  display.display();
  Serial.println("OLED: " + text);
}

void updateDisplayInfo() {
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("IP: " + WiFi.localIP().toString());
    display.println("---------------------");

    switch(currentState) {
        case IDLE:
            displayTextOnOLED("State: Ready", false, 18);
            displayTextOnOLED("Press button to REC", false, 40);
            break;
        case RECORDING:
            displayTextOnOLED("State: RECORDING...", false, 18);
            displayTextOnOLED("Press button to STOP", false, 40);
            break;
        case SENDING:
            displayTextOnOLED("State: Sending...", false, 18);
            break;
    }
}


// --- WiFi and I2S Initialization ---
bool connectToWiFi() {
  displayTextOnOLED("Connecting WiFi...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(MY_WIFI_SSID, MY_WIFI_PASSWORD);
  unsigned long startTime = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startTime < 20000) {
    delay(500); Serial.print(".");
  }
  return WiFi.status() == WL_CONNECTED;
}

void initI2S() {
  Serial.println("Initializing I2S...");
  i2s_config_t i2s_config = {
      .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
      .sample_rate = I2S_SAMPLE_RATE,
      .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
      .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
      .communication_format = I2S_COMM_FORMAT_STAND_I2S,
      .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
      .dma_buf_count = 8,
      .dma_buf_len = 256,
      .use_apll = false,
      .tx_desc_auto_clear = false,
      .fixed_mclk = 0
  };
  i2s_driver_install(I2S_PORT_NUM, &i2s_config, 0, NULL);

  const i2s_pin_config_t pin_config = {
      .bck_io_num = I2S_SCK_PIN,
      .ws_io_num = I2S_WS_PIN,
      .data_out_num = I2S_PIN_NO_CHANGE,
      .data_in_num = I2S_SD_PIN
  };
  i2s_set_pin(I2S_PORT_NUM, &pin_config);
  Serial.println("I2S Initialized.");
}

// --- Recording Logic ---
void startRecording() {
  Serial.println("Starting recording...");
  if (SPIFFS.exists(FILENAME_WITH_PATH)) {
    SPIFFS.remove(FILENAME_WITH_PATH);
  }
  file = SPIFFS.open(FILENAME_WITH_PATH, FILE_WRITE);
  if (!file) {
    displayTextOnOLED("File Open Error!");
    currentState = IDLE;
    return;
  }
  writeWavHeader(file, I2S_SAMPLE_RATE, I2S_SAMPLE_BITS, 1);
}

void stopRecordingAndSend() {
  Serial.println("Stopping recording...");
  if (file) {
    file.close();
    Serial.println("File closed.");
    updateWavHeader(FILENAME_WITH_PATH);
    sendWavToServer();
  }
  currentState = IDLE;
  updateDisplayInfo();
}

void recordAudioChunk() {
  if (!file) return;
  char* i2s_read_buff = (char*)calloc(I2S_READ_LEN, sizeof(char));
  size_t bytes_read = 0;
  esp_err_t result = i2s_read(I2S_PORT_NUM, (void*)i2s_read_buff, I2S_READ_LEN, &bytes_read, portMAX_DELAY);
  if (result == ESP_OK && bytes_read > 0) {
    file.write((const uint8_t*)i2s_read_buff, bytes_read);
  }
  free(i2s_read_buff);
}

// --- FUNGSI PENGIRIMAN DAN PARSING BARU ---
void sendWavToServer() {
  if (WiFi.status() != WL_CONNECTED) {
    displayTextOnOLED("WiFi Disconnected.\nCannot send file.");
    return;
  }
  updateDisplayInfo(); // Show "Sending..."

  WiFiClientSecure client;
  client.setInsecure(); 

  Serial.printf("Connecting to %s...\n", SERVER_HOST);
  if (!client.connect(SERVER_HOST, SERVER_PORT)) {
    Serial.println("Connection failed!");
    displayTextOnOLED("Connection Failed!");
    delay(2000);
    return;
  }
  Serial.println("Connected to server.");

  File audioFile = SPIFFS.open(FILENAME_WITH_PATH, "r");
  if (!audioFile) {
    Serial.println("Failed to open file for reading");
    return;
  }
  
  String boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
  String body_prefix = "--" + boundary + "\r\n";
  body_prefix += "Content-Disposition: form-data; name=\"audio\"; filename=\"" + String(FILENAME_ONLY) + "\"\r\n";
  body_prefix += "Content-Type: audio/wav\r\n\r\n";
  
  String body_suffix = "\r\n--" + boundary + "--\r\n";
  
  long file_size = audioFile.size();
  long content_length = body_prefix.length() + file_size + body_suffix.length();
  
  client.println("POST " + String(SERVER_PATH) + " HTTP/1.1");
  client.println("Host: " + String(SERVER_HOST));
  client.println("Content-Type: multipart/form-data; boundary=" + boundary);
  client.println("Content-Length: " + String(content_length));
  client.println("Connection: close");
  client.println();
  
  client.print(body_prefix);
  
  uint8_t buffer[1024];
  size_t bytes_read = 0;
  while ((bytes_read = audioFile.read(buffer, sizeof(buffer))) > 0) {
    client.write(buffer, bytes_read);
  }
  audioFile.close();
  
  client.print(body_suffix);

  Serial.println("Request sent. Waiting for response...");
  displayTextOnOLED("Waiting for response...", false, 30);
  
  // --- FIX: Logic to correctly read chunked HTTP response ---
  unsigned long timeout = millis();
  while (client.connected() == 0 && (millis() - timeout < 5000)) {
      delay(100); // Wait for connection
  }

  // Find the end of the headers
  while (client.connected() && !client.find("\r\n\r\n")) {
      // Flushes headers
  }

  // Read the body, properly handling chunked encoding
  String response_body = "";
  while (client.connected() && client.available()) {
      // Read the chunk size (it's in hex)
      String chunkSizeHex = client.readStringUntil('\r');
      client.read(); // consume the \n
      long chunkSize = strtol(chunkSizeHex.c_str(), NULL, 16);

      if (chunkSize == 0) {
          break; // End of chunks
      }

      while (chunkSize > 0) {
          int bytesToRead = min((long)128, chunkSize); // Read in smaller pieces
          char chunkBuffer[bytesToRead + 1];
          int bytesRead = client.read((uint8_t*)chunkBuffer, bytesToRead);
          chunkBuffer[bytesRead] = 0; // Null-terminate
          response_body += chunkBuffer;
          chunkSize -= bytesRead;
      }
      client.readStringUntil('\n'); // consume the \r\n after the chunk data
  }
  // --- END OF FIX ---

  client.stop();
  Serial.println("Response Body:\n" + response_body);

  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, response_body);
  
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    displayTextOnOLED("JSON Parse Error");
  } else {
    if (doc.containsKey("translation")) {
      const char* translation = doc["translation"];
      displayTextOnOLED("Result:\n" + String(translation));
    } else if (doc.containsKey("error")) {
      const char* server_error = doc["error"];
      displayTextOnOLED("Server Error:\n" + String(server_error));
    } else {
       displayTextOnOLED("Unknown response");
    }
  }

  delay(8000); 
}


// --- WAV Header Functions ---
void writeWavHeader(File& file, uint32_t sampleRate, uint16_t bitDepth, uint16_t channels) {
  uint32_t chunkSize = 0, subChunk2Size = 0;
  uint32_t subChunk1Size = 16, byteRate = sampleRate * channels * (bitDepth / 8);
  uint16_t audioFormat = 1, blockAlign = channels * (bitDepth / 8);

  file.write((const uint8_t*)"RIFF", 4); file.write((const uint8_t*)&chunkSize, 4);
  file.write((const uint8_t*)"WAVE", 4); file.write((const uint8_t*)"fmt ", 4);
  file.write((const uint8_t*)&subChunk1Size, 4); file.write((const uint8_t*)&audioFormat, 2);
  file.write((const uint8_t*)&channels, 2); file.write((const uint8_t*)&sampleRate, 4);
  file.write((const uint8_t*)&byteRate, 4); file.write((const uint8_t*)&blockAlign, 2);
  file.write((const uint8_t*)&bitDepth, 2); file.write((const uint8_t*)"data", 4);
  // --- FIX: Corrected typo from subChunk2Siz to subChunk2Size ---
  file.write((const uint8_t*)&subChunk2Size, 4);
}

void updateWavHeader(const char* filename) {
  File file = SPIFFS.open(filename, "r+");
  if (!file) return;
  uint32_t fileSize = file.size();
  uint32_t subChunk2Size = fileSize - 44;
  uint32_t chunkSize = 36 + subChunk2Size;
  file.seek(4); file.write((const uint8_t*)&chunkSize, 4);
  file.seek(40); file.write((const uint8_t*)&subChunk2Size, 4);
  file.close();
  Serial.printf("WAV header updated. Total Size: %u, Audio Data Size: %u\n", fileSize, subChunk2Size);
}
