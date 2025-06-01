from flask import Flask, request, send_file
import requests
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from io import BytesIO
import time
from dotenv import load_dotenv
from model.gpt4_vision_model import GPT4VisionModel

# Load environment variables
load_dotenv()

app = Flask(__name__)


# Configuration
port = os.getenv('PORT', 5050)
AI_MODEL_API_URL = os.getenv('AI_MODEL_URL', f"http://localhost:{port}/analyze")
MAX_PROCESSING_TIME = 180  # 3 minutes in seconds

def ai_response(image_file: BytesIO, prompt: str, max_processing_time: int) -> dict:
    # create an instance of the GPT-4 Vision model
    gpt4_vision_model = GPT4VisionModel()

    # analyze the image
    try:
        analysis_results = gpt4_vision_model.analyze_image(image_file)
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
        if isinstance(value, list):
            c.drawString(50, y_position, f"{key}:")
            y_position -= 20
            for item in value:
                c.drawString(70, y_position, f"• {item}")
                y_position -= 20
        else:
            c.drawString(50, y_position, f"{key}: {value}")
            y_position -= 20
    
    c.save()
    buffer.seek(0)
    return buffer

@app.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze_plant():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        # Check if image file is present in the request
        if 'image' not in request.files:
            return {'error': 'No image file provided'}, 400
        
        image_file = request.files['image']
        prompt = request.form.get('prompt', '')
        
        print(f"Received image: {image_file.filename}")
        print(f"Received prompt: {prompt}")
        
        # For testing, use mock AI response
        ai_response = ai_response(image_file, prompt, AI_MODEL_API_URL, MAX_PROCESSING_TIME)
        print("Generated mock AI response:", ai_response)
        
        # Generate PDF report
        pdf_buffer = generate_pdf_report(ai_response)
        print("Generated PDF report")
        
        # Return the PDF file
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='plant_diagnosis_report.pdf'
        )
        
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return {'error': str(e)}, 500

if __name__ == '__main__':
    print("Starting microservice on http://localhost:5050")
    app.run(host='0.0.0.0', port=port, debug=True) 