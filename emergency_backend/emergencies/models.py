from django.db import models
import uuid
from users.models import User

class Emergency(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status = models.CharField(max_length=20, choices=[
        ('full', 'Full'),
        ('available', 'Available')
    ])
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    location_lat = models.DecimalField(max_digits=9, decimal_places=6)
    location_long = models.DecimalField(max_digits=9, decimal_places=6)
    created_at = models.DateTimeField(auto_now_add=True)