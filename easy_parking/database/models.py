from django.db import models


# User's username and password will be stored in Django's default User model.
# User's email is their username
class UserProfile(models.Model):
    user_id = models.AutoField(primary_key=True, default=None)
    name = models.CharField(max_length=25)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=10)
    user_type = models.CharField(max_length=5)  # guest, host and admin
    disabled = models.BooleanField(default=False)


class CarDetails(models.Model):
    user_email = models.EmailField()
    nickname = models.CharField(max_length=20, unique=True)
    rego = models.CharField(max_length=10)
    vehicle_type = models.CharField(max_length=20)
    ev = models.BooleanField(default=False)
    default = models.BooleanField(default=False)


class ParkingListing(models.Model):
    parking_id = models.AutoField(primary_key=True)
    host_email = models.EmailField(default=None)
    location = models.CharField(max_length=100)  # AU address
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
    )  # 40.7128
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
    )  # 40.7128
    title = models.CharField(max_length=100)
    description = models.TextField()
    spot_type = models.CharField(max_length=20)  # driveway, garage, streetparking, etc.
    status = models.CharField(max_length=7, default='private')  # public or private
    features = models.TextField()  # Disable friendly, ...
    hourly = models.BooleanField(default=False)
    daily = models.BooleanField(default=False)  # 1 day. i.e 24 hours
    monthly = models.BooleanField(default=False)  ### change spelling
    features = models.CharField(
        max_length=255
    )  # disable accessable, near public transport, etc.
    hourly = models.BooleanField(default=False)
    daily = models.BooleanField(default=False)  # 1 day. i.e 24 hours
    monthly = models.BooleanField(default=False)
    price_hourly = models.DecimalField(max_digits=5, decimal_places=2)  # in dollars
    price_daily = models.DecimalField(max_digits=5, decimal_places=2)  # in dollars
    price_monthly = models.DecimalField(max_digits=5, decimal_places=2)  # in dollars
    parking_space_height = models.DecimalField(
        max_digits=5, decimal_places=2
    )  # in meters
    parking_space_width = models.DecimalField(
        max_digits=5, decimal_places=2
    )  # in meters
    parking_space_length = models.DecimalField(
        max_digits=5, decimal_places=2
    )  # in meters
    publish = models.BooleanField(default=False)
    reserved = models.BooleanField(default=False)


class Reviews(models.Model):
    review_id = models.AutoField(primary_key=True)
    parking_id = models.ForeignKey(ParkingListing, on_delete=models.CASCADE)
    user_email = models.EmailField(default=None)
    rating = models.DecimalField(max_digits=3, decimal_places=1, null=True)
    review = models.CharField(max_length=256, null=True)


class favourite_location(models.Model):
    user_email = models.EmailField(default=None)
    location = models.CharField(max_length=100)  # AU address
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
    )  # 40.7128
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
    )  # 40.7128
    name = models.CharField(max_length=15, unique=True)  # home, work, uni


# class Availability(models.Model):
#     availability_id = models.AutoField(primary_key=True)
#     parking_id = models.ForeignKey(ParkingListing, on_delete=models.CASCADE)
#     start_date = models.DateField()  # YYYY-MM-DD format
#     end_date = models.DateField()  # YYYY-MM-DD format
#     start_time = models.TimeField()  # HH:MM:SS format
#     end_time = models.TimeField()  # HH:MM:SS format


class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    # availability_id = models.ForeignKey(Availability, on_delete=models.CASCADE)
    user_email = models.EmailField(default=None)
    parking_id = models.ForeignKey(ParkingListing, on_delete=models.CASCADE)
    start_date = models.DateField(default="2000-01-01")
    end_date = models.DateField(default="2000-01-01")
    start_time = models.TimeField(default="00:00")
    end_time = models.TimeField(default="00:00")
    price = models.DecimalField(max_digits=5, decimal_places=2)  # in dollars
    active = models.BooleanField(default=True)


class Banking(models.Model):
    account_no = models.IntegerField()
    bsb = models.IntegerField()
    user_email = models.EmailField(default=None)
    balance = models.SmallIntegerField(default=100)
    # abn = models.IntegerField(default=0)


# transaction table
class Transaction(models.Model):
    transaction_id = models.AutoField(primary_key=True, default=None)
    Booking_id = models.ForeignKey(Booking, on_delete=models.DO_NOTHING)
    sender = models.CharField(max_length=30)
    receiver = models.CharField(max_length=30)
    amount = models.SmallIntegerField()
    time = models.DateTimeField(auto_now=True)


class CardDetails(models.Model):
    card_number = models.CharField(max_length=16, default=None)
    card_holder_name = models.CharField(max_length=50, default=None)
    expiration_date = models.DateField(default=None)
    cvv = models.CharField(max_length=4, default=None)
    balance = models.SmallIntegerField(default=200)


class Likes(models.Model):
    user_email = models.EmailField()
    parking_id = models.SmallIntegerField()


class ParkingImages(models.Model):
    parking_id = models.ForeignKey(ParkingListing, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="parking/")


class ProfilePicture(models.Model):
    user_email = models.EmailField()
    image = models.ImageField(upload_to="profile/")
