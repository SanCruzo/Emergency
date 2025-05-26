import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../config';
import { getUserId, getUsername, getRole } from '../utils/auth';

interface User {
  id: string;
  username: string;
  role: string;
}

export default function DirectMessageUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get current user info
    getUserId().then(setCurrentUserId);
    getUsername().then((val) => setUsername(val || ''));
    getRole().then((val) => setUserRole(val || ''));
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users/`);
        const data = await response.json();
        const filtered = currentUserId ? data.filter((u: User) => u.id !== currentUserId) : data;
        setUsers(filtered);
      } catch (e) {
        // Handle error
      }
      setLoading(false);
    };
    if (currentUserId !== null) {
      fetchUsers();
    }
  }, [currentUserId]);

  const renderItem = ({ item }: { item: User }) => {
    let displayRole = item.role;
    if (item.role === 'ambulance') displayRole = 'Ambulance Staff';
    else if (item.role === 'hospital') displayRole = 'Hospital Staff';
    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => router.push({ pathname: '/directMessageChat', params: { userId: item.id, username: item.username, role: displayRole } })}
      >
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.role}>{displayRole}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top bar with logo and header */}
        <View style={styles.topBar}>
          <View style={styles.logoPlaceholder}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.topBarTitle}>Direct Messages User List</Text>
        </View>

        {/* Main content */}
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#00B7EB" />
          ) : (
            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          )}
        </View>

        {/* Bottom bar with user info and logout button */}
        <View style={styles.bottomBarRow}>
          <View style={styles.userInfoBox}>
            <Text style={styles.userInfoText}>
              {username && userRole
                ? `Logged in: ${username} (${userRole === 'ambulance' ? 'Ambulance Staff' : userRole === 'hospital' ? 'Hospital Staff' : userRole})`
                : 'Not logged in'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  topBar: {
    flexDirection: 'row',
    backgroundColor: '#00FFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    width: '100%',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 30,
  },
  logoPlaceholder: {
    width: 70,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 25,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 10,
  },
  content: {
    flex: 1,
    width: '100%',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#00B7EB',
    borderRadius: 10,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
  role: {
    fontSize: 16,
    color: '#000',
  },
  bottomBarRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  userInfoBox: {
    backgroundColor: '#eee',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
}); 