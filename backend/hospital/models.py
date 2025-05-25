from django.db import models

class Hospital(models.Model):
    name = models.CharField(max_length=100)
    hosp_lat = models.DecimalField(max_digits=9, decimal_places=6)
    hosp_long = models.DecimalField(max_digits=9, decimal_places=6)
    address = models.TextField()

    def __str__(self):
        return self.name