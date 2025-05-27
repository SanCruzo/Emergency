import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_URL } from '../config';
import { getAccessToken } from '../utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VitalSignsRegisterScreen() {
  const router = useRouter();
  const { patientId } = useLocalSearchParams();
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [oxygenSaturation, setOxygenSaturation] = useState('');
  const [electromyography, setElectromyography] = useState('');
  const [loading, setLoading] = useState(false);
  // Debug states
  const [userRole, setUserRole] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [responseInfo, setResponseInfo] = useState<string>('');

  // Load debug info when component mounts
  useEffect(() => {
    const loadDebugInfo = async () => {
      const token = await getAccessToken();
      const role = await AsyncStorage.getItem('role');
      setAccessToken(token);
      setUserRole(role);
    };
    loadDebugInfo();
  }, []);

  const handleSave = async () => {
    // Validate required fields
    if (!bloodPressure || !heartRate || !oxygenSaturation || !electromyography) {
      Alert.alert('Error', 'Please fill in all vital signs.');
      return;
    }

    setLoading(true);
    try {
      // Get authentication token
      const token = await getAccessToken();
      const role = await AsyncStorage.getItem('role');
      setAccessToken(token);
      setUserRole(role);

      if (!token) {
        Alert.alert('Error', 'You are not logged in');
        router.push('/');
        return;
      }

      const response = await fetch(`${API_URL}/patients/${patientId}/`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add authentication token
        },
        body: JSON.stringify({
          blood_pressure: bloodPressure,
          heart_rate: parseInt(heartRate),
          oxygen_saturation: parseInt(oxygenSaturation),
          electromyography: electromyography,
        }),
      });

      // Debug response information
      console.log('Debug - Response Status:', response.status);
      const responseText = await response.text();
      setResponseInfo(`Status: ${response.status}\nResponse: ${responseText}`);
      console.log('Debug - Response Text:', responseText);

      if (response.ok) {
        Alert.alert('Success', 'Patient added successfully!', [
          {
            text: 'OK',
            onPress: () => router.push('/vitalSigns')
          }
        ]);
      } else {
        Alert.alert('Error', `Failed to update vital signs: ${responseText}`);
      }
    } catch (error: unknown) {
      console.error('Debug - Error:', error);
      if (error instanceof Error) {
        setResponseInfo(`Error: ${error.message}`);
      } else {
        setResponseInfo('An unknown error occurred');
      }
      Alert.alert('Error', 'Network error.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Register Vital Signs</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.infoCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Blood Pressure (mmHg)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 120/80"
                value={bloodPressure}
                onChangeText={setBloodPressure}
                keyboardType="numbers-and-punctuation"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Heart Rate (bpm)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 72"
                value={heartRate}
                onChangeText={setHeartRate}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Oxygen Saturation (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 98"
                value={oxygenSaturation}
                onChangeText={setOxygenSaturation}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Electromyography</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Normal"
                value={electromyography}
                onChangeText={setElectromyography}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Adding...' : 'Add Patient'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  infoCard: {
    backgroundColor: '#00B7EB',
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
  },
  saveButton: {
    backgroundColor: '#00B7EB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
}); 