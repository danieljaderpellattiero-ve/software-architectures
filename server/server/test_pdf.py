import requests
import base64
import json
import sys
import os

# Define the default PDF directory
DEFAULT_PDF_DIR = os.path.expanduser("~/Downloads")  # Default to Downloads folder
SERVER_URL = "http://localhost:8180/Gemini"  # Updated port to match server

def test_pdf_upload(pdf_path):
    # Check if file exists
    if not os.path.exists(pdf_path):
        print(f"Error: File '{pdf_path}' does not exist!")
        return

    # Check if file is a PDF
    if not pdf_path.lower().endswith('.pdf'):
        print(f"Error: File '{pdf_path}' is not a PDF file!")
        return

    # Read the PDF file and convert to base64
    with open(pdf_path, 'rb') as pdf_file:
        pdf_data = pdf_file.read()
        base64_pdf = base64.b64encode(pdf_data).decode('utf-8')

    # Prepare the request payload
    payload = {
        "pdf": base64_pdf
    }

    # Send POST request to the server
    try:
        print(f"\nSending PDF file: {pdf_path}")
        print("Connecting to server at:", SERVER_URL)
        response = requests.post(SERVER_URL, json=payload)
        
        # Print the response
        print("\nStatus Code:", response.status_code)
        print("\nResponse:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 401:
            print("\nAuthentication Error: Please make sure you have set up your GEMINI_API_KEY in the .env file")
            print("Get your API key from: https://makersuite.google.com/app/apikey")
        
    except requests.exceptions.ConnectionError:
        print(f"\nError: Could not connect to server at {SERVER_URL}")
        print("Make sure the server is running (python server.py)")
    except requests.exceptions.RequestException as e:
        print(f"\nError making request: {e}")

def list_available_pdfs():
    """List all PDF files in the default directory"""
    pdf_files = [f for f in os.listdir(DEFAULT_PDF_DIR) if f.lower().endswith('.pdf')]
    if pdf_files:
        print("\nAvailable PDF files in", DEFAULT_PDF_DIR)
        for i, pdf in enumerate(pdf_files, 1):
            print(f"{i}. {pdf}")
    else:
        print(f"\nNo PDF files found in {DEFAULT_PDF_DIR}")

if __name__ == "__main__":
    if len(sys.argv) == 1:
        # No arguments provided, show available PDFs
        list_available_pdfs()
        print("\nUsage: python test_pdf.py <pdf_filename>")
        print("Example: python test_pdf.py document.pdf")
        print("The script will look for PDFs in:", DEFAULT_PDF_DIR)
        sys.exit(1)
    
    pdf_filename = sys.argv[1]
    # If only filename is provided, use the default directory
    if not os.path.dirname(pdf_filename):
        pdf_path = os.path.join(DEFAULT_PDF_DIR, pdf_filename)
    else:
        pdf_path = pdf_filename
    
    test_pdf_upload(pdf_path) 