# Generated by Django 5.0.3 on 2024-03-20 08:38

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("database", "0026_remove_banking_user_id_remove_booking_user_id_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="parkinglisting",
            name="host_email",
        ),
    ]
