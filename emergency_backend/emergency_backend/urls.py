from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('ambulances.urls')),
    path('api/', include('emergencies.urls')),
    path('api/', include('users.urls')),
    path('api/', include('dmessages.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]