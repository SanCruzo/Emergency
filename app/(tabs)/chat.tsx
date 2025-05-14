import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Image } from 'react';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = { id: Date.now().toString(), text: message, sender: 'You' };
      setChatHistory([...chatHistory, newMessage]);
      setMessage('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.messageBubble}>
      <Text style={styles.sender}>{item.sender}:</Text>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  chatContainer: { padding: 20 },
  messageBubble: {
    backgroundColor: '#c2edff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    backgroundColor: '#c2edff',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#00B7EB',
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
});
