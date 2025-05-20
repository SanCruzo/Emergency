from django.db import models
import uuid
from users.models import User
from emergencies.models import Patient

class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    emergency = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True, blank=True)
    encrypted_message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)