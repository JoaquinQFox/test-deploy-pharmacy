from rest_framework import permissions

class ListarRestriccion (permissions.BasePermission):
    
    def has_permission(self, request, view):
       user = request.user

       if request.method == 'GET':
           return user.rol in ['admin', 'propietario']
       
       if request.method in ['PUT', 'PATCH']:
           return user.rol in ['admin', 'propietario']
       
       return False