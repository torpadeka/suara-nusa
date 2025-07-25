# this is the code of the websocket server used for live translation

print("<<<<< RUNNING THE ABSOLUTELY LATEST VERSION - MAY 28th (Corrected + Translator Sketch + Auto POST) >>>>>") # Updated Name
import asyncio
import websockets
import azure.cognitiveservices.speech as speechsdk
from azure.core.credentials import AzureKeyCredential # For Translator
from azure.ai.translation.text import TextTranslationClient # For Translator (targets v3.x API)
import logging
import os # Good for getting keys from environment
import requests # Added for making HTTP POST requests
import json # Added for constructing JSON payload

# Configure logging
logging.basicConfig(level=logging.INFO)

# --- Azure Speech Details ---
AZURE_SPEECH_KEY = "AcsJPW9BJnzwbtNKrQA0c9ft5gqjruXGsOyeVYvXaHm2qzNOXRhhJQQJ99BDACqBBLyXJ3w3AAAYACOGtYE1"
AZURE_SPEECH_REGION = "southeastasia"

# --- Azure Translator Details ---
# IMPORTANT: Replace with your REAL Azure Translator Key and Endpoint/Region
AZURE_TRANSLATOR_KEY = "BuuPfgdWGJVtq6eu5zv6PCYr2pkSCYcJkqALFPRNA6BUNXcNxPYgJQQJ99BEACqBBLyXJ3w3AAAbACOGrAVe"
AZURE_TRANSLATOR_ENDPOINT = "https://api.cognitive.microsofttranslator.com/"
AZURE_TRANSLATOR_REGION = "southeastasia" 

# --- Ngrok Note URL ---
WebNotes_URL = "https://suara-nusa.vercel.app/api/notes" # Your target URL

# Dictionary to hold streams and recognizers per connection
clients = {}

# --- Initialize Translator Client ---
translator_credential = AzureKeyCredential(AZURE_TRANSLATOR_KEY)
text_translator = TextTranslationClient(credential=translator_credential, region=AZURE_TRANSLATOR_REGION)


# --- Function to send POST request to your notes server ---
def send_note_to_server(text_content, device_id_from_esp): # Renamed device_id for clarity
    payload = {
        "text": text_content,
        "deviceId": device_id_from_esp # This will be the ESP32's MAC address
    }
    headers = {
        "Content-Type": "application/json"
    }
    try:
        logging.info(f"Attempting to send POST request to {WebNotes_URL} with payload: {payload}")
        response = requests.post(WebNotes_URL, headers=headers, data=json.dumps(payload), timeout=10)
        response.raise_for_status() # Raises an HTTPError for bad responses (4XX or 5XX)
        logging.info(f"Successfully sent note to {WebNotes_URL}. Status: {response.status_code}, Response: {response.text}")
        return True, response.text
    except requests.exceptions.RequestException as e:
        logging.error(f"Error sending note to {WebNotes_URL}: {e}")
        return False, str(e)

# --- THIS HANDLER SIGNATURE IS CRITICAL ---
async def azure_speech_handler(websocket):
    ws_internal_id = id(websocket) # Unique ID for this specific websocket connection instance on the server
    logging.info(f"WebSocket connection instance {ws_internal_id} connected.")

    # This will store the MAC address string (e.g., "XX:XX:XX:XX:XX:XX") of the connected ESP32
    device_mac_address_str = "Glamulus" # Default until first message provides it

    main_loop = asyncio.get_running_loop()

    try:
        speech_config = speechsdk.SpeechConfig(subscription=AZURE_SPEECH_KEY, region=AZURE_SPEECH_REGION)
        speech_config.speech_recognition_language = "id-ID" # Speech to be recognized (Source Language)

        audio_format = speechsdk.audio.AudioStreamFormat(samples_per_second=16000, bits_per_sample=16, channels=1)
        push_stream = speechsdk.audio.PushAudioInputStream(stream_format=audio_format)
        audio_config = speechsdk.audio.AudioConfig(stream=push_stream)
        speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

        clients[ws_internal_id] = {'stream': push_stream, 'recognizer': speech_recognizer}

        async def send_text_to_client(text_content_ws): # Renamed to avoid conflict
            if text_content_ws:
                try:
                    await websocket.send(text_content_ws)
                    logging.info(f"Sent to WebSocket client {ws_internal_id} (Device: {device_mac_address_str}): {text_content_ws}")
                except websockets.exceptions.ConnectionClosed:
                    logging.warning(f"WebSocket client {ws_internal_id} (Device: {device_mac_address_str}) disconnected while sending.")

        # =========================================================================================
        # REVISED recognized_handler FUNCTION
        # This function is triggered when a complete utterance is recognized.
        # It now sends ONLY the English translation back to the ESP32.
        # =========================================================================================
        def recognized_handler(evt):
            recognized_source_text = evt.result.text # This will be in speech_recognition_language (e.g., id-ID)
            note_sent_successfully = False

            if recognized_source_text:
                logging.info(f"Recognized ({speech_config.speech_recognition_language}) for WS {ws_internal_id} (Device: {device_mac_address_str}): {recognized_source_text}")

                if text_translator:
                    try:
                        target_language_for_translation = ["en"] # Translate from id-ID to en
                        input_text_elements = [{'text': recognized_source_text}]
                        
                        translation_response = text_translator.translate(
                            body=input_text_elements,
                            to_language=target_language_for_translation,
                            from_language="id"
                        )

                        first_translation = translation_response[0] if translation_response else None
                        if first_translation and first_translation.translations:
                            translated_text = first_translation.translations[0].text # This is the English text
                            logging.info(f"Translated ({target_language_for_translation}) for WS {ws_internal_id} (Device: {device_mac_address_str}): {translated_text}")
                            
                            # --- MODIFICATION START ---
                            # Send ONLY the translated English text back to the ESP32.
                            asyncio.run_coroutine_threadsafe(send_text_to_client(translated_text), main_loop)
                            # --- MODIFICATION END ---

                            # This part for sending to your notes server can remain the same
                            status, resp_text = send_note_to_server(
                                text_content=f"(ID): {recognized_source_text} (EN): {translated_text}",
                                device_id_from_esp=device_mac_address_str
                            )
                            note_sent_successfully = status
                        else:
                            logging.error("Translation response was empty or did not contain translations.")
                            # Send a simple error message to the OLED
                            asyncio.run_coroutine_threadsafe(send_text_to_client("Translation Failed"), main_loop)
                            # Send original text to the notes server if translation failed
                            status, resp_text = send_note_to_server(
                                text_content=f"Device {device_mac_address_str} ({speech_config.speech_recognition_language.split('-')[0].upper()} - Translation Failed): {recognized_source_text}",
                                device_id_from_esp=device_mac_address_str
                            )
                            note_sent_successfully = status
                    except Exception as e:
                        logging.error(f"Azure Translator Call Error for WS {ws_internal_id} (Device: {device_mac_address_str}): {e}", exc_info=True)
                        # Send a simple error message to the OLED
                        asyncio.run_coroutine_threadsafe(send_text_to_client("Translation Error"), main_loop)
                        # Send original text to notes server if translation errored
                        status, resp_text = send_note_to_server(
                            text_content=f"Device {device_mac_address_str} ({speech_config.speech_recognition_language.split('-')[0].upper()} - Translation Error): {recognized_source_text}",
                            device_id_from_esp=device_mac_address_str
                        )
                        note_sent_successfully = status
                else: # Translator not configured
                    asyncio.run_coroutine_threadsafe(send_text_to_client("Translator Off"), main_loop)
                    status, resp_text = send_note_to_server(
                        text_content=f"Device {device_mac_address_str} ({speech_config.speech_recognition_language.split('-')[0].upper()} - No Translator): {recognized_source_text}",
                        device_id_from_esp=device_mac_address_str
                    )
                    note_sent_successfully = status
            else:
                logging.info(f"Azure Speech recognized empty text for WS instance {ws_internal_id} (Device: {device_mac_address_str}).")

            if recognized_source_text and not note_sent_successfully:
                logging.warning(f"Failed to send note to server for WS {ws_internal_id} (Device: {device_mac_address_str}) after recognition.")

        def recognizing_handler(evt):
            pass

        def canceled_handler(evt):
            logging.error(f"Azure CANCELED for WS {ws_internal_id} (Device: {device_mac_address_str}): Reason={evt.reason}, Code={evt.error_code}, Details={evt.error_details}")
            if evt.reason == speechsdk.CancellationReason.Error:
                if evt.error_code == speechsdk.CancellationErrorCode.ConnectionFailure:
                    logging.error(f"ConnectionFailure for WS {ws_internal_id} (Device: {device_mac_address_str}).")
                elif evt.error_code == speechsdk.CancellationErrorCode.AuthenticationFailure:
                    logging.error(f"AuthenticationFailure for WS {ws_internal_id} (Device: {device_mac_address_str}). Check Azure Speech Key/Region.")
                else:
                    logging.error(f"Unhandled Azure error code: {evt.error_code} for WS {ws_internal_id} (Device: {device_mac_address_str})")

        speech_recognizer.recognized.connect(recognized_handler)
        speech_recognizer.recognizing.connect(recognizing_handler)
        speech_recognizer.canceled.connect(canceled_handler)
        speech_recognizer.session_stopped.connect(lambda evt: logging.info(f"Azure session stopped for WS {ws_internal_id} (Device: {device_mac_address_str}) (ID: {evt.session_id})"))
        speech_recognizer.session_started.connect(lambda evt: logging.info(f"Azure session started for WS {ws_internal_id} (Device: {device_mac_address_str}) (ID: {evt.session_id})"))

        # Use await for async SDK methods
        logging.info(f"Attempting to start Azure recognition for WS {ws_internal_id} (Initial Device ID: {device_mac_address_str}).")
        start_future = speech_recognizer.start_continuous_recognition_async()
        start_future.get() # Wait for the start operation to complete
        logging.info(f"Successfully started Azure recognition for WS {ws_internal_id} (Initial Device ID: {device_mac_address_str}).")


        async for message in websocket:
            if isinstance(message, bytes):
                if len(message) > 6: # ESP32 sends 6-byte MAC + audio
                    mac_bytes = message[:6]
                    audio_data = message[6:]

                    current_mac_str = ":".join(f"{b:02X}" for b in mac_bytes)

                    if device_mac_address_str == "UNKNOWN_DEVICE": # First time receiving MAC
                        device_mac_address_str = current_mac_str
                        logging.info(f"WS instance {ws_internal_id} identified as Device MAC: {device_mac_address_str}")
                    elif device_mac_address_str != current_mac_str:
                        logging.warning(f"WS instance {ws_internal_id} MAC address changed from {device_mac_address_str} to {current_mac_str}. Using new MAC.")
                        device_mac_address_str = current_mac_str # Update to the latest MAC

                    if audio_data:
                        push_stream.write(audio_data)
                else:
                    logging.warning(f"Received short binary message (length {len(message)}) from WS {ws_internal_id} (Device: {device_mac_address_str}). Discarding.")
            else:
                logging.warning(f"Received non-binary message from WS {ws_internal_id} (Device: {device_mac_address_str}): {message}")

    except websockets.exceptions.ConnectionClosedOK:
        logging.info(f"WS instance {ws_internal_id} (Device: {device_mac_address_str}) disconnected normally.")
    except websockets.exceptions.ConnectionClosedError as e:
        logging.error(f"ConnectionClosedError for WS {ws_internal_id} (Device: {device_mac_address_str}): {e}")
    except Exception as e:
        logging.error(f"Generic error handling WS {ws_internal_id} (Device: {device_mac_address_str}): {e}", exc_info=True)
    finally:
        if ws_internal_id in clients:
            logging.info(f"Cleaning up resources for WS instance {ws_internal_id} (Device: {device_mac_address_str}).")
            recognizer_obj = clients[ws_internal_id].get('recognizer')
            stream_obj = clients[ws_internal_id].get('stream')
            if recognizer_obj:
                recognizer_obj.recognized.disconnect_all()
                recognizer_obj.recognizing.disconnect_all()
                recognizer_obj.canceled.disconnect_all()
                recognizer_obj.session_stopped.disconnect_all()
                recognizer_obj.session_started.disconnect_all()

                logging.info(f"Attempting to stop continuous recognition for WS {ws_internal_id} (Device: {device_mac_address_str}).")
                # Correctly handle the future from stop_continuous_recognition_async
                stop_future = recognizer_obj.stop_continuous_recognition_async()
                stop_future.get() # Wait for the stop operation to complete
                logging.info(f"Successfully stopped continuous recognition for WS {ws_internal_id} (Device: {device_mac_address_str}).")
            if stream_obj:
                stream_obj.close()
            del clients[ws_internal_id]
        logging.info(f"Finished cleanup for WS instance {ws_internal_id} (Device: {device_mac_address_str}).")

async def main():

    async with websockets.serve(azure_speech_handler, "0.0.0.0", 8766):
        logging.info("WebSocket server started on ws://0.0.0.0:8766. Press Ctrl+C to stop.")
        await asyncio.Future() # Keep the server running until interrupted

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logging.info("Server has been stopped by user (KeyboardInterrupt).")
    finally:
        logging.info("Application exiting.")