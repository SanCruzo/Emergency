import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '../config';
import { getAccessToken, getUserId, getUsername, refreshAccessToken } from '../utils/auth';

interface Message {
  id: string;
  sender: string;
  receiver: string;
  encrypted_message: string;
  timestamp: string;
}

export default function DirectMessageChatScreen() {
  const params = useLocalSearchParams();
  const receiverId = params.userId as string;
  const receiverUsername = params.username as string;
  const receiverRole = params.role as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [decrypting, setDecrypting] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Fetch current user info on mount
  useEffect(() => {
    getUserId().then(setCurrentUserId);
    getUsername().then(setCurrentUsername);
  }, []);

  // Fetch messages between current user and receiver
  useEffect(() => {
    if (!currentUserId) return;
    const fetchMessages = async () => {
      setLoading(true);
      setDecrypting(true);
      const token = await getAccessToken();
      try {
        const res = await fetch(`${API_URL}/messages/?ordering=timestamp`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        // Filter messages between these two users
        const filtered = data.filter((msg: Message) =>
          (msg.sender === currentUserId && msg.receiver === receiverId) ||
          (msg.sender === receiverId && msg.receiver === currentUserId)
        );
        // Decrypt each message using the backend endpoint
        const decryptedMessages = await Promise.all(
          filtered.map(async (msg: Message) => {
            try {
              const decRes = await fetch(`${API_URL}/messages/${msg.id}/decrypt/`, {
                headers: { 'Authorization': `Bearer ${token}` },
              });
              if (decRes.ok) {
                const decData = await decRes.json();
                return { ...msg, decrypted_message: decData.decrypted };
              }
            } catch {}
            return { ...msg, decrypted_message: '[Decryption failed]' };
          })
        );
        setMessages(decryptedMessages);
      } catch (e) {
        // Handle error
      }
      setLoading(false);
      setDecrypting(false);
    };
    fetchMessages();
  }, [currentUserId, receiverId]);

  // Send a new message
  const handleSend = async () => {
    if (!input.trim() || !currentUserId) return;
    setSending(true);
    let token = await getAccessToken();
    let triedRefresh = false;
    const sendMessage = async (accessToken: string) => {
      try {
        const res = await fetch(`${API_URL}/messages/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            receiver: receiverId,
            plain_message: input.trim(),
          }),
        });
        if (res.ok) {
          setInput('');
          // Refresh messages after sending
          const data = await res.json();
          // Decrypt the new message immediately
          try {
            const decRes = await fetch(`${API_URL}/messages/${data.id}/decrypt/`, {
              headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            if (decRes.ok) {
              const decData = await decRes.json();
              setMessages((prev) => [
                ...prev,
                { ...data, decrypted_message: decData.decrypted },
              ]);
            } else {
              setMessages((prev) => [
                ...prev,
                { ...data, decrypted_message: '[Decryption failed]' },
              ]);
            }
          } catch {
            setMessages((prev) => [
              ...prev,
              { ...data, decrypted_message: '[Decryption failed]' },
            ]);
          }
          setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        } else {
          // If token is expired, try to refresh and retry once
          const errorData = await res.json();
          if (
            errorData.code === 'token_not_valid' &&
            errorData.messages &&
            errorData.messages.some((m: any) => m.message && m.message.includes('expired')) &&
            !triedRefresh
          ) {
            triedRefresh = true;
            const newToken = await refreshAccessToken();
            if (newToken) {
              await sendMessage(newToken);
              return;
            }
          }
          // Show error message from backend
          Alert.alert('Message Send Error', JSON.stringify(errorData));
        }
      } catch (e) {
        // Show generic error alert
        Alert.alert('Message Send Error', 'An unexpected error occurred.');
      }
      setSending(false);
    };
    await sendMessage(token!);
  };

  // Render each message
  const renderItem = ({ item }: { item: Message & { decrypted_message?: string } }) => {
    const isMine = item.sender === currentUserId;
    return (
      <View style={[styles.messageBubble, isMine ? styles.myMessage : styles.theirMessage]}>
        <Text style={[styles.messageText, isMine ? styles.myMessageText : styles.theirMessageText]}>
          {item.decrypted_message || '[Decrypting...]'}
        </Text>
        <Text style={[styles.timestamp, isMine ? styles.myTimestamp : styles.theirTimestamp]}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat with {receiverUsername} ({receiverRole})</Text>
      </View>
      {loading || decrypting ? (
        <ActivityIndicator size="large" color="#f9a825" style={{ flex: 1 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          editable={!sending}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={sending || !input.trim()}>
          <Text style={styles.sendButtonText}>{sending ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#00B7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  messagesContainer: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    maxWidth: '80%',
    elevation: 2,
  },
  myMessage: {
    backgroundColor: '#00B7EB',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#E8E8E8',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
    opacity: 0.8,
  },
  myTimestamp: {
    color: '#fff',
  },
  theirTimestamp: {
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: '#00B7EB',
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#00B7EB',
    borderRadius: 22,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 