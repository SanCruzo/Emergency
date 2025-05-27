from rest_framework.viewsets import ModelViewSet
from .models import Patient
from .serializers import PatientSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class PatientViewSet(ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]
    #Allow ambulance staff to create and edit, while hospital staff can only read
    def get_queryset(self):
        user = self.request.user
        if user.role == 'ambulance':
            return Patient.objects.filter(created_by=user)
        elif user.role == 'hospital':
            return Patient.objects.filter(hospital__staff=user)  # or by hospital FK
        return Patient.objects.none()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def update(self, request, *args, **kwargs):
        if request.user.role != 'ambulance':
            return Response({'detail': 'Permission denied.'}, status=403)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if request.user.role != 'ambulance':
            return Response({'detail': 'Permission denied.'}, status=403)
        return super().partial_update(request, *args, **kwargs)
    #always returns erro, no one can delete
    def destroy(self, request, *args, **kwargs):
        return Response({'detail': 'Deletion not allowed.'}, status=403)