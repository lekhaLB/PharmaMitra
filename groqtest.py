from groq import Groq
import os

# Set your Groq API key
os.environ["GROQ_API_KEY"] = "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"

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Get list of available models
models_response = client.models.list()

# Extract model names correctly
if hasattr(models_response, "data"):  # Check if response has 'data' field
    available_models = [model.id for model in models_response.data]
    print("Available models:", available_models)
else:
    print("Unexpected response format:", models_response)
