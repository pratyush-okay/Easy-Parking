from django.core.serializers import serialize
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
import json

from database.models import Banking, CardDetails  # , Transaction


@csrf_exempt
@api_view(["POST"])
def transfer(request):
    if request.method == "POST":

        data = json.loads(request.body)
        print("print:", data)
        sender_card = data["sender_card"]
        receiver_email = data["receiver_email"]
        amount = data["amount"]

        try:
            sender_current_bal = CardDetails.objects.filter(card_number=sender_card)[
                0
            ].balance

            receiver_current_bal = Banking.objects.filter(user_email=receiver_email)[
                0
            ].balance

            print("print1:", sender_current_bal, receiver_current_bal)

            CardDetails.objects.filter(card_number=sender_card).update(
                balance=sender_current_bal - amount
            )

            Banking.objects.filter(user_email=receiver_email).update(
                balance=receiver_current_bal + amount
            )

            sender_current_bal = CardDetails.objects.filter(card_number=sender_card)[
                0
            ].balance

            receiver_current_bal = Banking.objects.filter(user_email=receiver_email)[
                0
            ].balance

            print("print:", sender_current_bal, receiver_current_bal)
            return Response("Transferred", status=status.HTTP_200_OK)
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def set_card_details(request):
    if request.method == "POST":
        try:
            CardDetails.objects.create(
                card_number=request.data.get("card_number"),
                card_holder_name=request.data.get("card_holder_name"),
                expiration_date=request.data.get("expiration_date"),
                cvv=request.data.get("cvv"),
            )
            return Response("Card details added", status=status.HTTP_200_OK)
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def verify_card_details(request):
    if request.method == "POST":
        try:
            CardDetails.objects.get(
                card_number=request.data.get("card_number"),
                card_holder_name=request.data.get("card_holder_name"),
                expiration_date=request.data.get("expiration_date"),
                cvv=request.data.get("cvv"),
            )
            return Response("Account verified!", status=status.HTTP_200_OK)
        except:
            return Response("Invalid Account!", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def set_bank_details(request):
    if request.method == "POST":
        try:
            print(request.data)
            if Banking.objects.filter(user_email=request.data["user_email"]).exists():
                print("inside if")
                Banking.objects.filter(user_email=request.data["user_email"]).update(
                    # abn=request.data["abn"],
                    account_no=request.data["account_no"],
                    bsb=request.data["bsb"],
                )
                return Response("Bank details updated", status=status.HTTP_200_OK)
            else:
                print("inside else")
                Banking.objects.create(
                    # abn=request.data["abn"],
                    account_no=request.data["account_no"],
                    bsb=request.data["bsb"],
                    user_email=request.data["user_email"],
                )
                return Response("Bank details added", status=status.HTTP_200_OK)
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def get_bank_details(request):
    if request.method == "POST":
        try:
            queryset = Banking.objects.filter(user_email=request.data["user_email"])
            data = serialize("json", queryset)
            return Response(data)
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def update_bank_details(request):
    if request.method == "POST":
        try:
            Banking.objects.filter(user_email=request.data["user_email"]).update(
                account_no=request.data["account_no"],
                bsb=request.data["bsb"],
            )
            return Response("Bank details added", status=status.HTTP_200_OK)
        except:
            return Response("Something went wrong", status=status.HTTP_400_BAD_REQUEST)
