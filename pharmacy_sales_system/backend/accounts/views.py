from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect, csrf_exempt
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate, login, logout
import json

@ensure_csrf_cookie
def csrf_token(request):
    get_token(request)
    return JsonResponse({'detail': 'CSRF cookie set'})

@require_POST
def registerView(request):
    user = request.user

    if user.rol != 'admin':
        return JsonResponse({'detail': 'Permiso invalido'})

    # obtener datos del JSON y verificar (guardar desp)


@csrf_protect
@require_POST
# @csrf_exempt
def loginView(request):
    data = json.loads(request.body)
    user = authenticate(username = data.get("username"), password = data.get("password"))
    if user is not None:
        login(request, user)
        return JsonResponse({'detail': 'Login exitoso'})
        
    return JsonResponse({'detail': 'Credenciales invalidas'}, status=400)

@require_POST
# @csrf_exempt
def logoutView(request):
    logout(request)
    return JsonResponse({'detail': 'Logout exitoso'})
