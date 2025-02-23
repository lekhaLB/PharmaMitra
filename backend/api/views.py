from django.shortcuts import render
import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
import firebase_admin
from firebase_admin import credentials, firestore
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_PATH = os.path.join(BASE_DIR, "serviceAccountKey.json")

# 🔥 Initialize Firebase
cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
firebase_admin.initialize_app(cred)

db = firestore.client()


@swagger_auto_schema(
    method='get',
    operation_description="Retrieve all medications from Firestore",
    responses={200: "Success"},
)
@api_view(["GET"])
def get_medications(request):
    medications = db.collection("medications").stream()
    data = [{**doc.to_dict(), "id": doc.id} for doc in medications]
    return Response(data)


@api_view(["POST"])
def add_medication(request):
    new_med = request.data
    doc_ref = db.collection("medications").add(new_med)
    return Response({"id": doc_ref[1].id, **new_med}, status=201)
