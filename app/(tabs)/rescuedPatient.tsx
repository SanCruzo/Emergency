import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useFocusEffect, } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { API_URL } from '../config';
import { getUsername, getRole } from '../utils/auth';

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

export default function RescuedPatientScreen() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    getUsername().then((val) => setUsername(val || ''));
    getRole().then((val) => setRole(val || ''));
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/patients/`);
      const data = await res.json();
      setPatients(data.filter((p: Patient) => !p.is_active));
    } catch (e) {
      setPatients([]);
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.logoPlaceholder}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.topBarTitle}>Rescued Patient Info</Text>
        </View>

        <View style={{ flex: 1, width: '100%' }}>
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 30 }} />
          ) : patients.length > 0 ? (
            <FlatList
              data={patients}
              renderItem={renderPatient}
              keyExtractor={(item) => item.id.toString()}
              style={{ flex: 1 }}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 120 }}
            />
          ) : (
            <Text style={styles.infoText}>No rescued patient data found.</Text>
          )}

        </View>

        <View style={styles.bottomBarRow}>
          <View style={styles.userInfoBox}>
            <Text style={styles.userInfoText}>
              {username && role
                ? `Logged in: ${username} (${role === 'ambulance' ? 'Ambulance Staff' : role === 'hospital' ? 'Hospital Staff' : role})`
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
  infoTable: {
    width: '96%',
    padding: 24,
    backgroundColor: '#00B7EB',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 6,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
    marginBottom: 10,
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
    marginTop: 32,
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