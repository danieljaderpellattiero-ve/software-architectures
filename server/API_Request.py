from google import genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment variable
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    raise ValueError("Please set the GEMINI_API_KEY environment variable")

client = genai.Client(api_key=api_key)

prompt = """You are an expert document analyzer. Your task is to analyze the provided PDF document and extract all relevant information. Please follow these guidelines:

1. Document Content Analysis:
   - Extract and summarize all text content from the document
   - Identify any tables, charts, or structured data
   - Note any important formatting or layout elements
   - Identify any images or diagrams and describe their content

2. Document Structure:
   - Identify the document type (e.g., report, article, form, etc.)
   - Note any sections, headings, or organizational structure
   - Identify any metadata (if visible) like date, author, etc.

3. Key Information:
   - Extract any key facts, figures, or important points
   - Identify any dates, names, or specific data points
   - Note any conclusions or recommendations

Please provide your analysis in a clear, structured format that captures all the important information from the document. If certain elements cannot be determined, please indicate that clearly.

After this prompt, I will provide the PDF file. Please analyze it according to the instructions above."""

def process_pdf(pdf_path):
    """Analyzes a PDF using Gemini API file upload."""
    try:
        myfile = client.files.upload(file=pdf_path)
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=[prompt, myfile]
        )
        return response.text
    except Exception as e:
        print(f"Error analyzing PDF: {e}")
        return f"Error analyzing PDF: {e}"  # Return the error so it can be sent to the client.