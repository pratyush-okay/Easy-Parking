from django.shortcuts import render

# rest_framework imports
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from database.models import UserProfile, Banking
from django.contrib.auth.models import User
import random

from django.contrib.auth import authenticate, login, logout

# from rest_framework_simplejwt.tokens import AccessToken

"""
user_login_view function works with rest api framework.
It takes email and password as input, checks if they are valid,
if they are valid it will response user_id, name, user_type of that
repective user.
else, it will response with Invalid credentials
"""


@csrf_exempt
@api_view(["POST"])
def user_register_view(request):

    if request.method == "POST":
        try:
            email = request.data["email"]
            if UserProfile.objects.filter(email=email).exists():
                return Response("Email already exists")
            elif User.objects.filter(username=email).exists():
                return Response("Email already exists")
            else:
                UserProfile.objects.create(
                    name=request.data["name"],
                    email=email,
                    phone=request.data["phone"],
                    user_type=request.data["user_type"],
                )
                User.objects.create_user(
                    username=email,
                    password=request.data["password"],
                )

            return Response("user successfully registered", status=status.HTTP_200_OK)
        except:
            return Response(
                "Opps!!! Something went wrong :(", status=status.HTTP_400_BAD_REQUEST
            )


@csrf_exempt
@api_view(["POST"])
def user_login_view(request):

    if request.method == "POST":

        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(username=email, password=password)
        if user is not None:
            login(request, user)
            # token = AccessToken.for_user(user)
            print("###########", request.user, request.user.is_authenticated)

            return Response("User Logged in successfully")
        else:
            return Response("Invalid credentials")


"""
user_register_view works with rest api framework,
it takes all the nessesary userdata, and enters it into the database.
if the data already exists then it Email already exists.
"""


# @csrf_exempt
# @api_view(["GET"])
def logout_view(request):
    # if request.method == "GET":
    print("###########", request.user, request.user.is_authenticated)
    if request.user.is_authenticated:
        logout(request)
        return JsonResponse({"message": "Logged out successfully"})
    else:
        return JsonResponse({"error": "No user is logged in"})


def UserAuthenticate(request):
    if request.user.is_authenticated:
        # User is authenticated, get username
        username = request.user.username
        return JsonResponse({"username": username})
    else:
        # User is not authenticated
        return JsonResponse({"error": "User is not authenticated"})


@csrf_exempt
@api_view(["PUT"])
def reset_password(request):
    if request.method == "PUT":
        email = request.data.get("email")
        new_password = request.data.get("new_password")
        try:
            user = User.objects.get(username=email)
            user.set_password(new_password)
            user.save()
            return Response("Passowrd changed", status=status.HTTP_200_OK)
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)
