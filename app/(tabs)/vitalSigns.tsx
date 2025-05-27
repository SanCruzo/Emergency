import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { getUsername, getRole, getAccessToken } from '../utils/auth';
import { useRouter, useFocusEffect } from 'expo-router';
import { API_URL } from '../config';

interface Patient {
  id: number;
  patient_id: string | null;
  hasID: boolean;
  blood_pressure: string;
  heart_rate: number;
  oxygen_saturation: number;
  electromyography: string;
  is_active: boolean;
  triage_code: string;
  created_at: string;
}

export default function VitalSignsScreen() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Get user information from local storage
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

      const response = await fetch(`${API_URL}/patients/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter only active patients
        setPatients(data.filter((p: Patient) => p.is_active));
      } else {
        console.error('Failed to fetch patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchPatients();
    }, [])
  );

  const handlePatientPress = async (patient: Patient) => {
    if (role === 'hospital') {
      Alert.alert('Access Denied', 'Hospital staff cannot edit patients.');
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      Alert.alert('Error', 'You are not logged in');
      router.push('/');
      return;
    }
    
    router.push({
      pathname: '/editPatientScreen',
      params: { patient: JSON.stringify(patient) }
    });
  };

  const handleVitalSignsEdit = async (patient: Patient) => {
    if (role === 'hospital') {
      Alert.alert('Access Denied', 'Hospital staff cannot edit patients.');
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      Alert.alert('Error', 'You are not logged in');
      router.push('/');
      return;
    }

    router.push({
      pathname: '/editVitalSigns',
      params: { patient: JSON.stringify(patient) }
    });
  };

  const getTriageLabel = (code: string) => {
    switch (code) {
      case 'white':
        return 'Not Urgent';
      case 'green':
        return 'Minor Urgent';
      case 'deepskyblue':
        return 'Deferrable';
      case 'orange':
        return 'Urgent';
      case 'red':
        return 'Major Urgent';
      default:
        return 'Not Set';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
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
        <Text style={styles.title}>Vital Signs</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00B7EB" style={styles.loader} />
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {patients.map((patient) => (
            <TouchableOpacity
              key={patient.id}
              style={styles.patientCard}
              onPress={() => handleVitalSignsEdit(patient)}
            >
              <View style={styles.patientHeader}>
                <Text style={styles.patientId}>
                  ID: {patient.hasID ? patient.patient_id : `${patient.id} (NO ID)`}
                </Text>
              </View>
              
              <View style={styles.vitalsGrid}>
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalLabel}>Blood Pressure</Text>
                  <Text style={styles.vitalValue}>{patient.blood_pressure || 'N/A'}</Text>
                </View>
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalLabel}>O₂ Saturation</Text>
                  <Text style={styles.vitalValue}>{patient.oxygen_saturation ? `${patient.oxygen_saturation}%` : 'N/A'}</Text>
                </View>
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalLabel}>Heart Rate</Text>
                  <Text style={styles.vitalValue}>{patient.heart_rate ? `${patient.heart_rate} bpm` : 'N/A'}</Text>
                </View>
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalLabel}>EMG</Text>
                  <Text style={styles.vitalValue}>{patient.electromyography || 'N/A'}</Text>
                </View>
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalLabel}>Triage Code</Text>
                  <Text style={[styles.vitalValue, { color: patient.triage_code || '#666' }]}>
                    {getTriageLabel(patient.triage_code)}
                  </Text>
                </View>
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalLabel}>Added Date</Text>
                  <Text style={styles.vitalValue}>{formatDate(patient.created_at)}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handlePatientPress(patient)}
              >
                <Text style={styles.editButtonText}>Edit Patient Info</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Footer line */}
      <View style={styles.footerLine} />

      {/* Bottom bar with user info and logout button */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    paddingBottom: 120, // Increased padding to prevent overlap with footer
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
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
    marginBottom: 20,
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
  patientCard: {
    backgroundColor: '#00B7EB',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  patientHeader: {
    flexDirection: 'column',
    gap: 5,
    marginBottom: 10,
  },
  patientId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  vitalItem: {
    width: '48%',
    marginBottom: 10,
  },
  vitalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  footerLine: {
    position: 'absolute',
    bottom: 80, // Moved up the footer line
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
    paddingTop: 15, // Added top padding
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
  editButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#00B7EB',
    fontSize: 16,
    fontWeight: 'bold',
  },
});