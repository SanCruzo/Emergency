import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '../config';
import { getAccessToken, getUserId, getUsername } from '../utils/auth';

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
        setMessages(filtered);
      } catch (e) {
        // Handle error
      }
      setLoading(false);
    };
    fetchMessages();
  }, [currentUserId, receiverId]);

  // Send a new message
  const handleSend = async () => {
    if (!input.trim() || !currentUserId) return;
    setSending(true);
    const token = await getAccessToken();
    try {
      const res = await fetch(`${API_URL}/messages/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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
        setMessages((prev) => [...prev, data]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }
    } catch (e) {
      // Handle error
    }
    setSending(false);
  };

  // Render each message
  const renderItem = ({ item }: { item: Message }) => {
    const isMine = item.sender === currentUserId;
    return (
      <View style={[styles.messageBubble, isMine ? styles.myMessage : styles.theirMessage]}>
        <Text style={styles.messageText}>{item.encrypted_message}</Text>
        <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat with {receiverUsername} ({receiverRole})</Text>
      </View>
      {loading ? (
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
    backgroundColor: '#f9a825',
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
  },
  myMessage: {
    backgroundColor: '#f9a825',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#222',
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#f9a825',
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 