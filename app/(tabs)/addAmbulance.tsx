import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from '../config';
import { getAccessToken } from '../utils/auth';

interface User {
  id: number;
  username: string;
  role: string;
}

export default function AddAmbulanceScreen() {
  const [plateNumber, setPlateNumber] = useState('');
  const [locationLat, setLocationLat] = useState('');
  const [locationLong, setLocationLong] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const navigation = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        Alert.alert('Error', 'You are not logged in');
        navigation.push('/');
        return;
      }

      const response = await fetch(`${API_URL}/users/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Filter only ambulance staff
        setUsers(data.filter((user: User) => user.role === 'ambulance'));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch staff list');
    }
  };

  const toggleStaffSelection = (userId: number) => {
    setSelectedStaff(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleAdd = async () => {
    if (!plateNumber || !locationLat || !locationLong) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    if (selectedStaff.length === 0) {
      Alert.alert('Error', 'Please select at least one staff member.');
      return;
    }

    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        Alert.alert('Error', 'You are not logged in');
        navigation.push('/');
        return;
      }

      const response = await fetch(`${API_URL}/ambulances/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plate_number: plateNumber,
          location_lat: parseFloat(locationLat),
          location_long: parseFloat(locationLong),
          staff: selectedStaff
        }),
      });

      if (response.ok) {
        setPlateNumber('');
        setLocationLat('');
        setLocationLong('');
        setSelectedStaff([]);
        Alert.alert('Success', 'Ambulance added!');
        navigation.back();
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.detail || 'Failed to add ambulance.');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error.');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Ambulance</Text>
      <TextInput
        style={styles.input}
        placeholder="Plate Number"
        value={plateNumber}
        onChangeText={setPlateNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={locationLat}
        onChangeText={setLocationLat}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={locationLong}
        onChangeText={setLocationLong}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Select Staff Members</Text>
      <View style={styles.staffList}>
        {users.map(user => (
          <TouchableOpacity
            key={user.id}
            style={[
              styles.staffItem,
              selectedStaff.includes(user.id) && styles.staffItemSelected
            ]}
            onPress={() => toggleStaffSelection(user.id)}
          >
            <Text style={[
              styles.staffText,
              selectedStaff.includes(user.id) && styles.staffTextSelected
            ]}>
              {user.username}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title={loading ? 'Adding...' : 'Add Ambulance'} 
          onPress={handleAdd} 
          disabled={loading} 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  staffList: {
    marginBottom: 20,
  },
  staffItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  staffItemSelected: {
    backgroundColor: '#90caf9',
    borderColor: '#90caf9',
  },
  staffText: {
    fontSize: 16,
    color: '#333',
  },
  staffTextSelected: {
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});