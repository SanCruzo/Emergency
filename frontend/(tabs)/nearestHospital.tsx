import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function NearestHospitalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearest Hospital</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 45.4064, // Example: Padova, Italy
          longitude: 11.8768,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Random Marker */}
        <Marker
          coordinate={{ latitude: 45.4064, longitude: 11.8778 }}
          title="Azienda Ospedale"
          description="Nearest hospital in your area"
        />
        <Marker
          coordinate={{ latitude: 45.4075, longitude: 11.8755 }}
          title="Monoblocco Ospedale"
          description="Another nearby hospital"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
});