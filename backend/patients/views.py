from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Patient
from .serializers import PatientSerializer

class PatientViewSet(ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Both ambulance and hospital staff can view patients
        return Patient.objects.all()

    def perform_create(self, serializer):
        # Only ambulance staff can create patients
        if self.request.user.role != 'ambulance':
            return Response(
                {"detail": "Only ambulance staff can create patients."},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save(created_by=self.request.user)

    def update(self, request, *args, **kwargs):
        # Only ambulance staff can update patients
        if request.user.role != 'ambulance':
            return Response(
                {"detail": "Only ambulance staff can update patients."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        # Only ambulance staff can partially update patients
        if request.user.role != 'ambulance':
            return Response(
                {"detail": "Only ambulance staff can update patients."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Only ambulance staff can delete patients
        if request.user.role != 'ambulance':
            return Response(
                {"detail": "Only ambulance staff can delete patients."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)