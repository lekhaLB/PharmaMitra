import io
import os
from google.cloud import vision
from groq import Groq

# Set Google Cloud credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "D:/2025/GH'2025/pharmamitra-e51fb26317fb.json"

# Initialize Google Cloud Vision API client
vision_client = vision.ImageAnnotatorClient()

# Set up Groq API key
os.environ["GROQ_API_KEY"] = "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"
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def extract_text_from_image(image_path):
    """Extracts text from an image using Google Cloud Vision OCR."""
    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)
    response = vision_client.document_text_detection(image=image)

    if response.error.message:
        raise Exception(f"Vision API error: {response.error.message}")

    return response.full_text_annotation.text if response.full_text_annotation else ""


def filter_medicines_with_llama(text):
    """Uses Groq (LLaMA 2) to extract medicine names and dosages from OCR text."""
    prompt = (
        "Extract only the medicine names and their respective dosages from the following prescription text. "
        "Ignore patient details, doctor details, addresses, and instructions. Return only the medicines with their dosages.\n\n"
        f"Prescription Text:\n\"\"\"\n{text}\n\"\"\"\n\n"
        "Return the output in this format:\nMedicine Name - Dosage\nExample:\nAmoxicillin - 250mg\nParacetamol - 500mg\n\n"
        "Now extract and return the medicines and dosages from the provided text."
    )

    response = client.chat.completions.create(
        model="llama-3.3-70b-specdec",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=200,
    )

    return response.choices[0].message.content.strip()


# Example usage
image_path = "sample2.jpg"
extracted_text = extract_text_from_image(image_path)
print("\nExtracted OCR Text:\n", extracted_text)

if extracted_text:
    medicine_info = filter_medicines_with_llama(extracted_text)
    print("\nExtracted Medicines & Dosages:\n", medicine_info)
else:
    print("No text detected.")
