from django.urls import path
from analytics import views

urlpatterns = [
    path("host", views.host_analytics, name="host_analytics"),
    path("admin", views.admin_analytics, name="admin_analytics"),
    path("guest", views.guest_analytics, name="guest_analytics"),
]
