# Generated by Django 5.0.3 on 2024-03-24 03:10

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("database", "0035_cardetails"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="CarDetails",
            new_name="CardDetails",
        ),
    ]
