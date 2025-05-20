from flask import Flask, request, jsonify
from API_Request import process_pdf
from flask_cors import CORS
import base64
import os
import re

app = Flask(__name__)
CORS(app)

PDF_SAVE_DIR = "received_pdfs"
if not os.path.exists(PDF_SAVE_DIR):
    os.makedirs(PDF_SAVE_DIR)

@app.route('/Gemini', methods=['POST'])
def handle_pdf():
    if 'pdf' not in request.json:
        return jsonify({"error": "No PDF data found in the request"}), 400

    base64_pdf = request.json['pdf']

    # Sanitize the base64 string
    base64_pdf = re.sub(r'[^A-Za-z0-9+/=]', '', base64_pdf)

    # Robust padding check and correction
    missing_padding = len(base64_pdf) % 4
    if missing_padding != 0:
        if missing_padding == 1:
            base64_pdf += '==='
        elif missing_padding == 2:
            base64_pdf += '=='
        elif missing_padding == 3:
            base64_pdf += '='

    print(f"Base64 length after cleaning and padding: {len(base64_pdf)}")

    try:
        pdf_data = base64.b64decode(base64_pdf)
        pdf_filename = f"received_pdf_{len(os.listdir(PDF_SAVE_DIR))}.pdf"
        pdf_path = os.path.join(PDF_SAVE_DIR, pdf_filename)

        with open(pdf_path, "wb") as f:
            f.write(pdf_data)

        print(f"PDF saved to: {pdf_path}")

    except Exception as e:
        print(f"Error saving PDF: {e}")
        return jsonify({"error": "Error saving PDF: " + str(e)}), 500

    try:
        analyzed_pdf = process_pdf(pdf_path)  # Pass the file path
        return jsonify({"message": "PDF received and processed successfully",
                        "response": analyzed_pdf}), 200
    except Exception as api_error:
        print(f"Gemini API Error: {api_error}")
        return jsonify({"error": "Gemini API error: " + str(api_error)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8180, debug=True)