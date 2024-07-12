from django.urls import path

from image import views

urlpatterns = [
    path("parking/upload", views.parking_upload, name="parking_upload"),
    path("parking/get", views.parking_image_get, name="parking_image_get"),
]
