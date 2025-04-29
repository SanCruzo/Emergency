from django.db import models

class Ambulance(models.Model):
    plate_number = models.CharField(max_length=20, unique=True)
    staff = models.TextField()  # Ex: "John Doe, Jane Smith"
    location_lat = models.DecimalField(max_digits=9, decimal_places=6)
    location_long = models.DecimalField(max_digits=9, decimal_places=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.plate_number