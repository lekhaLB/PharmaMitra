from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .scripts.OcrTest import extract_text_from_image, filter_medicines_with_llama
from .models import Medicine
import json


@csrf_exempt
def process_image(request):
    if request.method == 'POST' and request.FILES.get("image"):
        image_file = request.FILES["image"]

        # Extract text using OCR
        extracted_text, error = extract_text_from_image(image_file)
        if error:
            return JsonResponse({"error": error}, status=500)

        # Use LLaMA to filter medicine names
        medicine_data = filter_medicines_with_llama(extracted_text)

        # Match with database
        medicines = []
        for line in medicine_data.split("\n"):
            parts = line.split(" - ")
            if len(parts) == 2:
                name, dosage = parts
                medicine = Medicine.objects.filter(
                    name__icontains=name).first()
                if medicine:
                    medicines.append({
                        "name": medicine.name,
                        "dosage": dosage,
                        "price": medicine.price
                    })

        return JsonResponse({"medicines": medicines}, status=200)

    return JsonResponse({"error": "Invalid request"}, status=400)
