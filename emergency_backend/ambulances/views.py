#provides full CRUD REST API endpoints for ambulance (GET, POST, PUT, DELETE)
from rest_framework.viewsets import ModelViewSet
from .models import Ambulance
from .serializers import AmbulanceSerializer

class AmbulanceViewSet(ModelViewSet):
    queryset = Ambulance.objects.all()
    serializer_class = AmbulanceSerializer