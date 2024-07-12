from rest_framework import serializers
from database.models import ParkingImages


class ParkingImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingImages
        fields = ("id", "parking_id", "image")
