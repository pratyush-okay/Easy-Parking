# Generated by Django 5.0.3 on 2024-03-10 16:23

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("database", "0008_alter_reviews_rating"),
    ]

    operations = [
        migrations.AlterField(
            model_name="reviews",
            name="rating",
            field=models.DecimalField(decimal_places=1, max_digits=3),
        ),
    ]
