from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=[
        ('admin', 'Admin'),
        ('responder', 'Responder'),
        ('hospital', 'Hospital')
    ])
    mfa_secret = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
