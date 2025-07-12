from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect, csrf_exempt
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate, login, logout, get_user_model
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializer import UserSerializer
from .models import User
# from productos.permissions import IsAdminUser
import json

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put', 'patch']

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        usuario = request.user
        serializer = UserSerializer(usuario)
        return Response(serializer.data)
    

@ensure_csrf_cookie
def csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

@csrf_protect
@require_POST
def registerView(request):
    User = get_user_model()
    user = request.user

    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'Usuario No Autenticado'}, status = 401)
    
    if user.rol != 'admin':
        return JsonResponse({'detail': 'Usuario Sin Permisos'}, status = 403)
    
    data = json.loads(request.body)
    username   = data.get("username")
    first_name = data.get("first_name")
    last_name  = data.get("last_name")
    password   = data.get("password")
    confirms   = data.get("confirms")
    rol        = data.get("rol")

    if user.rol == 'admin' and rol == 'propietario' or rol == 'admin':
        return JsonResponse({'detail': 'Usuario Sin Permisos'}, status = 403)

    if user.rol == 'propietario' and rol == 'propietario':
        return JsonResponse({'detail': 'Solo Existe Un Propietario'}, status = 403)

    if username == '' or first_name == '' or last_name == '' or rol == '' or password == '':
        return JsonResponse({'detail': 'Campos Inválidos'}, status = 400)

    if password != confirms:
        return JsonResponse({'detail': 'Contraseñas No Coinciden'}, status = 400)
    
    if User.objects.filter(username=username).exists():
        return JsonResponse({'detail': 'Usuario Existente'}, status = 400)
    
    data_user = {
        "username":username,
        "password":password,
        "first_name":first_name,
        "last_name":last_name,
        "rol": rol
    }
    User.objects.create_user(**data_user)
    
    return JsonResponse({'detail': 'Usuario Creado Exitosamente'}, status = 201)

@csrf_protect
@require_POST
# @csrf_exempt
def loginView(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse({'detail': 'Usuario y Contraseña Obligatorios'}, status = 400)

    user = authenticate(username=username, password=password)
    
    if user is not None:
        if not user.is_active:
            return JsonResponse({'detail': 'Usuario Inactivo'}, status = 403)
        
        login(request, user)
        return JsonResponse({'detail': 'Inicio de Sesión Exitoso'}, status = 200)
       
    return JsonResponse({'detail': 'Credenciales Invalidas'}, status = 400)

@csrf_protect
@require_POST
# @csrf_exempt
def logoutView(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'No Hay Sesión Activa'}, status = 403)

    logout(request)
    return JsonResponse({'detail': 'Sesión Cerrada Correctamente'}, status = 200)
