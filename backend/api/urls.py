from django.urls import path
from . import views

urlpatterns = [
    path("process-image/", views.process_image, name="process_image"),
    path("check-medicines/", views.check_medicines, name="check_medicines"),
    path('create-order/', views.create_order, name='create_order'),
    path("api/get-orders/", views.get_orders, name="get_orders"),
    path("register/", views.register, name="register"),
    path("login/", views.login_view, name="login"),
]
