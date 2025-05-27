import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { useFocusEffect, } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { API_URL } from '../config';
import { getUsername, getRole, getAccessToken } from '../utils/auth';

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
  patient_id: string;
  hasID: boolean;
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
      const token = await getAccessToken();
      if (!token) {
        Alert.alert('Error', 'You are not logged in');
        router.push('/');
        return;
      }

      const res = await fetch(`${API_URL}/patients/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
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
        {item.hasID
          ? `Patient ID: ${item.patient_id}`
          : `NO ID - Gender: ${item.gender ? item.gender.charAt(0).toUpperCase() + item.gender.slice(1) : '-'}, Age: ${item.age_group || '-'}`}
      </Text>
      {item.triage_code && (
        <Text style={[styles.infoText, { color: getTriageTextColor(item.triage_code) }]}>
          Triage: {getTriageLabel(item.triage_code)}
        </Text>
      )}
      {item.symptoms && item.symptoms.length > 0 && (
        <Text style={styles.infoText}>Symptoms: {item.symptoms.join(', ')}</Text>
      )}
    </TouchableOpacity>
  );

  const getTriageLabel = (code: string) => {
    switch (code) {
      case 'white':
        return 'White - Not Urgent';
      case 'green':
        return 'Green - Minor Urgent';
      case 'deepskyblue':
        return 'Light Blue - Deferrable Urgency';
      case 'orange':
        return 'Orange - Urgent';
      case 'red':
        return 'Red - Major Urgent';
      default:
        return code;
    }
  };

  const getTriageTextColor = (code: string) => {
    switch (code) {
      case 'white':
        return '#000';
      case 'green':
        return '#006400';
      case 'deepskyblue':
        return '#00416A';
      case 'orange':
        return '#CC5500';
      case 'red':
        return '#8B0000';
      default:
        return '#000';
    }
  };

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

        <View style={styles.footerLine} />

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
    padding: 15,
    backgroundColor: '#00B7EB',
    borderRadius: 10,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    textAlign: 'left',
  },
  footerLine: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#ddd',
  },
  bottomBarRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
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