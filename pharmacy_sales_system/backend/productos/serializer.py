from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Producto

class ProductoSerializer (serializers.ModelSerializer):
    codigo = serializers.CharField(validators=[])
    
    class Meta:
        model = Producto
        exclude = ['estado']
    
    def validate_codigo(self, value):
        if Producto.objects.filter(codigo=value,estado=True).exists():
            raise serializers.ValidationError("Producto Existente")
        return value


    def create(self, validated_data):
        codigo = validated_data['codigo']
        
        producto, _ = Producto.objects.update_or_create(
            codigo = codigo,
            defaults = {**validated_data, 'estado': True}
        )

        return producto;