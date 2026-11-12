from django.db import models

# Dealer and Review data live in the Node.js/MongoDB microservice
# (see /database). This Django app is only responsible for static
# pages, user authentication, and the car make/model catalog used
# to populate the review form, so it relies on Django's built-in
# auth.User model plus the two models below.


class CarMake(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name


class CarModel(models.Model):
    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        ('TRUCK', 'Truck'),
    ]

    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name='models')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=CAR_TYPES, default='SEDAN')

    def __str__(self):
        return f'{self.car_make.name} {self.name}'
