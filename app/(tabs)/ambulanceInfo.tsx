import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList, SafeAreaView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getUsername, getRole } from '../utils/auth';
import { API_URL } from '../config';

// Ambulance type definition
type Ambulance = {
  id: number;
  plate_number: string;
  staff: string;
  location_lat: number;
  location_long: number;
  created_at: string;
};

export default function AmbulanceInfoScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user info from local storage
  useEffect(() => {
    getUsername().then((val) => setUsername(val || ''));
    getRole().then((val) => setRole(val || ''));
  }, []);

  // Fetch ambulance data from backend
  const fetchAmbulances = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ambulances/`);
      const data = await res.json();
      setAmbulances(data);
    } catch (e) {
      setAmbulances([]);
    }
    setLoading(false);
  };

  // Refresh ambulance data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchAmbulances();
    }, [])
  );

  // Render a single ambulance item
  const renderAmbulance = ({ item }: { item: Ambulance }) => (
    <TouchableOpacity
      style={styles.infoTable}
      onPress={() => router.push({
        pathname: '/editAmbulanceScreen',
        params: { ambulance: JSON.stringify(item) }
      })}
    >
      <Text style={styles.infoText}>Ambulance Plate: {item.plate_number}</Text>
      <Text style={styles.infoText}>Staff: {item.staff}</Text>
      <Text style={styles.infoText}>Location: {item.location_lat}, {item.location_long}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
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
          <Text style={styles.title}>Ambulance Info</Text>
        </View>

        {/* Ambulance list or loading/empty message */}
        <View style={{ flex: 1, width: '100%' }}>
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 30 }} />
          ) : ambulances.length > 0 ? (
            <FlatList
              data={ambulances}
              renderItem={renderAmbulance}
              keyExtractor={(item) => item.id.toString()}
              style={{ flex: 1 }}
              contentContainerStyle={{ alignItems: 'center', paddingBottom: 120 }}
            />
          ) : (
            <Text style={styles.infoText}>No ambulance data found.</Text>
          )}
        </View>

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
            style={styles.addButton}
            onPress={() => router.push('/addAmbulance')}
          >
            <Text style={styles.addButtonText}>ADD AMBULANCE</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: 10,
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    gap: 10,
  },
  logoutButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
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
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
    marginLeft: 200,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});