from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Hospital
from .serializers import HospitalSerializer

class HospitalViewSet(ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer
