from django.core.serializers import serialize
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from database.models import (
    UserProfile,
    favourite_location,
    CarDetails,
    ParkingListing,
    Reviews,
    Banking,
    Booking,
    Likes,
)
from django.contrib.auth.models import User


@csrf_exempt
@api_view(["GET"])
def get_all_users(request):
    if request.method == "GET":
        queryset = UserProfile.objects.all()
        data = serialize("json", queryset)
        return Response(data)


@csrf_exempt
@api_view(["POST"])
def get_user_by_email(request):
    if request.method == "POST":
        email = request.data["email"]
        queryset = UserProfile.objects.filter(email=email)
        data = serialize("json", queryset)
        return Response(data)


@csrf_exempt
@api_view(["PUT"])
def update_user_by_email(request):
    if request.method == "PUT":
        email = request.data["email"]
        phone = request.data["phone"]
        name = request.data["name"]
        disabled = request.data["disabled"]

        try:
            if not UserProfile.objects.filter(email=request.data["email"]).exists():
                return Response(
                    "User does not exists", status=status.HTTP_406_NOT_ACCEPTABLE
                )

            UserProfile.objects.filter(email=email).update(
                phone=phone,
                name=name,
                disabled=disabled,
            )

            return Response("User updated", status=status.HTTP_200_OK)
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def set_fav_loc(request):
    if request.method == "POST":
        favourite_location.objects.create(
            user_email=request.data.get("user_email"),
            location=request.data.get("location"),
            name=request.data.get("name"),
            latitude=request.data["latitude"],
            longitude=request.data["longitude"],
        )

        return Response("Favourite Location added for the user")


@csrf_exempt
@api_view(["POST"])
def get_fav_loc(request):
    if request.method == "POST":
        queryset = favourite_location.objects.filter(
            user_email=request.data["user_email"]
        )
        data = serialize("json", queryset)
        return Response(data)


@csrf_exempt
@api_view(["GET"])
def all_fav_loc(request):
    if request.method == "GET":
        queryset = favourite_location.objects.all()
        data = serialize("json", queryset)
        return Response(data)


@csrf_exempt
@api_view(["PUT"])
def update_fav_loc(request):
    if request.method == "PUT":
        try:
            old_name = request.data["old_name"]
            new_name = request.data["new_name"]

            if not favourite_location.objects.filter(
                user_email=request.data["user_email"], name=old_name
            ).exists():
                return Response(
                    "Old name not found",
                    status=status.HTTP_406_NOT_ACCEPTABLE,
                )

            if new_name != old_name:
                if favourite_location.objects.filter(
                    user_email=request.data["user_email"], name=new_name
                ).exists():
                    return Response(
                        "New name not unique",
                        status=status.HTTP_406_NOT_ACCEPTABLE,
                    )

            favourite_location.objects.filter(
                user_email=request.data["user_email"], name=old_name
            ).update(
                name=new_name,
                location=request.data.get("location"),
                latitude=request.data["latitude"],
                longitude=request.data["longitude"],
            )

            return Response("Fav updated", status=status.HTTP_200_OK)
        except:
            return Response("Somthing went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["DELETE"])
def delete_fav_loc(request):
    if request.method == "DELETE":
        try:
            if not favourite_location.objects.filter(
                user_email=request.data["user_email"], name=request.data["name"]
            ).exists():
                return Response(
                    "Name not found",
                    status=status.HTTP_406_NOT_ACCEPTABLE,
                )

            favourite_location.objects.filter(
                user_email=request.data["user_email"], name=request.data["name"]
            ).delete()

            return Response("Fav deleted", status=status.HTTP_200_OK)
        except:
            return Response("Somthing went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def set_car_details(request):
    if request.method == "POST":
        try:
            print(request.data)

            if CarDetails.objects.filter(
                user_email=request.data["user_email"], nickname=request.data["nickname"]
            ).exists():
                return Response(
                    "Try another name", status=status.HTTP_406_NOT_ACCEPTABLE
                )

            CarDetails.objects.create(
                user_email=request.data["user_email"],
                nickname=request.data["nickname"],
                rego=request.data["rego"],
                vehicle_type=request.data["vehicle_type"],
                ev=request.data["ev"],
                default=request.data["default"],
            )

            return Response("Car details added for the user", status=status.HTTP_200_OK)
        except:
            return Response("Somthing went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["PUT"])
def set_default_car(request):
    if request.method == "PUT":
        try:

            if not CarDetails.objects.filter(
                user_email=request.data["user_email"], nickname=request.data["nickname"]
            ).exists():
                return Response(
                    "Email not found", status=status.HTTP_406_NOT_ACCEPTABLE
                )

            print(request.data)

            car = CarDetails.objects.get(
                user_email=request.data["user_email"], nickname=request.data["nickname"]
            )

            print(car)
            car.default = not car.default

            car.save()

            return Response("Default car changed", status=status.HTTP_200_OK)
        except:
            return Response("Somthing went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def get_car_details(request):
    if request.method == "POST":
        try:
            queryset = CarDetails.objects.filter(user_email=request.data["user_email"])
            data = serialize("json", queryset)
            return Response(data)
        except:
            return Response("Somthing went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["PUT"])
def update_car_details(request):
    if request.method == "PUT":
        try:
            old_nickname = request.data["old_nickname"]
            new_nickname = request.data["new_nickname"]

            if not CarDetails.objects.filter(
                user_email=request.data["user_email"], nickname=old_nickname
            ).exists():
                return Response("Car not found", status=status.HTTP_406_NOT_ACCEPTABLE)

            print("Car found")

            if new_nickname != old_nickname:
                if CarDetails.objects.filter(
                    user_email=request.data["user_email"], nickname=new_nickname
                ).exists():
                    return Response(
                        "New name not unique",
                        status=status.HTTP_406_NOT_ACCEPTABLE,
                    )

            print("new car name found")

            CarDetails.objects.filter(
                user_email=request.data["user_email"], nickname=old_nickname
            ).update(
                nickname=new_nickname,
                rego=request.data["rego"],
                vehicle_type=request.data["vehicle_type"],
                ev=request.data["ev"],
            )

            return Response("Car details updated", status=status.HTTP_200_OK)
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["DELETE"])
def del_car_details(request):
    if request.method == "DELETE":
        try:

            if not CarDetails.objects.filter(
                user_email=request.data["user_email"], nickname=request.data["nickname"]
            ).exists():
                return Response("Car not found", status=status.HTTP_406_NOT_ACCEPTABLE)

            CarDetails.objects.filter(
                user_email=request.data["user_email"], nickname=request.data["nickname"]
            ).delete()

            return Response("Car details Deleted", status=status.HTTP_200_OK)
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["DELETE"])
def delete_user(request):
    if request.method == "DELETE":
        try:
            user_email = request.data["user_email"]

            # delete from Auth model
            User.objects.filter(username=user_email).delete()

            # delete form UserProfile
            UserProfile.objects.filter(email=user_email).delete()

            # delete user car details
            CarDetails.objects.filter(user_email=user_email).delete()

            # delete parking listing by user
            ParkingListing.objects.filter(host_email=user_email).delete()

            # delete all the reviews by user
            Reviews.objects.filter(user_email=user_email).delete()

            # delete user's fav loc
            favourite_location.objects.filter(user_email=user_email).delete()

            # deactive all the user bookings
            Booking.objects.filter(user_email=user_email).delete()
            Banking.objects.filter(user_email=user_email).delete()

            # delete all the user likes
            Likes.objects.filter(user_email=user_email).delete()

            return Response("All the user's data is deleted", status=status.HTTP_200_OK)
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)
