// IoT code

#include <driver/i2s.h>
#include <WiFi.h>
#include <WebSocketsClient.h>
// --- Add OLED Libraries ---
#include <Wire.h> // For I2C
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// --- WiFi Credentials ---
const char* MY_WIFI_SSID = "royalmeatresto21";
const char* MY_WIFI_PASSWORD = "meatroyal2022";

// --- WebSocket Server Details ---
const char* WEBSOCKET_SERVER_HOST = "192.168.1.25";
const uint16_t WEBSOCKET_SERVER_PORT = 8766;
const char* WEBSOCKET_SERVER_PATH = "/";


// --- ESP32 Pin Definitions ---
#define BUTTON_PIN 22

#define scl 4 // Already defined, ensure these are correct for your OLED
#define sda 5 // Already defined, ensure these are correct for your OLED

#define I2S_WS_PIN   21
#define I2S_SD_PIN   18
#define I2S_SCK_PIN  19
#define I2S_PORT_NUM I2S_NUM_0

// --- OLED Display Configuration ---
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define OLED_RESET    -1 // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C // Check your OLED's I2C address (0x3C or 0x3D)

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
String lastOledMessage = "";

// --- I2S Audio Configuration ---
#define I2S_SAMPLE_RATE   (16000)
#define I2S_SAMPLE_BITS   (16)
#define I2S_READ_LEN      (1 * 1024)

volatile bool isStreaming = false;
uint32_t streamed_bytes_count = 0;

char* i2s_read_buff = NULL;
uint8_t* stream_write_buff = NULL;
uint8_t* payload_with_id_buff = NULL; // For MAC address + Audio data
const int MAC_ADDRESS_LEN = 6;

// --- Button Debouncing ---
unsigned long lastDebounceTime = 0;
int lastButtonStateStable = HIGH;
int currentButtonStateRaw = HIGH;
const long debounceDelay = 50;

// --- WebSocket Client Instance and State ---
WebSocketsClient webSocket;
volatile bool webSocketConnected = false;

// --- Function Prototypes ---
bool connectToWiFi();
void mergedI2SInit();
bool startStreaming();
void stopStreamingAndCleanup();
void processAndStreamAudio();
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length);
void i2s_adc_data_scale(uint8_t * d_buff, uint8_t* s_buff, uint32_t len);
void displayTextOnOLED(const String &text); // Ensure prototype matches implementation
void displayTextOnOLED(const char* text);
void displayIdleStatusWithChipID();


void setup() {
  Serial.begin(115200);
  while (!Serial);
  Serial.println("\n------------------------------------------------------");
  Serial.println("ESP32 I2S WebSocket Continuous Streamer (Modified + OLED + DeviceID)");
  Serial.println("------------------------------------------------------");
  Serial.printf("Initial Free Heap: %u bytes\n", ESP.getFreeHeap());

  pinMode(BUTTON_PIN, INPUT_PULLUP);
  Serial.println("Button Pin Initialized (GPIO" + String(BUTTON_PIN) + ")");

  Wire.begin(sda, scl); 
  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); 
  }
  Serial.println("OLED Initialized.");
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  displayTextOnOLED("System Booting..."); 
  delay(1000); // Single delay is fine

  if (connectToWiFi()) {
    Serial.printf("After WiFi Connect - Free Heap: %u bytes\n", ESP.getFreeHeap());
    // displayTextOnOLED("WiFi Connected\nIP: " + WiFi.localIP().toString()); // This is an intermediate message, will be replaced by idle or WS status
    Serial.println("Initializing WebSocket connection to: ws://" + String(WEBSOCKET_SERVER_HOST) + ":" + String(WEBSOCKET_SERVER_PORT) + String(WEBSOCKET_SERVER_PATH));
    webSocket.begin(WEBSOCKET_SERVER_HOST, WEBSOCKET_SERVER_PORT, WEBSOCKET_SERVER_PATH);
    webSocket.onEvent(webSocketEvent);
  } else {
    Serial.println("WiFi connection failed. WebSocket will not be available.");
    // displayTextOnOLED("WiFi Failed!"); // This will be updated by displayIdleStatusWithChipID
  }

  mergedI2SInit();
  Serial.printf("After I2S Init - Free Heap: %u bytes\n", ESP.getFreeHeap());

  Serial.println("Setup complete. Press button to start/stop streaming audio.");
  lastOledMessage = ""; 
  displayIdleStatusWithChipID(); 
}

void loop() {
  webSocket.loop(); 

  currentButtonStateRaw = digitalRead(BUTTON_PIN);
  if (currentButtonStateRaw != lastButtonStateStable) {
    if (millis() - lastDebounceTime > debounceDelay) {
      lastDebounceTime = millis();
      if (currentButtonStateRaw == LOW && lastButtonStateStable == HIGH) { 
        Serial.println("Button Pressed!");
        Serial.print("  Current isStreaming state: "); Serial.println(isStreaming ? "true" : "false");
        Serial.print("  Current webSocketConnected state: "); Serial.println(webSocketConnected ? "true" : "false");

        if (!isStreaming) {
          if (webSocketConnected) {
            if (startStreaming()) {
              Serial.println("Successfully started streaming based on startStreaming() return.");
              displayTextOnOLED("Streaming Audio...");
            } else {
              Serial.println("Failed to start streaming based on startStreaming() return.");
              displayTextOnOLED("Stream Start Fail");
            }
          } else {
            Serial.println("WebSocket not connected. Cannot start streaming.");
            displayTextOnOLED("WS Not Connected\nCannot Stream");
          }
        } else { // If currently streaming, stop it
          stopStreamingAndCleanup(); // This function now handles the OLED update to idle status
          Serial.println("Streaming stopped by button press.");
          // displayTextOnOLED("Streaming Stopped."); // REMOVED - Redundant
        }
      }
      lastButtonStateStable = currentButtonStateRaw;
    }
  }

  if (isStreaming) {
    processAndStreamAudio();
  }
}

void displayTextOnOLED(const String &text) {
    if (text == lastOledMessage && !text.isEmpty()) {
        return;
    }
    display.clearDisplay();
    display.setCursor(0,0);
    display.println(text); 
    display.display();
    Serial.print("OLED Display: "); Serial.println(text);
    lastOledMessage = text;
}

void displayTextOnOLED(const char* text) {
    displayTextOnOLED(String(text));
}

void displayIdleStatusWithChipID() {
    String line1, line2, line3, line4;
    uint64_t chipid_val = ESP.getEfuseMac(); 
    char macStr[18]; 
    snprintf(macStr, sizeof(macStr), "%02X:%02X:%02X:%02X:%02X:%02X",
             (uint8_t)(chipid_val >> 40), (uint8_t)(chipid_val >> 32),
             (uint8_t)(chipid_val >> 24), (uint8_t)(chipid_val >> 16),
             (uint8_t)(chipid_val >> 8),  (uint8_t)chipid_val);

    line3 = "ID: " + String(macStr);
    line4 = "Press Button";

    if (WiFi.status() != WL_CONNECTED) {
        line1 = "WiFi Failed!";
        line2 = "Not Connected"; 
    } else {
        line1 = "IP: " + WiFi.localIP().toString();
        if (!webSocketConnected) {
            line2 = "WS Disconnected";
        } else {
            line2 = "WS Connected";
        }
    }
    displayTextOnOLED(line1 + "\n" + line2 + "\n" + line3 + "\n" + line4);
}


void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case WStype_CONNECTED:
            Serial.printf("[WSc] Connected to server: %s\n", (payload ? (char*)payload : ""));
            webSocketConnected = true;
            if (!isStreaming) {
                lastOledMessage = ""; 
                displayIdleStatusWithChipID(); 
            } else {
                displayTextOnOLED("WS Online\nStreaming..."); 
            }
            break;
        case WStype_DISCONNECTED:
            Serial.printf("[WSc] Disconnected! Reason: %s (length %u)\n", (payload ? (char*)payload : "N/A"), length);
            webSocketConnected = false;
            if (isStreaming) {
                Serial.println("WebSocket disconnected during stream. Stopping stream and cleaning up.");
                stopStreamingAndCleanup(); 
            } else {
                lastOledMessage = ""; 
                displayIdleStatusWithChipID(); 
            }
            break;
        case WStype_TEXT:
            Serial.printf("[WSc] Received Text: %s\n", payload);
            displayTextOnOLED(String((char*)payload)); 
            break;
        case WStype_ERROR:    
            Serial.printf("[WSc] Error: %s\n", (payload ? (char*)payload : "Unknown"));
            webSocketConnected = false; 
            if (isStreaming) {
                Serial.println("WebSocket error during stream. Stopping stream and cleaning up.");
                stopStreamingAndCleanup(); 
            } else {
                lastOledMessage = ""; 
                displayIdleStatusWithChipID(); 
            }
            break;
        case WStype_PING:
            Serial.println("[WSc] Received PING");
            break;
        case WStype_PONG:
            Serial.println("[WSc] Received PONG");
            break;
        default:
            Serial.printf("[WSc] Event: %d\n", type);
            break;
    }
}

bool connectToWiFi() {
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("Already connected to WiFi.");
        Serial.println("IP Address: " + WiFi.localIP().toString());
        return true;
    }
    Serial.println("Connecting to WiFi: " + String(MY_WIFI_SSID));
    displayTextOnOLED("Connecting WiFi\n" + String(MY_WIFI_SSID)); // Intermediate message
    WiFi.mode(WIFI_STA);
    WiFi.begin(MY_WIFI_SSID, MY_WIFI_PASSWORD);
    unsigned long startTime = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startTime < 20000) {
        delay(500); Serial.print(".");
    }
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nWiFi connected! IP Address: " + WiFi.localIP().toString());
        return true;
    } else {
        Serial.println("\nWiFi connection failed.");
        // displayTextOnOLED("WiFi Failed!"); // Let displayIdleStatusWithChipID handle final status
        return false;
    }
}

void mergedI2SInit() {
    Serial.println("Initializing I2S...");
    i2s_config_t i2s_config = {
        .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
        .sample_rate = I2S_SAMPLE_RATE,
        .bits_per_sample = i2s_bits_per_sample_t(I2S_SAMPLE_BITS),
        .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
        .communication_format = i2s_comm_format_t(I2S_COMM_FORMAT_STAND_I2S),
        .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
        .dma_buf_count = 8, 
        .dma_buf_len = 256,  
        .use_apll = true, 
        .tx_desc_auto_clear = false,
        .fixed_mclk = 0
    };
    esp_err_t err = i2s_driver_install(I2S_PORT_NUM, &i2s_config, 0, NULL);
    if (err != ESP_OK) {
        Serial.printf("I2S Driver install failed: %s\n", esp_err_to_name(err));
        displayTextOnOLED("I2S Driver FAIL");
        while(1); 
    }
    const i2s_pin_config_t pin_config = {
        .bck_io_num = I2S_SCK_PIN,
        .ws_io_num = I2S_WS_PIN,
        .data_out_num = I2S_PIN_NO_CHANGE,
        .data_in_num = I2S_SD_PIN
    };
    err = i2s_set_pin(I2S_PORT_NUM, &pin_config);
    if (err != ESP_OK) {
        Serial.printf("I2S Set Pin failed: %s\n", esp_err_to_name(err));
        displayTextOnOLED("I2S Pin FAIL");
        while(1); 
    }
    Serial.println("I2S Initialized.");
}

bool startStreaming() {
    Serial.println("Attempting to start audio stream...");
    Serial.printf("Before buffer allocation - Free heap: %u bytes\n", ESP.getFreeHeap());

    if (i2s_read_buff != NULL || stream_write_buff != NULL || payload_with_id_buff != NULL) {
        Serial.println("Buffers were not NULL. Cleaning up first...");
        stopStreamingAndCleanup(); 
    }

    i2s_read_buff = (char*) calloc(I2S_READ_LEN, sizeof(char));
    if (!i2s_read_buff) {
        Serial.printf("FATAL: Failed to allocate i2s_read_buff. Heap: %u\n", ESP.getFreeHeap());
        displayTextOnOLED("Mem Alloc Fail 1");
        isStreaming = false;
        return false;
    }

    stream_write_buff = (uint8_t*) calloc(I2S_READ_LEN, sizeof(uint8_t));
    if (!stream_write_buff) {
        Serial.printf("FATAL: Failed to allocate stream_write_buff. Heap: %u\n", ESP.getFreeHeap());
        free(i2s_read_buff); i2s_read_buff = NULL;
        displayTextOnOLED("Mem Alloc Fail 2");
        isStreaming = false;
        return false;
    }

    payload_with_id_buff = (uint8_t*) calloc(MAC_ADDRESS_LEN + I2S_READ_LEN, sizeof(uint8_t));
    if (!payload_with_id_buff) {
        Serial.printf("FATAL: Failed to allocate payload_with_id_buff. Heap: %u\n", ESP.getFreeHeap());
        free(i2s_read_buff); i2s_read_buff = NULL;
        free(stream_write_buff); stream_write_buff = NULL;
        displayTextOnOLED("Mem Alloc Fail 3");
        isStreaming = false;
        return false;
    }
    Serial.printf("Stream buffers allocated. Free heap: %u bytes\n", ESP.getFreeHeap());

    uint64_t chipid_val = ESP.getEfuseMac();
    payload_with_id_buff[0] = (uint8_t)(chipid_val >> 40);
    payload_with_id_buff[1] = (uint8_t)(chipid_val >> 32);
    payload_with_id_buff[2] = (uint8_t)(chipid_val >> 24);
    payload_with_id_buff[3] = (uint8_t)(chipid_val >> 16);
    payload_with_id_buff[4] = (uint8_t)(chipid_val >> 8);
    payload_with_id_buff[5] = (uint8_t)chipid_val;
    Serial.print("Device ID (MAC) to be sent with audio: ");
    for(int i=0; i < MAC_ADDRESS_LEN; i++) {
        Serial.printf("%02X", payload_with_id_buff[i]);
        if (i < MAC_ADDRESS_LEN -1) Serial.print(":");
    }
    Serial.println();

    streamed_bytes_count = 0; 
    
    i2s_zero_dma_buffer(I2S_PORT_NUM);
    size_t bytes_read_dummy;
    for(int i=0; i < 2; i++) { 
        i2s_read(I2S_PORT_NUM, (void*) i2s_read_buff, I2S_READ_LEN, &bytes_read_dummy, pdMS_TO_TICKS(50));
    }
    
    isStreaming = true; 
    Serial.println("Audio streaming started. Device ID will be prepended to audio data.");
    return true;
}

void stopStreamingAndCleanup() {
    if (!isStreaming && !i2s_read_buff && !stream_write_buff && !payload_with_id_buff) {
        isStreaming = false; 
        if (lastOledMessage.indexOf("ID:") == -1 ) { 
             lastOledMessage = ""; 
             displayIdleStatusWithChipID();
        }
        return;
    }
    
    Serial.println("Stopping audio stream and cleaning up ESP32 resources...");
    isStreaming = false; 

    if (i2s_read_buff) {
        free(i2s_read_buff);
        i2s_read_buff = NULL;
        Serial.println("I2S read buffer freed.");
    }
    if (stream_write_buff) {
        free(stream_write_buff);
        stream_write_buff = NULL;
        Serial.println("Stream write buffer freed.");
    }
    if (payload_with_id_buff) { 
        free(payload_with_id_buff);
        payload_with_id_buff = NULL;
        Serial.println("Payload with ID buffer freed.");
    }
    
    Serial.printf("After freeing stream buffers - Free heap: %u bytes\n", ESP.getFreeHeap());
    Serial.println("Ready for next stream. Press button to start.");
    streamed_bytes_count = 0; 
    
    lastOledMessage = ""; 
    displayIdleStatusWithChipID(); 
}

void processAndStreamAudio() {
    if (!isStreaming) { 
        return; 
    }
    if (!webSocketConnected) { 
        Serial.println("PASA: WebSocket not connected, cannot send. Stopping stream."); 
        displayTextOnOLED("WS Lost! Stop.");
        stopStreamingAndCleanup(); 
        return; 
    }
    if (!i2s_read_buff) { 
        Serial.println("PASA: i2s_read_buff is NULL. Stopping stream."); 
        displayTextOnOLED("Buffer Error 1");
        stopStreamingAndCleanup();
        return; 
    }
    if (!stream_write_buff) { 
        Serial.println("PASA: stream_write_buff is NULL. Stopping stream."); 
        displayTextOnOLED("Buffer Error 2");
        stopStreamingAndCleanup();
        return; 
    }
    if (!payload_with_id_buff) { 
        Serial.println("PASA: payload_with_id_buff is NULL. Stopping stream."); 
        displayTextOnOLED("Buffer Error 3");
        stopStreamingAndCleanup();
        return; 
    }

    size_t bytes_read_from_i2s;
    esp_err_t read_status = i2s_read(I2S_PORT_NUM, (void*)i2s_read_buff, I2S_READ_LEN, &bytes_read_from_i2s, pdMS_TO_TICKS(20)); 

    if (read_status == ESP_OK && bytes_read_from_i2s > 0) {
        uint32_t audio_bytes_to_stream = bytes_read_from_i2s;
        i2s_adc_data_scale(stream_write_buff, (uint8_t*)i2s_read_buff, audio_bytes_to_stream);
        
        memcpy(payload_with_id_buff + MAC_ADDRESS_LEN, stream_write_buff, audio_bytes_to_stream);
        
        uint32_t total_bytes_to_send = MAC_ADDRESS_LEN + audio_bytes_to_stream;
        if (webSocket.sendBIN(payload_with_id_buff, total_bytes_to_send)) {
            streamed_bytes_count += audio_bytes_to_stream; 
            static unsigned long lastProgressPrintTime = 0;
            if (millis() - lastProgressPrintTime > 2000) { 
                Serial.printf("Audio streaming... %lu audio bytes sent (total payload %lu with ID)\n", (unsigned long)streamed_bytes_count, (unsigned long)total_bytes_to_send);
                lastProgressPrintTime = millis();
            }
        } else {
            Serial.println("[ERR] PASA: webSocket.sendBIN failed. WebSocket might be closing or buffer full.");
        }
    } else if (read_status == ESP_ERR_TIMEOUT) {
        // Normal, no sound
    } else {
        Serial.printf("[ERR] PASA: I2S Read Error: %s. Stopping stream.\n", esp_err_to_name(read_status));
        displayTextOnOLED("I2S Read Err\nStopping.");
        stopStreamingAndCleanup();
    }
}

void i2s_adc_data_scale(uint8_t * d_buff, uint8_t* s_buff, uint32_t len) {
    if (I2S_SAMPLE_BITS == 16) {
        memcpy(d_buff, s_buff, len); 
        return;
    }
    Serial.println("Warning: i2s_adc_data_scale with non-16-bit default handling (performing direct copy).");
    memcpy(d_buff, s_buff, len);
}