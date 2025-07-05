from django.urls import path
from .views import csrf_token, loginView, logoutView, registerView

urlpatterns = [
    path('csrf/', csrf_token),
    path('login/', loginView),
    path('logout/', logoutView),
    path('register/', registerView),
]