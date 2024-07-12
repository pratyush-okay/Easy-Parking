from django.contrib import admin
from django.urls import path

from banking import views

urlpatterns = [
    path("transfer/", views.transfer, name="transfer"),
    path("card/verify", views.verify_card_details, name="verify_card_details"),
    path("card/set", views.set_card_details, name="set_card_details"),
    path("bank/set", views.set_bank_details, name="set_bank_details"),
    path("bank/get", views.get_bank_details, name="get_bank_details"),
    path("bank/update", views.update_bank_details, name="update_bank_details"),
]
