from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import VentaSerializer, DetalleVentaSerializer
from .models import Venta, DetalleVenta

class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all().order_by('-fecha')
    serializer_class = VentaSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post']

class DetalleVentaViewSet(viewsets.ModelViewSet):
    queryset = DetalleVenta.objects.all()
    serializer_class = DetalleVentaSerializer
    permission_classes = [IsAuthenticated]