from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
import random
import string
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=[
        ('admin', 'Admin'),
        ('responder', 'Responder'),
        ('hospital', 'Hospital')
    ])
    mfa_secret = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    email_verification_code = models.CharField(max_length=6, null=True, blank=True)
    email_verification_code_created_at = models.DateTimeField(null=True, blank=True)

    def generate_email_verification_code(self):
        """Generate a 6-digit verification code and send it via email"""
        code = ''.join(random.choices(string.digits, k=6))
        self.email_verification_code = code
        self.email_verification_code_created_at = timezone.now()
        self.save()

        # Send email with verification code
        subject = 'Your Login Verification Code'
        message = f'Your verification code is: {code}\n\nThis code will expire in 10 minutes.'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [self.email]
        
        send_mail(subject, message, from_email, recipient_list)
        return code

    def verify_email_code(self, code):
        """Verify the email code and check if it's still valid"""
        if not self.email_verification_code or not self.email_verification_code_created_at:
            return False
            
        # Check if code is expired (10 minutes)
        if timezone.now() - self.email_verification_code_created_at > timezone.timedelta(minutes=10):
            return False
            
        return self.email_verification_code == code
