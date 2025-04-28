from django.db import models

class AmbulanceRequest(models.Model):
    patient_name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    emergency_level = models.IntegerField()
    requested_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.patient_name