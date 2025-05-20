from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('ambulances.urls')),
    path('api/', include('emergencies.urls')),
    path('api/', include('users.urls')),
    path('api/', include('dmessages.urls')),
]