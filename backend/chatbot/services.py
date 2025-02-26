# backend/chatbot/services.py
import os
from typing import Dict, List, Callable, Any
import google.generativeai as genai
from django.conf import settings


class GeminiChatService:
    """Service for handling interactions with the Gemini API."""

    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY") or getattr(
            settings, "GEMINI_API_KEY", None)
        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY not found in environment variables or settings")

        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

        # Initialize system prompt and history
        self.system_prompt = """You are RxAssist, a helpful pharmacy assistant chatbot. 
You can help with:
- Explaining medication instructions
- Providing general information about medications
- Explaining common side effects
- Suggesting questions to ask pharmacists
- Explaining prescription abbreviations

You should NOT:
- Provide medical advice or diagnoses
- Recommend specific medications
- Suggest changing dosages
- Make claims about drug effectiveness for specific conditions

Always recommend consulting a pharmacist or doctor for specific medical questions.
Use clear, simple language and be helpful but cautious."""

        self.chat_history = [{
            "role": "system",
            "content": self.system_prompt
        }]

        self.chat_session = self.model.start_chat(history=[])

    def send_message(self, message: str) -> str:
        """Send a message to Gemini and get a response."""
        try:
            # Add user message to history
            self.chat_history.append({
                "role": "user",
                "content": message
            })

            # Get response from Gemini
            response = self.chat_session.send_message(message)
            response_text = response.text

            # Add assistant response to history
            self.chat_history.append({
                "role": "assistant",
                "content": response_text
            })

            return response_text
        except Exception as e:
            print(f"Error in Gemini chat service: {str(e)}")
            raise

    def stream_message(self, message: str, callback: Callable[[str], None]) -> None:
        """Stream a response from Gemini."""
        try:
            # Add user message to history
            self.chat_history.append({
                "role": "user",
                "content": message
            })

            # Stream response from Gemini
            response = self.chat_session.send_message(message, stream=True)

            full_response = ""
            for chunk in response:
                chunk_text = chunk.text
                full_response += chunk_text
                callback(chunk_text)

            # Add complete response to history
            self.chat_history.append({
                "role": "assistant",
                "content": full_response
            })
        except Exception as e:
            print(f"Error in Gemini chat service streaming: {str(e)}")
            raise

    def clear_history(self) -> None:
        """Clear chat history except for the system prompt."""
        self.chat_history = [{
            "role": "system",
            "content": self.system_prompt
        }]
        # Reset chat session
        self.chat_session = self.model.start_chat(history=[])


# Create a singleton instance
gemini_service = GeminiChatService()
