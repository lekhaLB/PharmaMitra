from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage


@csrf_exempt  # Temporarily disable CSRF for testing
def process_image(request):
    if request.method == "POST":
        if "image" not in request.FILES:
            return JsonResponse({"error": "No image uploaded"}, status=400)

        # Get the uploaded image
        image = request.FILES["image"]

        # Save it temporarily for debugging
        file_path = default_storage.save(f"uploads/{image.name}", image)

        return JsonResponse({"message": "Image received", "file_path": file_path}, status=200)

    return JsonResponse({"error": "Invalid request"}, status=400)
