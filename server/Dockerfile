# Use Python 3.9 slim image as base
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create directory for PDFs
RUN mkdir -p received_pdfs

# Expose both ports
EXPOSE 5000
EXPOSE 8180

# Command to run the application
CMD ["python", "server.py"] 