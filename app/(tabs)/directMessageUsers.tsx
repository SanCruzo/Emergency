import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../config';

interface User {
  id: string;
  username: string;
  role: string;
}

export default function DirectMessageUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users/`);
        const data = await response.json();
        setUsers(data);
      } catch (e) {
        // Hata yönetimi
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => router.push({ pathname: '/directMessageChat', params: { userId: item.id, username: item.username, role: item.role } })}
    >
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.role}>{item.role}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#f9a825" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  username: {
    fontSize: 18,
    color: '#222',
  },
  role: {
    fontSize: 16,
    color: '#888',
  },
}); 