from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage

import json
from .models import Medication, Order, OrderItem
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


def create_order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")  # Ensure frontend sends user_id
            medicines_list = data.get("medicines", [])

            user = User.objects.get(id=user_id)

            matched_medications = Medication.objects.filter(
                name__in=medicines_list)

            if not matched_medications.exists():
                return JsonResponse({"error": "No matching medicines found."}, status=400)

            order = Order.objects.create(user=user, total_price=0.00)

            total_price = 0.00
            for medication in matched_medications:
                OrderItem.objects.create(
                    order=order, medication=medication, quantity=1)
                total_price += float(medication.price)

            order.total_price = total_price
            order.save()

            return JsonResponse({"message": "Order created successfully", "order_id": order.id}, status=201)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
