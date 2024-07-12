from django.contrib import admin
from django.urls import path

from emails import views

urlpatterns = [
    path("otp/", views.send_otp_view, name="send_otp_view"),
    path("otp/check/", views.check_otp_veiw, name="check_otp_veiw"),
    path("receipt/", views.send_receipt_view, name="send_receipt_view"),
    path("notification/", views.send_notification_view, name="send_notification_view"),
]
