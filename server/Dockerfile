# Use Python 3.12 slim image as base
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create directory for PDFs
RUN mkdir -p received_pdfs

# Expose the port the app runs on
EXPOSE 8180

# Command to run the application
CMD ["python", "server.py"] 