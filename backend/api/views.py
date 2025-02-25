from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
# Import functions
from api.scripts.OcrTest import extract_text_from_image, filter_medicines_with_llama


@csrf_exempt  # Temporarily disable CSRF for testing
def process_image(request):
    if request.method == "POST":
        if "image" not in request.FILES:
            return JsonResponse({"error": "No image uploaded"}, status=400)

        # Get the uploaded image
        image = request.FILES["image"]
        extracted_text = extract_text_from_image(image)
        if extracted_text:
            medicines = filter_medicines_with_llama(extracted_text)
            return JsonResponse({"extracted_text": extracted_text, "medicines": medicines}, status=200)
        else:
            return JsonResponse({"error": "No text detected in image"}, status=400)

        # Save it temporarily for debugging
        # file_path = default_storage.save(f"uploads/{image.name}", image)

        # return JsonResponse({"message": "Image received", "file_path": file_path}, status=200)

    return JsonResponse({"error": "Invalid request"}, status=400)


# from .ocr import extract_text_from_image, filter_medicines_with_llama  # Import functions

# @csrf_exempt  # Remove CSRF for testing, secure properly in production
# def process_image(request):
#     if request.method == "POST" and request.FILES.get("image"):
#         try:
#             # Read image file
#             image_file = request.FILES["image"].read()

#             # Extract text using OCR
#             extracted_text = extract_text_from_image(image_file)

#             # Filter medicines from extracted text
#             if extracted_text:
#                 medicines = filter_medicines_with_llama(extracted_text)
#                 return JsonResponse({"extracted_text": extracted_text, "medicines": medicines}, status=200)
#             else:
#                 return JsonResponse({"error": "No text detected in image"}, status=400)

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Invalid request"}, status=400)
