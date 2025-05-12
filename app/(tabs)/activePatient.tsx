import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Button, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../config';

type Patient = {
  id: number;
  name: string | null;
  symptoms: string[];
  triage_code: string;
  is_active: boolean;
  created_at: string;
  gender?: string | null;
  age_group?: string | null;
  height?: string | null;
  weight?: string | null;
  complexion?: string | null;
  hair?: string | null;
};

export default function PatientInfoScreen() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/patients/`);
      const data = await res.json();
      setPatients(data.filter((p: Patient) => p.is_active));
    } catch (e) {
      console.error('Error fetching patients:', e);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchPatients();
    }, [])
  );

  const handleGoToAddPatient = () => {
    router.push('/insertPatient');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!patients.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Patient Info</Text>
        <Button title="Add Patient" onPress={handleGoToAddPatient} />
        <Text style={styles.infoText}>No patient data found.</Text>
      </View>
    );
  }

  const renderPatient = ({ item }: { item: Patient }) => (
    <TouchableOpacity
      style={styles.infoTable}
      onPress={() =>
        router.push({
          pathname: '/editPatientScreen',
          params: { patient: JSON.stringify(item) },
        })
      }
    >
      <Text style={styles.infoText}>
        {item.name
          ? `Name: ${item.name}`
          : `NO ID - Gender: ${item.gender || '-'}, Age: ${item.age_group || '-'}`}
      </Text>
      {item.triage_code && (
        <Text style={styles.infoText}>Triage: {item.triage_code}</Text>
      )}
      {item.symptoms && item.symptoms.length > 0 && (
        <Text style={styles.infoText}>Symptoms: {item.symptoms.join(', ')}</Text>
      )}
      {/* Kimliksiz hasta için ek alanlar */}
      {!item.name && (
        <>
          <Text style={styles.infoText}>Height: {item.height || '-'}</Text>
          <Text style={styles.infoText}>Weight: {item.weight || '-'}</Text>
          <Text style={styles.infoText}>Complexion: {item.complexion || '-'}</Text>
          <Text style={styles.infoText}>Hair: {item.hair || '-'}</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Info</Text>
      <Button title="Add Patient" onPress={handleGoToAddPatient} />
      <FlatList
        data={patients}
        renderItem={renderPatient}
        keyExtractor={(item) => item.id.toString()}
        style={{ width: '100%' }}
        contentContainerStyle={{ alignItems: 'center' }}
      />
      <Text style={styles.footerText}>
        List of all registered patients. Tap a card to edit details.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoTable: {
    width: '100%',
    padding: 20,
    backgroundColor: '#b3e5fc',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
});