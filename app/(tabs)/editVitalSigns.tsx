import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_URL } from '../config';
import { getAccessToken } from '../utils/auth';

export default function EditVitalSignsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const patient = params.patient ? JSON.parse(params.patient as string) : {};
  const onUpdate = params.onUpdate ? JSON.parse(params.onUpdate as string) : null;

  const [bloodPressure, setBloodPressure] = useState(patient.blood_pressure || '');
  const [heartRate, setHeartRate] = useState(patient.heart_rate ? patient.heart_rate.toString() : '');
  const [oxygenSaturation, setOxygenSaturation] = useState(patient.oxygen_saturation ? patient.oxygen_saturation.toString() : '');
  const [electromyography, setElectromyography] = useState(patient.electromyography || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!bloodPressure || !heartRate || !oxygenSaturation || !electromyography) {
      Alert.alert('Error', 'Please fill in all vital signs.');
      return;
    }

    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        Alert.alert('Error', 'You are not logged in');
        router.push('/');
        return;
      }

      const response = await fetch(`${API_URL}/patients/${patient.id}/`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          blood_pressure: bloodPressure,
          heart_rate: parseInt(heartRate),
          oxygen_saturation: parseInt(oxygenSaturation),
          electromyography: electromyography,
        }),
      });

      if (response.ok) {
        const updatedPatient = await response.json();
        Alert.alert('Success', 'Vital signs updated successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back and trigger refresh
              router.back();
              if (onUpdate) {
                onUpdate(updatedPatient);
              }
            }
          }
        ]);
      } else {
        const error = await response.text();
        Alert.alert('Error', 'Failed to update vital signs: ' + error);
      }
    } catch (e) {
      Alert.alert('Error', 'Network error.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top bar with logo and header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Vital Signs</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.patientId}>
              Patient ID: {patient.patient_id || `${patient.id} (NO ID)`}
            </Text>

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
            style={styles.updateButton}
            onPress={handleUpdate}
            disabled={loading}
          >
            <Text style={styles.updateButtonText}>
              {loading ? 'Updating...' : 'Update Vital Signs'}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  patientId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
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
  updateButton: {
    backgroundColor: '#00B7EB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  updateButtonText: {
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