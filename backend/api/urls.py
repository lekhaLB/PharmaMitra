from django.urls import path
from .views import get_medications, add_medication

urlpatterns = [
    path("medications/", get_medications),
    path("medications/add/", add_medication),
]
