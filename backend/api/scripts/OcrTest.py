# import io
# import os
# from google.cloud import vision
# from groq import Groq


# def extract_medicines_from_image(image_path):
#     """
#     Extracts text from an image using Google Cloud Vision OCR and filters medicine names and dosages using Groq's LLaMA model.
#     """
#     # Set Google Cloud credentials
#     os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "D:/2025/GH'2025/pharmamitra-e51fb26317fb.json"
#     vision_client = vision.ImageAnnotatorClient()

#     # Read image and extract text using Google Cloud Vision
#     with io.open(image_path, 'rb') as image_file:
#         content = image_file.read()

#     image = vision.Image(content=content)
#     response = vision_client.document_text_detection(image=image)

#     if response.error.message:
#         raise Exception(f"Vision API error: {response.error.message}")

#     extracted_text = response.full_text_annotation.text if response.full_text_annotation else ""

#     if not extracted_text:
#         return "No text detected."

#     # Set up Groq API key
#     os.environ["GROQ_API_KEY"] = "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"
#     client = Groq(api_key=os.getenv("GROQ_API_KEY"))

#     # Prepare prompt for LLaMA model
#     prompt = (
#         "Extract only the medicine names and their respective dosages from the following prescription text. "
#         "Ignore patient details, doctor details, addresses, and instructions. Return only the medicines with their dosages.\n\n"
#         f"Prescription Text:\n\"\"\"\n{extracted_text}\n\"\"\"\n\n"
#         "Return the output in this format:\nMedicine Name - Dosage\nExample:\nAmoxicillin - 250mg\nParacetamol - 500mg\n\n"
#         "Now extract and return the medicines and dosages from the provided text."
#     )

#     response = client.chat.completions.create(
#         model="llama-3.3-70b-specdec",
#         messages=[{"role": "user", "content": prompt}],
#         temperature=0.2,
#         max_tokens=200,
#     )

#     return response.choices[0].message.content.strip()

# # Usage example:
# # extracted_medicines = extract_medicines_from_image("sample2.jpg")
# # print(extracted_medicines)

import io
import os
from google.cloud import vision
from groq import Groq
from django.http import JsonResponse
from api.models import Medicine
from dotenv import load_dotenv

load_dotenv()

# Set Google Cloud credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "D:/2025/GH'2025/pharmamitra-e51fb26317fb.json"

# Initialize Google Cloud Vision API client
vision_client = vision.ImageAnnotatorClient()

# Set up Groq API key
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def extract_text_from_image(image_file):
    """Extracts text from an image using Google Cloud Vision OCR."""
    content = image_file.read()
    image = vision.Image(content=content)
    response = vision_client.document_text_detection(image=image)

    if response.error.message:
        return None, response.error.message

    return response.full_text_annotation.text if response.full_text_annotation else "", None


def filter_medicines_with_llama(text):
    """Uses LLaMA to extract medicine names and dosages."""
    prompt = (
        "Extract only the medicine names and dosages from the text.\n"
        f"Text:\n{text}\n"
        "Return format:\nMedicine - Dosage\nExample:\nParacetamol - 500mg"
    )

    response = client.chat.completions.create(
        model="llama-3.3-70b-specdec",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=200,
    )

    return response.choices[0].message.content.strip()
