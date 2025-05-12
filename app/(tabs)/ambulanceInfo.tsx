import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Button, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../config';

type Ambulance = {
  id: number;
  plate_number: string;
  staff: string;
  location_lat: number;
  location_long: number;
  created_at: string;
};

export default function AmbulanceInfoScreen() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAmbulances = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ambulances/`);
      const data = await res.json();
      setAmbulances(data);
    } catch (e) {
      console.error('Error fetching ambulances:', e);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAmbulances();
    }, [])
  );

  const handleGoToAddAmbulance = () => {
    router.push('/addAmbulance');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!ambulances.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ambulance Info</Text>
        <Button title="Add Ambulance" onPress={handleGoToAddAmbulance} />
        <Text style={styles.infoText}>No ambulance data found.</Text>
      </View>
    );
  }

  const renderAmbulance = ({ item }: { item: Ambulance }) => (
    <TouchableOpacity
      style={styles.infoTable}
      onPress={() => router.push({ pathname: '/editAmbulanceScreen', params: { ambulance: JSON.stringify(item) } })}
    >
      <Text style={styles.infoText}>Ambulance Plate: {item.plate_number}</Text>
      <Text style={styles.infoText}>Staff: {item.staff}</Text>
      <Text style={styles.infoText}>
        Location: {item.location_lat}, {item.location_long}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ambulance Info</Text>
      <Button title="Add Ambulance" onPress={handleGoToAddAmbulance} />
      <FlatList
        data={ambulances}
        renderItem={renderAmbulance}
        keyExtractor={(item) => item.id.toString()}
        style={{ width: '100%' }}
        contentContainerStyle={{ alignItems: 'center' }}
      />
      <Text style={styles.footerText}>
        It can include the on-board instrumentation, ambulance staff, and other details.
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
    backgroundColor: '#90caf9',
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