# Generated by Django 5.0.3 on 2024-03-21 12:59

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("database", "0030_alter_banking_card_holder_name_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="parkinglisting",
            name="title",
            field=models.CharField(default="", max_length=100),
            preserve_default=False,
        ),
    ]
