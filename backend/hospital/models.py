from django.db import models
from users.models import User

class Hospital(models.Model):
    name = models.CharField(max_length=100)
    hosp_lat = models.DecimalField(max_digits=9, decimal_places=6)
    hosp_long = models.DecimalField(max_digits=9, decimal_places=6)
    address = models.TextField()
    #staff = models.ManyToManyField(User, limit_choices_to={'role': 'hospital'}, blank=True) #allows to assign multiple staff members (users with role hospital) to a hospital

    def __str__(self):
        return self.name