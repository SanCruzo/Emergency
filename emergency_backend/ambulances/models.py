from django.db import models
import uuid
from users.models import User

class Ambulance(models.Model):
    ambulance_id = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    lat = models.DecimalField(max_digits=9, decimal_places=6)
    long = models.DecimalField(max_digits=9, decimal_places=6)
    plate_number = models.CharField(max_length=20, unique=True)
    timestamp = models.DateTimeField(auto_now_add=True)