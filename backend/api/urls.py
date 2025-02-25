from django.urls import path
from .views import process_image

urlpatterns = [
    path("process-image/", process_image.as_View(), name="process_image"),
]
