from django.urls import path
from parking import views

urlpatterns = [
    path("create/", views.set_parking, name="parking_create"),
    path("all/", views.get_all_parking, name="get_all_parking_view"),
    path("byid/", views.get_parking_by_id, name="get_parking_by_id"),
    path("byhost/", views.get_parking_by_host, name="get_parking_by_host"),
    path("publish/", views.publish_parking, name="parking_publish"),
    path("delete/", views.delete_parking, name="delete_parking"),
    path("update/", views.update_parking, name="update_parking"),
    path("likes/user/all", views.get_user_likes, name="get_user_likes"),
    path("likes/user/add", views.add_user_likes, name="add_user_likes"),
    path("likes/user/remove", views.remove_user_likes, name="remove_user_likes"),
    path("available/", views.check_available, name="check_available"),
    path("available/all", views.check_available_all, name="check_available_all"),
]
