from rest_framework.viewsets import ModelViewSet
from .models import User
from .serializers import UserSerializer, RegisterSerializer
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return active users with ambulance role
        return User.objects.filter(is_active=True, role='ambulance')

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Generate and send verification code
    user.generate_email_verification_code()
    
    return Response({
        'message': 'Verification code sent to your email',
        'requires_verification': True
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_login(request):
    username = request.data.get('username')
    code = request.data.get('verification_code')
    
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if not user.verify_email_code(code):
        return Response({'error': 'Invalid or expired verification code'}, 
                       status=status.HTTP_401_UNAUTHORIZED)
    
    # Clear the verification code
    user.email_verification_code = None
    user.email_verification_code_created_at = None
    user.save()
    
    refresh = RefreshToken.for_user(user)
    #frontend has access to role immediatly after login
    return Response({
        'message': 'Login successful',
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user_id': str(user.id),
        'username': user.username,
        'role': user.role,
    })

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)