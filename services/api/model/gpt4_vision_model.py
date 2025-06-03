import openai
import base64
from io import BytesIO
import json
import os
import requests

class GPT4VisionModel:
    """
    GPT-4 Vision model class that calls the compression service to compress the image,
    encodes the image, and calls the GPT-4 Vision model to analyze the image.
    """
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.compress_service_url = os.getenv('IMG_COMPRESS_URL', 'http://localhost:3000')

    def encode_and_compress_image(self, image_file: BytesIO) -> str:
        try:
            image_file.seek(0)

            files = {
                "file": (image_file.filename, image_file, "image/jpeg")
            }

            # make a request to the compress service
            response = requests.post(
                f"{self.compress_service_url}/compress",
                files=files,
                timeout=30
            )
            
            if response.status_code != 200:
                raise Exception(f"Error compressing image: {response.status_code}")

            # parse the response
            data = response.json()
            compressed_base64 = data['compressedFile']
            print(f"Compressed image: {compressed_base64}")

            # return the compressed image
            return compressed_base64
            
        except requests.RequestException as e:
            # log the request error
            print(f"Error encoding image: {e}")

            # If fail: return image encoded without compressing
            return self._encode_image(image_file)
        except Exception as e:
            # log the error
            print(f"Error encoding image: {e}")
            return self._encode_image(image_file)

    def _encode_image(self, image_file: BytesIO) -> str:
        """
        Fallback method to encode image if the image is not compressed
        """    
        image_file.seek(0)

        # use Python's base64 module to encode the image
        base64_string = base64.b64encode(image_file.read()).decode('utf-8')
        return f"data:image/jpeg;base64,{base64_string}"
    
    async def analyze_image(self, image_file: BytesIO, prompt: str, plant_type: str, plant_species: str) -> dict:
        """
        Analyze the image using the GPT-4 Vision model
        """
        # encode and compress the image
        try:
           compressed_base64 = self.encode_and_compress_image(image_file)

           response = await self.client.chat.completions.create(
               model="gpt-4-vision-preview",
               messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": f"""Analyze this plant image for diseases and health issues. 
                                Return ONLY a valid JSON object with this exact structure:
                                {
                                    "disease_detected": "disease name or 'Healthy'",
                                    "confidence": "percentage like '85%'",
                                    "severity": "None/Low/Medium/High",
                                    "recommendations": ["action1", "action2"],
                                    "plant_health": "percentage like '70%'"
                                }
                                Here is some additional context provided by the user: {
                                    "plant_type": {plant_type if plant_type else "Unknown"},
                                    "plant_species": {plant_species if plant_species else "Unknown"},
                                    "symptoms_or_concerns": {prompt if prompt else "Unknown"}
                                }
                                """
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": compressed_base64
                                }
                            }
                        ]
                    }
               ]
           )
        except json.JSONDecodeError:
            return {
                "disease_detected": "Analysis Error",
                "confidence": "0%",
                "severity": "Unknown",
                "recommendations": ["Unable to parse AI response"],
                "plant_health": "Unknown"
            }
        except Exception as e:
            print(f"GPT-4 Vision error: {e}")
            return {
                "disease_detected": "GPT-4 Vision Model Error",
                "confidence": "0%",
                "severity": "Unknown",
                "recommendations": [f"Error: {str(e)}"],
                "plant_health": "Unknown"
            }
