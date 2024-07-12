from django.shortcuts import render

# rest_framework imports
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.serializers import serialize
from django.http import JsonResponse
from django.db.models import Q
from database.models import ParkingListing, UserProfile, Likes, Booking
from datetime import datetime
from django.utils.dateparse import parse_date
from django.utils.dateparse import parse_datetime


"""

"""


@csrf_exempt
@api_view(["POST"])
def set_parking(request):

    if request.method == "POST":
        try:
            # Capture the newly created instance
            parking_instance = ParkingListing.objects.create(
                host_email=request.data["host_email"],
                location=request.data["location"],
                latitude=request.data["latitude"],
                longitude=request.data["longitude"],
                title=request.data["title"],
                description=request.data["description"],
                spot_type=request.data["spot_type"],
                status=request.data["status"],
                features=request.data["features"],
                hourly=request.data["hourly"],
                daily=request.data["daily"],
                monthly=request.data["monthly"],
                price_hourly=request.data["price_hourly"],
                price_daily=request.data["price_daily"],
                price_monthly=request.data["price_monthly"],
                parking_space_height=request.data["parking_space_height"],
                parking_space_width=request.data["parking_space_width"],
                parking_space_length=request.data["parking_space_length"],
            )

            # Construct a response including the ID
            response_data = {
                "message": "Parking created successfully",
                "parkingId_pk": parking_instance.pk,  # Include the ID of the new parking space
            }
            return Response(response_data, status=status.HTTP_201_CREATED)

        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["PUT"])
def update_parking(request):

    if request.method == "PUT":
        try:
            if not ParkingListing.objects.filter(
                parking_id=request.data["parking_id"],
            ).exists:
                return Response(
                    "Invalid Parking Id", status=status.HTTP_406_NOT_ACCEPTABLE
                )

            ParkingListing.objects.filter(
                parking_id=request.data["parking_id"],
            ).update(
                location=request.data["location"],
                latitude=request.data["latitude"],
                longitude=request.data["longitude"],
                title=request.data["title"],
                description=request.data["description"],
                spot_type=request.data["spot_type"],
                status=request.data["status"],
                features=request.data["features"],
                hourly=request.data["hourly"],
                daily=request.data["daily"],
                monthly=request.data["monthly"],
                price_hourly=request.data["price_hourly"],
                price_daily=request.data["price_daily"],
                price_monthly=request.data["price_monthly"],
                parking_space_height=request.data["parking_space_height"],
                parking_space_width=request.data["parking_space_width"],
                parking_space_length=request.data["parking_space_length"],
            )
            return Response("Parking updated successfully", status=status.HTTP_200_OK)

        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["GET"])
def get_all_parking(request):
    if request.method == "GET":
        queryset = ParkingListing.objects.all()
        data = serialize("json", queryset)
        return Response(data)


@csrf_exempt
@api_view(["POST"])
def get_parking_by_id(request):
    if request.method == "POST":
        try:
            queryset = ParkingListing.objects.filter(
                parking_id=request.data["parking_id"]
            )

            data = serialize("json", queryset)
            return Response(data)
        except Exception as e:
            return Response(
                "Something went wrong", status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    else:
        return Response("Method not allowed", status=status.HTTP_405_METHOD_NOT_ALLOWED)


@csrf_exempt
@api_view(["POST"])
def get_parking_by_host(request):
    if request.method == "POST":
        try:
            queryset = ParkingListing.objects.filter(
                host_email=request.data["host_email"]
            )

            data = serialize("json", queryset)
            return Response(data)
        except Exception as e:
            return Response(
                "Something went wrong", status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    else:
        return Response("Method not allowed", status=status.HTTP_405_METHOD_NOT_ALLOWED)


@csrf_exempt
@api_view(["PUT"])
def publish_parking(request):
    if request.method == "PUT":
        try:
            parking = ParkingListing.objects.get(parking_id=request.data["parking_id"])
            parking.publish = not parking.publish
            parking.save()

            return Response("Parking updated successfully", status=status.HTTP_200_OK)
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["DELETE"])
def delete_parking(request):
    if request.method == "DELETE":
        try:
            ParkingListing.objects.get(parking_id=request.data["parking_id"]).delete()

            return Response("Parking delete successfully", status=status.HTTP_200_OK)
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def get_user_likes(request):
    if request.method == "POST":
        try:
            queryset = Likes.objects.filter(user_email=request.data["user_email"])
            data = serialize("json", queryset)
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def add_user_likes(request):
    if request.method == "POST":
        try:
            if Likes.objects.filter(
                user_email=request.data["user_email"],
                parking_id=request.data["parking_id"],
            ).exists():
                return Response(
                    "User already like this parking",
                    status=status.HTTP_406_NOT_ACCEPTABLE,
                )
            print(request.data["user_email"], request.data["parking_id"])

            Likes.objects.create(
                user_email=request.data["user_email"],
                parking_id=request.data["parking_id"],
            )

            return Response("Like recoded", status=status.HTTP_200_OK)
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def remove_user_likes(request):
    if request.method == "POST":
        try:
            if not Likes.objects.filter(
                user_email=request.data["user_email"],
                parking_id=request.data["parking_id"],
            ).exists():
                return Response(
                    "Like does not exists",
                    status=status.HTTP_406_NOT_ACCEPTABLE,
                )

            Likes.objects.filter(
                user_email=request.data["user_email"],
                parking_id=request.data["parking_id"],
            ).delete()

            return Response("Like removed", status=status.HTTP_200_OK)
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def check_available(request):
    if request.method == "POST":
        try:
            overlap = False

            parking_id = request.data["parking_id"]
            start_date_str = request.data["start_date"]
            end_date_str = request.data["end_date"]
            start_time_str = request.data["start_time"]
            end_time_str = request.data["end_time"]

            start_datetime_obj = datetime.strptime(
                start_date_str + start_time_str, "%Y-%m-%d%H:%M:%S"
            )
            end_datetime_obj = datetime.strptime(
                end_date_str + end_time_str, "%Y-%m-%d%H:%M:%S"
            )

            filtered_bookings = Booking.objects.filter(parking_id=parking_id)

            for fb in filtered_bookings:
                existing_start_datetime = datetime.combine(fb.start_date, fb.start_time)
                existing_end_datetime = datetime.combine(fb.end_date, fb.end_time)

                # Check for overlap
                if (
                    start_datetime_obj < existing_end_datetime
                    and end_datetime_obj > existing_start_datetime
                ):
                    overlap = True
                    break

            if overlap:
                return Response(
                    False,
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    True, status=status.HTTP_200_OK
                )
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def check_available_all(request):
    if request.method == "POST":
        try:
            data = dict()

            start_date_str = request.data["start_date"]
            end_date_str = request.data["end_date"]
            start_time_str = request.data["start_time"]
            end_time_str = request.data["end_time"]

            start_datetime_obj = datetime.strptime(
                start_date_str + start_time_str, "%Y-%m-%d%H:%M:%S"
            )
            end_datetime_obj = datetime.strptime(
                end_date_str + end_time_str, "%Y-%m-%d%H:%M:%S"
            )

            bookings = Booking.objects.all()

            for booking in bookings:
                existing_start_datetime = datetime.combine(
                    booking.start_date, booking.start_time
                )
                existing_end_datetime = datetime.combine(
                    booking.end_date, booking.end_time
                )

                # Check for overlap
                if (
                    start_datetime_obj < existing_end_datetime
                    and end_datetime_obj > existing_start_datetime
                ):
                    data[booking.parking_id.parking_id] = True
                else:
                    data[booking.parking_id.parking_id] = False

            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)
