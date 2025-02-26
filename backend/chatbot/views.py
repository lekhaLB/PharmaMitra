# backend/chatbot/views.py
import json
from django.http import JsonResponse, StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .services import gemini_service


@csrf_exempt
@require_POST
def send_message(request):
    """Handle sending a message to the chatbot."""
    try:
        data = json.loads(request.body)
        message = data.get('message')

        if not message:
            return JsonResponse({'error': 'Message is required'}, status=400)

        response = gemini_service.send_message(message)
        return JsonResponse({'response': response})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_POST
def stream_message(request):
    """Stream a response from the chatbot."""
    try:
        data = json.loads(request.body)
        message = data.get('message')

        if not message:
            return JsonResponse({'error': 'Message is required'}, status=400)

        def event_stream():
            """Generate SSE events."""
            try:
                def send_chunk(chunk):
                    data = json.dumps({"chunk": chunk})
                    yield f"data: {data}\n\n"

                # Stream the response
                gemini_service.stream_message(message, send_chunk)

                # Signal completion
                yield f"data: {json.dumps({'done': True})}\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"

        response = StreamingHttpResponse(
            event_stream(),
            content_type='text/event-stream'
        )
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'  # Disable Nginx buffering
        return response
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_POST
def clear_chat(request):
    """Clear the chat history."""
    try:
        gemini_service.clear_history()
        return JsonResponse({'success': True, 'message': 'Chat history cleared'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
