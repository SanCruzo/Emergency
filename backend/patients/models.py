from django.db import models
import uuid
from users.models import User
from hospital.models import Hospital


class Patient(models.Model):
    SYMPTOM_CATEGORIES = [
        ('Respiratory', 'Respiratory'),
        ('Cardiac', 'Cardiac'),
        ('Neurological', 'Neurological'),
        ('Cutaneous', 'Cutaneous'),
        ('Gastrointestinal', 'Gastrointestinal'),
        ('Trauma', 'Trauma'),
    ]

    TRIAGE_CHOICES = [
        ('white', 'White - Not Urgent'),
        ('green', 'Green - Minor Urgent'),
        ('deepskyblue', 'Light Blue - Deferrable Urgency'),
        ('orange', 'Orange - Urgent'),
        ('red', 'Red - Major Urgent'),
    ]

    patient_id = models.CharField(max_length=100, blank=True, null=True)
    hasID = models.BooleanField(default=False)  # True if patient has ID, False if system generated
    name = models.CharField(max_length=100)
    symptoms = models.JSONField(default=list, blank=True, null=True)  
    triage_code = models.CharField(max_length=15, choices=TRIAGE_CHOICES, blank=True, null=True)
    is_active = models.BooleanField(default=True, blank=True, null=True) #whether this case is active
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_patients')
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, null=True, blank=True)
    #hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    # hospital = models.ForeignKey(Hospital, on_delete=models.SET_NULL, null=True, related_name='patients')
    # ambulance = models.ForeignKey(Ambulance, on_delete=models.SET_NULL, null=True, blank=True, related_name='patients')
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    
    #extra infos for patient without ID
    gender = models.CharField(max_length=10, blank=True, null=True)
    approximate_age = models.CharField(max_length=20, blank=True, null=True)
    height = models.CharField(max_length=20, blank=True, null=True)
    weight = models.CharField(max_length=20, blank=True, null=True)
    ethnicity = models.CharField(max_length=20, blank=True, null=True) 
    
    # Vital signs
    blood_pressure = models.CharField(max_length=20, blank=True, null=True)  # Format: "120/80"
    heart_rate = models.IntegerField(blank=True, null=True)  # bpm
    oxygen_saturation = models.IntegerField(blank=True, null=True)  # percentage
    electromyography = models.CharField(max_length=50, blank=True, null=True)  # Normal, Abnormal, etc.

    def save(self, *args, **kwargs):
        if not self.patient_id and not self.hasID:
            # Generate a random ID for patients without ID
            self.patient_id = f"NO_ID_{str(uuid.uuid4())[:8]}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.patient_id or f"Patient {self.id}"
