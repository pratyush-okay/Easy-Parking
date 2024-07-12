from django.urls import path
from reviews import views

urlpatterns = [
    path("all/", views.get_all_reviews, name="get_all_reviews"),
    path("create/", views.review_create_view, name="review_create_view"),
    path("parking/", views.get_reviews_by_parking, name="get_reviews_by_parking"),
    path("user/", views.get_reviews_by_user, name="get_reviews_by_user"),
]
