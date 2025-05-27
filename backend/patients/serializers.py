from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'
        #read_only_fields = ['created_by', 'created_at']

    #make all fields read-only for hospital staff
    def get_fields(self):
        fields = super().get_fields()
        user = self.context['request'].user
        if user.role == 'hospital':
            for field in fields.values():
                field.read_only = True
        return fields