from django.core.mail import send_mail, BadHeaderError
from rest_framework.response import Response

from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt


import random
import string


def generate_random_code():
    # Generate 2 random digits
    random_digits = "".join(random.choices(string.digits, k=2))

    # Generate 4 random characters
    random_chars = "".join(random.choices(string.ascii_letters, k=4))

    # Combine digits and characters
    random_code = random_digits + random_chars

    return random_code


otp = ""


@csrf_exempt
@api_view(["POST"])
def send_otp_view(request):
    global otp
    otp = generate_random_code()

    subject = "Welcome to Any Parking"
    message = (
        "To complete you login, this is your OTP ### "
        + otp
        + " ###"
        + "\nDon't Share this OTP with anyone"
    )
    sender = "easyparking.friends@gmail.com"
    recipient = [request.data.get("email")]

    try:
        send_mail(subject, message, sender, recipient, fail_silently=False)
        return Response("Mail sent!!!!")
    except BadHeaderError:
        return Response("Invalid header found.")


# can be made more secure


@csrf_exempt
@api_view(["POST"])
def check_otp_veiw(request):
    if request.method == "POST":

        user_otp = request.data.get("otp")
        global otp

        if user_otp == otp:
            otp = ""
            return Response("Correct OTP")
        else:
            return Response("Incorrect OTP")


@csrf_exempt
@api_view(["POST"])
def send_receipt_view(request):
    print(request.data.get("message"), request.data.get("email"))
    subject = "Any Parking Receipt"
    message = request.data.get("message")
    sender = "easyparking.friends@gmail.com"
    recipient = [request.data.get("email")]

    try:
        send_mail(subject, message, sender, recipient, fail_silently=False)
        return Response("Mail sent!!!!")
    except BadHeaderError:
        return Response("Invalid header found.")


@csrf_exempt
@api_view(["POST"])
def send_notification_view(request):
    print(request.data.get("message"), request.data.get("email"))
    subject = "Any Parking Notification"
    message = request.data.get("message")
    sender = "easyparking.friends@gmail.com"
    recipient = [request.data.get("email")]

    try:
        send_mail(subject, message, sender, recipient, fail_silently=False)
        return Response("Mail sent!!!!")
    except BadHeaderError:
        return Response("Invalid header found.")
