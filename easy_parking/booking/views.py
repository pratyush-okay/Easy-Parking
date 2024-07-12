from django.core.serializers import serialize
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
import json

from database.models import Booking, UserProfile, Banking, ParkingListing


@csrf_exempt
@api_view(["POST"])
def create_booking(request):
    if request.method == "POST":
        data = json.loads(request.body)

        user_email = data["user_email"]
        parking_id = data["parking_id"]
        start_date = data["start_date"]
        end_date = data["end_date"]
        start_time = data["start_time"]
        end_time = data["end_time"]
        price = data["price"]
        try:
            parking = ParkingListing.objects.get(parking_id=parking_id)

            Booking.objects.create(
                user_email=user_email,
                parking_id=parking,
                start_date=start_date,
                end_date=end_date,
                start_time=start_time,
                end_time=end_time,
                price=price,
            )

            return Response("Booking created", status=status.HTTP_200_OK)
        except:
            return Response("Something went worng", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def get_booking_by_user(request):
    if request.method == "POST":
        try:
            queryset = Booking.objects.filter(user_email=request.data["user_email"])
            jsondata = serialize("json", queryset)
            # print(jsondata)
            return Response(jsondata, status=status.HTTP_200_OK)
        except:
            return Response("Something went worng", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def get_booking_by_host(request):
    if request.method == "POST":
        try:
            host_email = request.data[
                "host_email"
            ]  # Replace this with the host's email

            # Retrieve all parking listings associated with the given host
            parking_listings = ParkingListing.objects.filter(host_email=host_email)

            # Retrieve all bookings associated with the parking listings of the given host
            bookings = Booking.objects.filter(parking_id__in=parking_listings)
            # print(bookings.count())

            jsondata = serialize("json", bookings)
            # print(jsondata)
            return Response(jsondata, status=status.HTTP_200_OK)
        except:
            return Response("Something went worng", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def get_booking_by_parking(request):
    if request.method == "POST":
        try:
            queryset = Booking.objects.filter(parking_id=request.data["parking_id"])
            jsondata = serialize("json", queryset)
            # print(jsondata)
            return Response(jsondata, status=status.HTTP_200_OK)
        except:
            return Response("Something went worng", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["GET"])
def get_all_booking(request):
    if request.method == "GET":
        queryset = Booking.objects.all()
        jsondata = serialize("json", queryset)
        return Response(jsondata, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(["PUT"])
def delete_booking(request):
    if request.method == "PUT":
        data = json.loads(request.body)

        booking_id = data["booking_id"]
        try:
            try:
                Booking.objects.filter(booking_id=booking_id).update(active="False")
                return Response("Booking is inactive now", status=status.HTTP_200_OK)
            except:
                return Response(
                    "Booking id not found", status=status.HTTP_404_NOT_FOUND
                )
        except:
            return Response("Something went worng", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["PUT"])
def update_booking(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        try:
            if not Booking.objects.filter(
                booking_id=request.data["booking_id"]
            ).exists():
                return Response(
                    "Booking not found", status=status.HTTP_406_NOT_ACCEPTABLE
                )

            Booking.objects.filter(
                booking_id=request.data["booking_id"],
            ).update(
                start_date=data["start_date"],
                end_date=data["end_date"],
                start_time=data["start_time"],
                end_time=data["end_time"],
                price=data["price"],
            )

            return Response("Booking Updated", status=status.HTTP_200_OK)
        except:
            return Response("Something went worng", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["DELETE"])
def full_delete_booking(request):
    if request.method == "DELETE":
        data = json.loads(request.body)

        booking_id = data["booking_id"]
        try:
            if not Booking.objects.filter(booking_id=booking_id).exists():
                return Response(
                    "Booking id not found", status=status.HTTP_404_NOT_FOUND
                )
            Booking.objects.filter(booking_id=booking_id).delete()
            return Response("Booking Deleted", status=status.HTTP_200_OK)
        except:
            return Response("Something went worng", status=status.HTTP_400_BAD_REQUEST)
