from flask import Flask, request, jsonify
from API_Request import process_image
from flask_cors import CORS
import base64
import os
import re

app = Flask(__name__)
CORS(app)

IMAGE_SAVE_DIR = "received_images"
if not os.path.exists(IMAGE_SAVE_DIR):
    os.makedirs(IMAGE_SAVE_DIR)

@app.route('/Gemini', methods=['POST'])
def handle_image():
    if 'image' not in request.json:
        return jsonify({"error": "No image data found in the request"}), 400

    base64_image = request.json['image']

    # Sanitize the base64 string
    base64_image = re.sub(r'[^A-Za-z0-9+/=]', '', base64_image)

    # Robust padding check and correction
    missing_padding = len(base64_image) % 4
    if missing_padding != 0:
        if missing_padding == 1:
            base64_image += '==='
        elif missing_padding == 2:
            base64_image += '=='
        elif missing_padding == 3:
            base64_image += '='

    print(f"Base64 length after cleaning and padding: {len(base64_image)}")

    try:
        image_data = base64.b64decode(base64_image)
        image_filename = f"received_image_{len(os.listdir(IMAGE_SAVE_DIR))}.png"
        image_path = os.path.join(IMAGE_SAVE_DIR, image_filename)

        with open(image_path, "wb") as f:
            f.write(image_data)

        print(f"Image saved to: {image_path}")

    except Exception as e:
        print(f"Error saving image: {e}")
        return jsonify({"error": "Error saving image: " + str(e)}), 500

    try:
        analyzed_image = process_image(image_path)  # Pass the file path
        return jsonify({"message": "Image received and processed successfully",
                        "response": analyzed_image}), 200
    except Exception as api_error:
        print(f"Gemini API Error: {api_error}")
        return jsonify({"error": "Gemini API error: " + str(api_error)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3050, debug=True)