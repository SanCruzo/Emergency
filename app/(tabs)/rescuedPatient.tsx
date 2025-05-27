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
  approximate_age?: string | null;
  patient_id: string;
  hasID: boolean;
  blood_pressure?: string;
  heart_rate?: number;
  oxygen_saturation?: number;
  electromyography?: string;
  height?: string;
  weight?: string;
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

  const renderPatient = ({ item }: { item: Patient }) => {
    const formatAge = (age: string | null | undefined) => {
      if (!age) return '-';
      return age.charAt(0).toUpperCase() + age.slice(1);
    };

    return (
    <TouchableOpacity
      style={styles.infoTable}
      onPress={() => {
        if (role === 'hospital') {
          Alert.alert('Access Denied', 'Hospital staff cannot edit patients.');
          return;
        }
        router.push({
          pathname: '/editPatientScreen',
          params: { patient: JSON.stringify(item) },
        });
      }}
    >
      <View style={styles.patientHeader}>
        <Text style={styles.patientIdText}>
          {item.hasID
            ? `Patient ID: ${item.patient_id}`
            : `NO ID - Gender: ${item.gender ? item.gender.charAt(0).toUpperCase() + item.gender.slice(1) : '-'}, Age: ${formatAge(item.approximate_age)}`}
        </Text>
      </View>

      {!item.hasID && (item.height || item.weight) && (
        <View style={styles.physicalInfoContainer}>
          <Text style={styles.physicalInfoText}>
            {item.height && `Height: ${item.height}`}
            {item.height && item.weight && ', '}
            {item.weight && `Weight: ${item.weight}`}
          </Text>
        </View>
      )}

      {item.symptoms && item.symptoms.length > 0 && (
        <View style={styles.symptomsContainer}>
          <Text style={styles.symptomsLabel}>Symptoms:</Text>
          <Text style={styles.symptomsText}>{item.symptoms.join(', ')}</Text>
        </View>
      )}

      {item.triage_code && (
        <View style={styles.triageContainer}>
          <Text style={[styles.triageText, { color: getTriageTextColor(item.triage_code) }]}>
            Triage: {getTriageLabel(item.triage_code)}
          </Text>
          <Text style={styles.dateText}>
            Added: {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )};

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
  patientHeader: {
    marginBottom: 10,
  },
  patientIdText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  detailsGrid: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    flex: 2,
  },
  symptomsContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
  },
  symptomsLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 4,
  },
  symptomsText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  triageContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  triageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  physicalInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  physicalInfoText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});