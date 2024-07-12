from django.contrib import admin
from django.urls import path

from booking import views

urlpatterns = [
    path("create/", views.create_booking, name="create_booking"),
    path("user/", views.get_booking_by_user, name="get_booking_by_user"),
    path("host/", views.get_booking_by_host, name="get_booking_by_host"),
    path("parking/", views.get_booking_by_parking, name="get_booking_by_user"),
    path("delete/", views.delete_booking, name="delete_booking"),
    path("fulldelete/", views.full_delete_booking, name="full_delete_booking"),
    path("update/", views.update_booking, name="update_booking"),
    path("all/", views.get_all_booking, name="get_all_booking"),
]
