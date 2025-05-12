from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, login, verify_login, RegisterView

router = DefaultRouter()
router.register(r'', UserViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login, name='login'),
    path('verify-login/', verify_login, name='verify_login'),
    path('', include(router.urls)),
]