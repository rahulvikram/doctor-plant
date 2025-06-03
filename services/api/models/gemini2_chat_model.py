from google import genai
from google.genai import types
import base64
from io import BytesIO
import json
import os
import requests
import re

class Gemini2ChatModel:
    """
    Gemini 2 Chat model class that calls the Gemini 2 Chat model to engage in a conversation with the user.
    """
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
        self.chat_session = self.client.chats.create(model='gemini-2.0-flash')
        
    def chat(self, message: str) -> dict:
        """
        Engage in a conversation with the user using the Gemini 2 Chat model
        """
        # encode and compress the image
        try:
            response = self.chat_session.send_message(
                message,
                config=types.GenerateContentConfig(
                    system_instruction="You are a helpful assistant that can answer questions reagrding plant diseases and health issues. You can also help with tasks related to plant care and maintenance. Ensure that you stay on the topic of plants and plant care."
                )
            )
            return response.text
        except Exception as e:
            print(f"Gemini Chat error: {e}")
            return {"Gemini Chat Error": str(e)}

    def close_chat(self):
        """
        Close the chat session
        """
        self.chat_session.close()
