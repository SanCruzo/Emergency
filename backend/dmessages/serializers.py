from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(read_only=True)
    encrypted_message = serializers.CharField(read_only=True)

    class Meta:
        model = Message
        fields = '__all__' 