from django.urls import path
from login import views

urlpatterns = [
    path("", views.user_login_view, name="login"),
    path("register/", views.user_register_view, name="register"),
    path("logout/", views.logout_view, name="logout"),
    path("authenticate/", views.UserAuthenticate, name="UserAuthenticate"),
    path("reset/", views.reset_password, name="reset_password"),
]
