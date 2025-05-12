import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from '../config';

export default function AddAmbulanceScreen() {
  const [plateNumber, setPlateNumber] = useState('');
  const [staff, setStaff] = useState('');
  const [locationLat, setLocationLat] = useState('');
  const [locationLong, setLocationLong] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useRouter();

  const handleAdd = async () => {
    if (!plateNumber || !staff || !locationLat || !locationLong) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/ambulances/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plate_number: plateNumber,
          staff,
          location_lat: parseFloat(locationLat),
          location_long: parseFloat(locationLong),
        }),
      });
      if (response.ok) {
        setPlateNumber('');
        setStaff('');
        setLocationLat('');
        setLocationLong('');
        Alert.alert('Success', 'Ambulance added!');
        navigation.back();
      } else {
        Alert.alert('Error', 'Failed to add ambulance.');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Ambulance</Text>
      <TextInput
        style={styles.input}
        placeholder="Plate Number"
        value={plateNumber}
        onChangeText={setPlateNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Staff (comma separated)"
        value={staff}
        onChangeText={setStaff}
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
      <Button title={loading ? 'Adding...' : 'Add Ambulance'} onPress={handleAdd} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
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
});