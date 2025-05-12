import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from '../config';

export default function EditAmbulanceScreen() {
  const params = useLocalSearchParams();
  const navigation = useRouter();


  const ambulance = params.ambulance ? JSON.parse(params.ambulance as string) : {};

  const [plateNumber, setPlateNumber] = useState(ambulance.plate_number || '');
  const [staff, setStaff] = useState(ambulance.staff || '');
  const [locationLat, setLocationLat] = useState(String(ambulance.location_lat || ''));
  const [locationLong, setLocationLong] = useState(String(ambulance.location_long || ''));
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/ambulances/${ambulance.id}/`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plate_number: plateNumber,
            staff,
            location_lat: parseFloat(locationLat),
            location_long: parseFloat(locationLong),
          }),
        }
      );
      if (response.ok) {
        Alert.alert('Success', 'Ambulance updated!');
        navigation.back();
      } else {
        const error = await response.text();
        Alert.alert('Error', 'Failed to update ambulance: ' + error);
      }
    } catch (e) {
      Alert.alert('Error', 'Network error.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Ambulance</Text>
      <TextInput
        style={styles.input}
        placeholder="Plate Number"
        value={plateNumber}
        onChangeText={setPlateNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Staff"
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
      <Button title={loading ? 'Updating...' : 'Update Ambulance'} onPress={handleUpdate} disabled={loading} />
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