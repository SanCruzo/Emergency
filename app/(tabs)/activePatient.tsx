import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ActivePatientScreen() {
  return (
    <View style={styles.container}>
      {/* Page Title */}
      <Text style={styles.title}>Vital Parameters</Text>

      {/* Info Table */}
      <View style={styles.infoTable}>
      <Text style={styles.infoText}>Name: Chris Anderson</Text>
      <Text style={styles.infoText}>ID: 22503152452</Text>
        <Text style={styles.infoText}>Blood Pressure: 120/80 mmHg</Text>
        <Text style={styles.infoText}>Heart Rate: 72 bpm</Text>
        <Text style={styles.infoText}>Electromyography: Normal</Text>
        <Text style={styles.infoText}>Oxygen Saturation: 98%</Text>
      </View>

      {/* Footer Text */}
      <Text style={styles.footerText}>
        Table in which are described blood pressure, heart rate, electromyography, etc.
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
    backgroundColor: '#f5f5f5',
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