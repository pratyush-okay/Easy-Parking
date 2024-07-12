from django.core.serializers import serialize
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from database.models import ParkingListing, Reviews, Booking, UserProfile
from django.db.models import Count, Avg, Max
from collections import defaultdict
from django.db.models import Sum
from decimal import Decimal
from datetime import datetime, timedelta
from collections import Counter


@csrf_exempt
@api_view(["POST"])
def host_analytics(request):
    if request.method == "POST":
        try:
            host_email = request.data["user_email"]
            host_parkings = ParkingListing.objects.filter(host_email=host_email)
            all_bookings = Booking.objects.all()
            filtered_bookings = Booking.objects.filter(
                parking_id__host_email=host_email
            )

            ######### Total Listing by host #########
            total_lisitngs = ParkingListing.objects.filter(
                host_email=host_email
            ).count()

            ######### Total Booking for host #########

            total_bookings_count = 0
            # Iterate over each parking listing
            for parking in host_parkings:
                # Count the number of bookings associated with the parking listing
                bookings_count = Booking.objects.filter(parking_id=parking).count()

                # Increment the total bookings count
                total_bookings_count += bookings_count

            ######## Avg order value host ########

            host_total_income = 0
            host_bookings_count = 0
            host_parking_list = []
            AOV = 0

            for i in host_parkings:
                host_parking_list.append(i.parking_id)

            for b in all_bookings:
                for p in host_parking_list:
                    if b.parking_id.parking_id == p:
                        host_bookings_count += 1
                        host_total_income += b.price

            if host_bookings_count != 0:
                AOV = host_total_income / host_bookings_count

            ########### Booking percentage ###########
            # Count the total number of bookings for each parking listing
            bookings_count = (
                Booking.objects.filter(parking_id__host_email=host_email)
                .values("parking_id")
                .annotate(total_bookings=Count("parking_id"))
            )

            booking_percentage = {}
            if host_bookings_count != 0:
                for booking in bookings_count:
                    parking_id = booking["parking_id"]
                    total_bookings = booking["total_bookings"]
                    print(parking_id, total_bookings)
                    percentage = (total_bookings / host_bookings_count) * 100
                    booking_percentage[parking_id] = percentage

            ######## No of reviews for each host's parking ########

            # Get the number of reviews for each parking listing
            parking_listings_with_reviews_count = ParkingListing.objects.filter(
                host_email=host_email
            ).annotate(num_reviews=Count("reviews"))

            # Construct the dictionary for parking review counts
            parking_review_dict = []
            for parking_listing in parking_listings_with_reviews_count:
                parking_review_dict.append(
                    {
                        "parking_id": parking_listing.parking_id,
                        "num_reviews": parking_listing.num_reviews,
                    }
                )

            ######## avg rating for each host's parking ########

            parking_listings_with_avg_rating = ParkingListing.objects.filter(
                host_email=host_email
            ).annotate(avg_rating=Avg("reviews__rating"))

            parking_avg_rating_dict = []
            for parking_listing in parking_listings_with_avg_rating:
                avg_rating = parking_listing.avg_rating
                parking_avg_rating_dict.append(
                    {
                        "parking_id": parking_listing.parking_id,
                        "avg_rating": avg_rating if avg_rating is not None else 0,
                    }
                )

            ############## Unique guest ################

            unique_guest_emails = (
                Booking.objects.filter(parking_id__host_email=host_email)
                .values_list("user_email", flat=True)
                .distinct()
            )

            dict_data = {
                index: email for index, email in enumerate(unique_guest_emails)
            }

            ############ Booking Id ##################

            booking_ids = list(filtered_bookings.values_list("booking_id", flat=True))

            ###################################################

            # Initialize a defaultdict to store total income per month
            monthly_income = defaultdict(Decimal)

            # Filter Booking objects based on given booking_ids
            filtered_bookings = Booking.objects.filter(booking_id__in=booking_ids)

            # Iterate over filtered bookings to calculate total income per month
            for booking in filtered_bookings:
                # Extract start_date and end_date from booking
                start_date = booking.start_date
                end_date = booking.end_date

                # Calculate income for each day in the booking period
                current_date = start_date
                while current_date <= end_date:
                    # Extract month from current_date
                    month = current_date.strftime("%Y-%m")

                    # Add price to monthly income
                    monthly_income[month] += booking.price

                    # Move to next day
                    current_date = current_date + timedelta(days=1)

            # Convert defaultdict to regular dictionary
            monthly_income_dict = dict(monthly_income)

            print(monthly_income_dict)

            ###################################################

            # Construct the data dictionary for JSON response
            data = {
                "total_lisitngs": total_lisitngs,
                "total_bookings_count": total_bookings_count,
                "AOV": AOV,
                "parking_review_dict": parking_review_dict,
                "parking_avg_rating_dict": parking_avg_rating_dict,
                "booking_percentage": booking_percentage,
                "unique_guest_emails": dict_data,
                "booking_ids": booking_ids,
                "monthly_income": monthly_income_dict,
            }

            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@api_view(["GET"])
def admin_analytics(request):
    if request.method == "GET":
        try:

            guest_count = UserProfile.objects.filter(user_type="guest").count()
            host_count = UserProfile.objects.filter(user_type="host").count()
            listing_count = ParkingListing.objects.all().count()
            pub_listing_count = ParkingListing.objects.filter(publish=True).count()
            pvt_listing_count = ParkingListing.objects.filter(publish=False).count()
            booking_count = Booking.objects.all().count()

            ###################################################

            monthly_income = defaultdict(Decimal)

            # Filter Booking objects based on given booking_ids
            filtered_bookings = Booking.objects.all()

            # Iterate over filtered bookings to calculate total income per month
            for booking in filtered_bookings:
                # Extract start_date and end_date from booking
                start_date = booking.start_date
                end_date = booking.end_date

                # Calculate income for each day in the booking period
                current_date = start_date
                while current_date <= end_date:
                    # Extract month from current_date
                    month = current_date.strftime("%Y-%m")

                    # Add price to monthly income
                    monthly_income[month] += booking.price

                    # Move to next day
                    current_date = current_date + timedelta(days=1)

            # Convert defaultdict to regular dictionary
            monthly_income_dict = dict(monthly_income)

            ###################################################
            AOV = Booking.objects.aggregate(avg_price=Avg("price"))["avg_price"]

            ###################################################

            # print(
            #     guest_count,
            #     host_count,
            #     listing_count,
            #     pub_listing_count,
            #     pvt_listing_count,
            #     monthly_income_dict,
            #     AOV,
            # )
            # Construct the data dictionary for JSON response
            data = {
                "guest_count": guest_count,
                "host_count": host_count,
                "listing_count": listing_count,
                "pub_listing_count": pub_listing_count,
                "pvt_listing_count": pvt_listing_count,
                "booking_count": booking_count,
                "AOV": AOV,
                "monthly_income_dict": monthly_income_dict,
            }

            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@api_view(["POST"])
def guest_analytics(request):
    if request.method == "POST":
        try:
            guest_email = request.data["user_email"]

            total_bookings = Booking.objects.count()

            ###### No. Booking by user ###########

            booking_count = Booking.objects.filter(user_email=guest_email).count()

            ######## Booking percentage of users #######

            if total_bookings != 0:
                booking_percentage = (booking_count / total_bookings) * 100

            ###### Parkings Booked by user ########

            # Filter Booking objects by user_email
            booked_parkings = Booking.objects.filter(user_email=guest_email)

            # Extract the parking_ids from the filtered bookings
            booked_parking_ids = list(
                booked_parkings.values_list("parking_id", flat=True).distinct()
            )

            ###### Most Parkings Booked by user ########

            booked_parkings = Booking.objects.filter(user_email=guest_email)

            parking_ids = list(booked_parkings.values_list("parking_id", flat=True))

            counter = Counter(parking_ids)

            # Use the most_common() method to get the most common elements and their counts
            most_common_parking = counter.most_common()

            ###### No. Reviews by user ###########

            reviews_count = Reviews.objects.filter(user_email=guest_email).count()

            ###### Avg. Reviews by user ###########

            avg_rating = Reviews.objects.filter(user_email=guest_email).aggregate(
                avg_rating=Avg("rating")
            )["avg_rating"]

            AOV = Booking.objects.filter(user_email=guest_email).aggregate(
                avg_price=Avg("price")
            )["avg_price"]
            # Construct the data dictionary for JSON response
            data = {
                "booking_count": booking_count,
                "booking_percentage": booking_percentage,
                "AOV": AOV,
                "reviews_count": reviews_count,
                "avg_rating": avg_rating,
                "booked_parking_ids": booked_parking_ids,
                "most_booked_parkings": most_common_parking,
            }

            return JsonResponse(data, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
