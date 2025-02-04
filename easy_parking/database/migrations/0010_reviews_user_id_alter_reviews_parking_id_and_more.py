# Generated by Django 5.0.3 on 2024-03-12 13:02

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("database", "0009_alter_reviews_rating"),
    ]

    operations = [
        migrations.AddField(
            model_name="reviews",
            name="user_id",
            field=models.ForeignKey(
                default=None,
                on_delete=django.db.models.deletion.CASCADE,
                to="database.userprofile",
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="reviews",
            name="parking_id",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="database.parkinglisting",
            ),
        ),
        migrations.CreateModel(
            name="favourite_location",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("location", models.CharField(max_length=100)),
                ("name", models.CharField(max_length=15)),
                (
                    "user_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="database.userprofile",
                    ),
                ),
            ],
        ),
    ]
