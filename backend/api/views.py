from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


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


@csrf_exempt
def check_medicines(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            medicines_list = data.get("medicines", [])

            if not medicines_list:
                return JsonResponse({"error": "No medicines provided"}, status=400)

            valid_medicines = Medication.objects.filter(
                name__in=medicines_list).values("name")
            valid_medicines = list(valid_medicines)

            return JsonResponse({"valid_medicines": valid_medicines}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def create_order(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")
            medicines = data.get("medicines", [])

            if not user_id or not medicines:
                return JsonResponse({"error": "User ID and medicines required"}, status=400)

            user = User.objects.get(id=user_id)
            order = Order.objects.create(user=user)

            for medicine in medicines:
                med = Medication.objects.get(name=medicine["name"])
                OrderItem.objects.create(
                    order=order, medication=med, quantity=medicine["quantity"])

            return JsonResponse({"message": "Order created successfully!"}, status=201)

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except Medication.DoesNotExist:
            return JsonResponse({"error": "Some medicines not available"}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


def get_orders(request):
    if request.method == "GET":
        orders = Order.objects.all()
        # Convert QuerySet to list
        orders_list = list(orders.values(
            "id", "medicines", "quantity", "created_at"))
        return JsonResponse({"orders": orders_list}, safe=False)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def register(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")

            if not username or not email or not password:
                return JsonResponse({"error": "Missing fields"}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already taken"}, status=400)

            user = User.objects.create_user(
                username=username, email=email, password=password)
            return JsonResponse({"message": "User registered successfully", "user_id": user.id}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            if not username or not password:
                return JsonResponse({"error": "Missing fields"}, status=400)

            user = authenticate(username=username, password=password)

            if user is not None:
                return JsonResponse({"message": "Login successful", "user_id": user.id}, status=200)
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=401)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)
