from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from .serializer import ProductoSerializer
from .models import Producto

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
