from django.urls import path, include
from rest_framework import routers
from .views import csrf_token, loginView, logoutView, registerView, UserViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('csrf/', csrf_token),
    path('login/', loginView),
    path('logout/', logoutView),
    path('register/', registerView),
    path('', include(router.urls)),
]