from django.contrib import admin
from django.urls import path

from user import views

urlpatterns = [
    path("all/", views.get_all_users, name="get_all_users"),
    path("byemail/", views.get_user_by_email, name="get_user_by_email"),
    path("update/", views.update_user_by_email, name="update_user_by_email"),
    path("fav/set", views.set_fav_loc, name="set_fav_loc"),
    path("fav/get", views.get_fav_loc, name="get_fav_loc"),
    path("fav/update", views.update_fav_loc, name="update_fav_loc"),
    path("fav/delete", views.delete_fav_loc, name="delete_fav_loc"),
    path("fav/all", views.all_fav_loc, name="all_fav_loc"),
    path("cardetails/set", views.set_car_details, name="get_car_details"),
    path("cardetails/get", views.get_car_details, name="get_car_details"),
    path("cardetails/default", views.set_default_car, name="set_default_car"),
    path("cardetails/update", views.update_car_details, name="update_car_details"),
    path("cardetails/delete", views.del_car_details, name="del_car_details"),
    path("delete", views.delete_user, name="delete_user"),
]
