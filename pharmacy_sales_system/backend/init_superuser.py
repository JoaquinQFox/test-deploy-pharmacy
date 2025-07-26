import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pharmacy_sales_system.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username   = os.environ.get("DJANGO_DEFAULT_USERNAME")
password   = os.environ.get("DJANGO_DEFAULT_PASSWORD")
first_name = os.environ.get("DJANGO_DEFAULT_FIRST_NAME")
last_name  = os.environ.get("DJANGO_DEFAULT_LAST_NAME")
rol        = os.environ.get("DJANGO_DEFAULT_ROL")

if username and password and first_name and last_name and rol:
    if not User.objects.filter(username=username).exists():

        User.objects.create_superuser(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            rol=rol
        )

        print("Usuario creado")

    else:
        print(f"Usuario No creado")

else:
    print("Faltan variables de entorno")