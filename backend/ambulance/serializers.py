# Converts ambulance model to/from JSON for REST API
from rest_framework import serializers
from .models import Ambulance

class AmbulanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambulance
        fields = '__all__'
        
    def validate(self, data):
        if 'plate_number' not in data:
            raise serializers.ValidationError({"plate_number": "Plate number is required"})
        if 'location_lat' not in data:
            raise serializers.ValidationError({"location_lat": "Latitude is required"})
        if 'location_long' not in data:
            raise serializers.ValidationError({"location_long": "Longitude is required"})
        return data