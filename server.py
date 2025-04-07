from flask import Flask, request, jsonify
from API_Request import process_image  # Assuming this file exists and has the function
from flask_cors import CORS 

app = Flask(__name__)

@app.route("/api/home", methods=["GET"])
def return_home():
    return jsonify({"message": "Welcome to the home page!"})

@app.route('/Gemini', methods=['POST'])
def handle_image():
    if 'image' not in request.json:
        return jsonify({"error": "No image data found in the request"}), 400

    base64_image = request.json['image']
    analyzed_image = process_image(base64_image)
    
    return jsonify({"message": "Image received and printed successfully",
                    "response": analyzed_image}), 200

if __name__ == "__main__":
    app.run(debug=True)