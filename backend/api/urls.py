from django.urls import path
from .views import process_image, create_order

urlpatterns = [
    path("process-image/", process_image, name="process_image"),
    path('create-order/', create_order, name='create_order'),
]
