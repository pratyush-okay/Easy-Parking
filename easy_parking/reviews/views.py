from django.core.serializers import serialize
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt

from database.models import Reviews, ParkingListing


@csrf_exempt
@api_view(["GET"])
def get_all_reviews(request):
    if request.method == "GET":
        queryset = Reviews.objects.all()
        data = serialize("json", queryset)
        return JsonResponse(data, safe=False)


# user id - input
# reviews by that user - output
@csrf_exempt
@api_view(["POST"])
def get_reviews_by_user(request):
    if request.method == "POST":
        queryset = Reviews.objects.filter(user_email=request.data.get("user_email"))
        data = serialize("json", queryset)
        return Response(data)
    else:
        return Response("Something went wrong")


# parking id - input
# reviews for that parking - output
@csrf_exempt
@api_view(["POST"])
def get_reviews_by_parking(request):
    if request.method == "POST":
        parking_id = request.data.get("parking_id")
        queryset = Reviews.objects.filter(parking_id=parking_id)
        data = serialize("json", queryset)
        return JsonResponse(data, safe=False)
    else:
        return Response("Something went wrong")


@csrf_exempt
@api_view(["POST"])
def review_create_view(request):
    if request.method == "POST":

        rating = request.data.get("rating")
        review = request.data.get("review")
        user_email = request.data.get("user_email")

        if rating is not None or review is not None:
            try:
                data = ParkingListing.objects.get(parking_id=request.data["parking_id"])
            except ParkingListing.DoesNotExist:
                return Response("Parking listing does not exist")

            Reviews.objects.create(
                parking_id=data,
                user_email=user_email,
                rating=rating,
                review=review,
            )
            return Response("Review created successfully")
        else:
            return Response("Rating or Review is required")
