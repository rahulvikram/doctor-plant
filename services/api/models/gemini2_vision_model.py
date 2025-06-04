from google import genai
from google.genai import types
import base64
from io import BytesIO
import json
import os
import requests
import re

class Gemini2VisionModel:
    """
    Gemini 2 Vision model class that calls the compression service to compress the image,
    encodes the image, and calls the Gemini 2 Vision model to analyze the image.
    """
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
        self.compress_service_url = os.getenv('IMG_COMPRESS_URL', 'http://localhost:3000')

    def encode_and_compress_image(self, image_file: BytesIO) -> str:
        try:
            image_file.seek(0)

            files = {
                "file": ("image.jpg", image_file, "image/jpeg")
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
        Analyze the image using the Gemini 2 Vision model
        """
        # encode and compress the image
        try:
            compressed_base64 = self.encode_and_compress_image(image_file) # compress the image

            # verify the upstream data
            print("verifying upstream data")
            print(f"Prompt: {prompt}")
            print(f"Plant type: {plant_type}")
            print(f"Plant species: {plant_species}")

            """
            Configure the multimodal inputs
            """
            if compressed_base64.startswith("data:image"):
                base64_data = compressed_base64.split(",")[1]
            else:
                base64_data = compressed_base64

            if compressed_base64.startswith("data:image/png"):
                mime_type = "image/png"
            else:
                mime_type = "image/jpeg"

            image_bytes = base64.b64decode(base64_data) # decode the base64 data into 
            image = types.Part.from_bytes(
                data=image_bytes, 
                mime_type=mime_type
            )
           
            json_structure_guidance = """
                                {{
                                    "plant_species": "plant species",
                                    "disease_detected": "disease name or 'Healthy'",
                                    "confidence": "percentage like '85%'",
                                    "severity": "low" or "medium" or "high",
                                    "recommendations": ["action1", "action2"],
                                    "plant_health": "excellent" or "good" or "fair" or "poor" or "critical"
                                    "extra_info": "extra information about the plant, disease, or health"
                                }}""" 
            user_context_obj = {
                "plant_type": plant_type if plant_type else "Unknown",
                "plant_species": plant_species if plant_species else "Unknown",
                "symptoms_or_concerns": prompt if prompt else "Unknown"
            }

            # Convert Python dict to a JSON string to embed in the prompt
            user_context_json_string = json.dumps(user_context_obj)

            text_content = f"""Return ONLY a valid JSON object with this exact structure:
                {json_structure_guidance},
                Here is some additional context provided by the user (as a JSON object):
                {user_context_json_string}
            """
            
            # generate the response
            response = self.client.models.generate_content(
                model='gemini-2.0-flash',
                contents=[image, 'Analyze this plant image for diseases and health issues.'],
                config=types.GenerateContentConfig(
                    system_instruction=text_content
                ),
            )

            # get the response content
            ai_response_content = response.text

            # remove the ```json and ``` from the response
            if ai_response_content.strip().startswith("```"):
                # Remove triple backticks and optional 'json' after them
                ai_response_content = re.sub(r"^```(?:json)?\s*", "", ai_response_content.strip(), flags=re.IGNORECASE)
                ai_response_content = re.sub(r"\s*```$", "", ai_response_content.strip())

            # Attempt to parse the AI's response content as JSON
            try:
                analysis_result = json.loads(ai_response_content)
                return analysis_result
            
            except json.JSONDecodeError:
                print(f"Failed to decode AI response as JSON: {ai_response_content}")
                return { # Return an error structure if JSON parsing fails
                    "disease_detected": "JSON Decode Error",
                    "confidence": "0%",
                    "severity": "Unknown",
                    "recommendations": ["AI response was not valid JSON.", ai_response_content[:200] + "..."], # Include part of the bad response
                    "plant_health": "Unknown",
                    "extra_info": "Unknown"
                }

        except json.JSONDecodeError as e: # This might be redundant now with the one above
            print(f"Outer JSONDecodeError (should be caught by inner try-except): {e}")
            return {
                "disease_detected": "Analysis Error",
                "confidence": "0%",
                "severity": "Unknown",
                "recommendations": ["Unable to parse AI response"],
                "plant_health": "Unknown",
                "extra_info": "Unknown"
            }
        except Exception as e:
            print(f"Gemini Vision error: {e}")
            return {
                "disease_detected": "Gemini Vision Model Error",
                "confidence": "0%",
                "severity": "Unknown",
                "recommendations": [f"Error during API call or processing: {str(e)}"],
                "plant_health": "Unknown",
                "extra_info": "Unknown"
            }
