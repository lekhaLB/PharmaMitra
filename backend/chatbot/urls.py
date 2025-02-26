# backend/chatbot/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('message/', views.send_message, name='send_message'),
    path('stream/', views.stream_message, name='stream_message'),
    path('clear/', views.clear_chat, name='clear_chat'),
]

# In your main urls.py, include this with:
# path('api/chatbot/', include('chatbot.urls')),
