import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getUsername, getRole } from '../utils/auth';
import { useRouter } from 'expo-router';

export default function ActivePatientScreen() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  // Get user information from local storage
  useEffect(() => {
    getUsername().then((val) => setUsername(val || ''));
    getRole().then((val) => setRole(val || ''));
  }, []);

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

      {/* Info Table */}
      <View style={styles.infoTable}>
        <Text style={styles.infoText}>Name: Chris Anderson</Text>
        <Text style={styles.infoText}>ID: 22503152452</Text>
        <Text style={styles.infoText}>Blood Pressure: 120/80 mmHg</Text>
        <Text style={styles.infoText}>Heart Rate: 72 bpm</Text>
        <Text style={styles.infoText}>Electromyography: Normal</Text>
        <Text style={styles.infoText}>Oxygen Saturation: 98%</Text>
      </View>



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
    paddingHorizontal: 40,
    paddingVertical: 30,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoTable: {
    width: '100%',
    padding: 20,
    backgroundColor: '#00B7EB',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  vp: {
    fontSize: 24,
    fontWeight: 'bold',
    alignItems: 'center',
    paddingVertical: 50,
    marginBottom: 5,
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  topBar: {
    flexDirection: 'row',
    backgroundColor: '#00FFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
    width: '100%',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 32,
  },
  logoPlaceholder: {
    width: 100,
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
  // Bottom bar styles matching other screens
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
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
});