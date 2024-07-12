from django import forms
from database.models import ParkingImages


class ImageForm(forms.ModelForm):
    class Meta:
        model = ParkingImages
        fields = ["parking_id", "image"]
