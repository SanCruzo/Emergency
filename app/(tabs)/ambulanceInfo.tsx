import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AmbulanceInfoScreen() {
  return (
    <View style={styles.container}>
      {/* Page Title */}
      <Text style={styles.title}>Ambulance Info</Text>

      {/* Info Table */}
      <View style={styles.infoTable}>
        <Text style={styles.infoText}>Ambulance Plate: ABC-123</Text>
        <Text style={styles.infoText}>Staff: John Doe, Jane Smith</Text>
        <Text style={styles.infoText}>On-board Equipment: Oxygen Tank, Defibrillator</Text>
        <Text style={styles.infoText}>Location: Near City Center</Text>
      </View>

      {/* Footer Text */}
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