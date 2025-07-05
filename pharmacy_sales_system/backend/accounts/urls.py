from django.urls import path
from .views import csrf_token, loginView, logoutView

urlpatterns = [
    path('csrf/', csrf_token),
    path('login/', loginView),
    path('logout/', logoutView),
]