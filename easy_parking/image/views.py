from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .forms import ImageForm
from database.models import ParkingImages
from .serializers import ParkingImagesSerializer
from rest_framework import status
import os
from django.conf import settings


@api_view(["POST"])
def parking_upload(request):
    if request.method == "POST":
        parking_id = request.data["parking_id"]

        parking_images = ParkingImages.objects.filter(parking_id=parking_id)

        if parking_images.exists():
            parking_images[0].image.delete()
            parking_images.delete()

        form = ImageForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return Response({"message": "Image uploaded successfully"}, status=201)
        return Response(form.errors, status=400)


@api_view(["POST"])
def parking_image_get(request):
    if request.method == "POST":
        try:
            # Query the database for parking images based on the parking_id
            parking_images = ParkingImages.objects.filter(
                parking_id=request.data["parking_id"]
            )

            # Serialize the data
            serializer = ParkingImagesSerializer(parking_images, many=True)

            # Return the serialized data as JSON response
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ParkingImages.DoesNotExist:
            # Handle the case where the parking ID does not exist
            return Response(
                {"message": "Parking ID does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            # Handle other exceptions
            return Response(
                {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
