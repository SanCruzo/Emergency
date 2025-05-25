from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Message
from .serializers import MessageSerializer
from .utils import encrypt_message, decrypt_message
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.decorators import action

User = get_user_model()

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        sender = self.request.user
        receiver_id = self.request.data['receiver']
        plain_text = self.request.data['plain_message']
        # Get the receiver as a User object
        receiver = User.objects.get(id=receiver_id)
        # Encrypt the message
        shared_secret = f"{min(str(sender.id), str(receiver_id))}:{max(str(sender.id), str(receiver_id))}"
        salt = b"static_salt_for_demo"  # For better security, use a user-based salt
        encrypted = encrypt_message(plain_text, shared_secret, salt)
        # Save the message with sender and receiver as User objects
        serializer.save(sender=sender, receiver=receiver, encrypted_message=encrypted)

    @action(detail=True, methods=['get'])
    def decrypt(self, request, pk=None):
        message = self.get_object()
        receiver_id = message.receiver.id
        sender_id = message.sender.id
        shared_secret = f"{min(str(sender_id), str(receiver_id))}:{max(str(sender_id), str(receiver_id))}"
        salt = b"static_salt_for_demo"
        decrypted = decrypt_message(message.encrypted_message, shared_secret, salt)
        return Response({'decrypted': decrypted})
