from django.db import models

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
        ('white', 'White - No triage'),
        ('green', 'Green - Minor'),
        ('orange', 'Orange - Moderate'),
        ('red', 'Red - Major'),
    ]


    name = models.CharField(max_length=100, blank=True, null=True)
    symptoms = models.JSONField(default=list, blank=True, null=True)  
    triage_code = models.CharField(max_length=10, choices=TRIAGE_CHOICES, blank=True, null=True)
    is_active = models.BooleanField(default=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    # IDsiz hasta için ek alanlar:
    gender = models.CharField(max_length=10, blank=True, null=True)
    age_group = models.CharField(max_length=20, blank=True, null=True)
    height = models.CharField(max_length=20, blank=True, null=True)
    weight = models.CharField(max_length=20, blank=True, null=True)
    complexion = models.CharField(max_length=20, blank=True, null=True)
    hair = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.name or f"Patient {self.id}"