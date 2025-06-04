from flask import Flask, request, send_file, make_response, jsonify, session
from flask_cors import CORS
import requests
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from io import BytesIO
import time
from dotenv import load_dotenv
import asyncio

from models.gemini2_vision_model import Gemini2VisionModel
from models.gemini2_chat_model import Gemini2ChatModel

# Load environment variables
load_dotenv()

# Configuration
port = os.getenv('PORT', 5050)
app = Flask(__name__)
CORS(app) 

# create an instance of the gemini-4 Vision model
gemini2_vision_model = Gemini2VisionModel()

# create an instance of the gemini-2 Chat model
gemini2_chat_model = Gemini2ChatModel()

async def ai_response(image_data: bytes, prompt: str, plant_type: str, plant_species: str) -> dict:
    try:
        image_file_stream = BytesIO(image_data)
        analysis_results = await gemini2_vision_model.analyze_image(image_file_stream, prompt, plant_type, plant_species)
        return analysis_results
    except Exception as e:
        print(f"Error analyzing image: {e}")
        return {
            "disease_detected": "Service Error",
            "confidence": "0%",
            "severity": "Unknown",
            "recommendations": [f"Error: {str(e)}"],
            "plant_health": "Unknown"
        }

def generate_pdf_report(analysis_results: dict) -> BytesIO:
    """Generate a PDF report from the AI model's analysis results."""
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    
    # Add title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, 750, "Plant Disease Diagnostic Report")
    
    # Add timestamp
    c.setFont("Helvetica", 10)
    c.drawString(50, 730, f"Generated on: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Add analysis results
    c.setFont("Helvetica", 12)
    y_position = 700
    
    # Add each result to the PDF
    for key, value in analysis_results.items():
        # Ensure the key is a string for drawing
        key_str = str(key).replace("_", " ").title()
        
        if isinstance(value, list):
            c.drawString(50, y_position, f"{key_str}:")
            y_position -= 15 # Smaller gap for list title
            for item in value:
                # Handle potentially long list items with wrap or truncation if needed
                item_str = str(item)
                # Basic wrap, you might need a more sophisticated text wrapping solution
                if len(item_str) > 80: # Simple check
                     item_str = item_str[:77] + "..."
                c.drawString(70, y_position, f"• {item_str}")
                y_position -= 15
                if y_position < 50: # Page break if too low
                    c.showPage()
                    c.setFont("Helvetica", 12)
                    y_position = 750
        else:
            value_str = str(value)
            # Basic wrap
            if len(value_str) > 70: # Simple check
                value_str = value_str[:67] + "..."

            c.drawString(50, y_position, f"{key_str}: {value_str}")
            y_position -= 20
        if y_position < 50: # Page break
            c.showPage()
            c.setFont("Helvetica", 12)
            y_position = 750
            
    c.save()
    buffer.seek(0)
    return buffer


@app.route('/')
def landing_page():
    return "Welcome to the Plant Disease Diagnostic Service"

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        response = make_response(('', 200))
        response.headers.add('Access-Control-Allow-Origin', '*') # Be more specific in production
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    try:
        message = request.json.get('message', '')
        response = gemini2_chat_model.chat(message)
        print(f"Response: {response}")
        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze_plant():
    if request.method == 'OPTIONS':
        response = make_response(('', 200))
        response.headers.add('Access-Control-Allow-Origin', '*') # Be more specific in production
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
        
    try:
        # Check if image file is present in the request
        if 'image' not in request.files:
            return {'error': 'No image file provided'}, 400
        
        image_file_storage = request.files['image']
        image_data = image_file_storage.read() # Read file bytes once

        plant_type = request.form.get('plant_type', '')
        plant_species = request.form.get('plant_species', '')
        prompt = request.form.get('prompt', '')
        
        print(f"Received image: {image_file_storage.filename} ({len(image_data)} bytes)")
        print(f"Received plant type: {plant_type}")
        print(f"Received plant species: {plant_species}")
        print(f"Received prompt: {prompt}")

        # Get Gemini response
        gemini_response = asyncio.run(ai_response(image_data, prompt, plant_type, plant_species))
        
        # Check for errors
        if not isinstance(gemini_response, dict) or gemini_response.get('disease_detected') == "Service Error" or "Error" in str(gemini_response.get('recommendations', '')): 
            error_detail = "Unknown service error."
            if isinstance(gemini_response, dict):
                if isinstance(gemini_response.get('recommendations'), list) and gemini_response['recommendations']:
                    error_detail = str(gemini_response['recommendations'][0])
                elif gemini_response.get('disease_detected') == "Service Error" and not error_detail: # if recommendations didn't provide more detail
                     error_detail = "AI service reported an error."
                elif 'disease_detected' in gemini_response:
                     error_detail = str(gemini_response['disease_detected'])

            print(f"Error from ai_response: {gemini_response}")
            return {'error': f"AI Analysis Failed: {error_detail}"}, 500
                
        # Generate PDF
        pdf_buffer = generate_pdf_report(gemini_response)
        
        # Create unique identifier for this analysis
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        
        # Store PDF buffer in memory (you might want to use a proper caching solution in production)
        if not hasattr(app, 'pdf_buffers'):
            app.pdf_buffers = {}
        app.pdf_buffers[timestamp] = pdf_buffer

        # Return analysis results and PDF URL
        return jsonify({
            'analysis': gemini_response,
            'pdf_timestamp': timestamp
        })
            
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return {'error': str(e)}, 500

# New endpoint for PDF download
@app.route('/download-pdf/<timestamp>', methods=['GET'])
def download_pdf(timestamp):
    try:
        if not hasattr(app, 'pdf_buffers') or timestamp not in app.pdf_buffers:
            return {'error': 'PDF not found'}, 404
            
        pdf_buffer = app.pdf_buffers[timestamp]
        
        # Clean up the stored buffer after sending
        del app.pdf_buffers[timestamp]
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'plant_diagnosis_report_{timestamp}.pdf'
        )
    except Exception as e:
        print(f"Error downloading PDF: {str(e)}")
        return {'error': str(e)}, 500

if __name__ == '__main__':
    actual_port = int(port)
    print(f"Starting microservice on http://localhost:{actual_port}")
    # Consider using threaded=True for development if asyncio.run is blocking other requests
    # For production with asyncio, an ASGI server like Uvicorn or Hypercorn is recommended
    # e.g., uvicorn app:app --host 0.0.0.0 --port 5050 --reload
    app.run(host='0.0.0.0', port=actual_port, debug=True) 