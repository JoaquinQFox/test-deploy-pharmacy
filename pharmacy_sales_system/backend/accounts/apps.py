from django.apps import AppConfig
import os

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        from django.contrib.auth import get_user_model
        
        # Superuser Defined
        if os.environ.get("DJANGO_DEFAULT_SUPERUSER"):
            
            username   = os.environ.get("DJANGO_DEFAULT_USERNAME")
            password   = os.environ.get("DJANGO_DEFAULT_PASSWORD")
            first_name = os.environ.get("DJANGO_DEFAULT_FIRST_NAME")
            last_name  = os.environ.get("DJANGO_DEFAULT_LAST_NAME")
            rol        = os.environ.get("DJANGO_DEFAULT_ROL")

            if username and password and first_name and last_name and rol:
                
                try:

                    User = get_user_model()
                    if not User.objects.filter(username=username).exists():

                        User.objects.create_superuser(
                            username=username,
                            password=password,
                            first_name=first_name,
                            last_name=last_name,
                            rol=rol
                        )

                        print("Usuario creado")

                except Exception as e:
                    print(f"Usuario No creado: {e}")