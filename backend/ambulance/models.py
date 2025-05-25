from django.db import models

class Ambulance(models.Model):
    plate_number = models.CharField(max_length=20, unique=True)
    #staff = models.ManyToManyField(User, related_name='ambulances') # needs to be linked to user model 
    location_lat = models.DecimalField(max_digits=9, decimal_places=6) 
    location_long = models.DecimalField(max_digits=9, decimal_places=6) #change name for consistensy with db 
    status = models.CharField(
        max_length=20,
        choices=[
            ('available', 'Available'),
            ('dispatched', 'Dispatched'),
            ('offline', 'Offline'),
        ],
        default='available'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.plate_number