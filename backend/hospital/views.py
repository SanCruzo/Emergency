from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Hospital
from .serializers import HospitalSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class HospitalViewSet(ModelViewSet):
    serializer_class = HospitalSerializer
    permission_classes = [IsAuthenticated]
#ensure only admins see all hospitals and hospital staff sees only their own 
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Hospital.objects.all()
        elif user.role == 'hospital':
            return Hospital.objects.filter(staff=user)
        return Hospital.objects.none()