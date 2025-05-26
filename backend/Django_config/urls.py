from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('ambulance.urls')),
    path('api/', include('patients.urls')),
    path('api/', include('users.urls')),
    path('api/', include('dmessages.urls')),
    path('api/hospital/', include('hospital.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]