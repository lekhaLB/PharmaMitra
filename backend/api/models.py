from django.db import models
from django.contrib.auth.models import User


class Medicine(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name


class Prescription(models.Model):
    image = models.ImageField(upload_to='prescriptions/')
    extracted_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription {self.id}"


class Medication(models.Model):
    name = models.CharField(max_length=255, unique=True)
    dosage = models.CharField(
        max_length=50, default="Unknown")  # e.g., "500mg"
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} - {self.dosage}"


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    medications = models.ManyToManyField(Medication, through='OrderItem')
    total_price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
