import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RescuedPatientScreen() {
  return (
    <View style={styles.container}>
      {/* Page Title */}
      <Text style={styles.title}>Rescued Patient Data</Text>

      {/* Info Table */}
      <View style={styles.infoTable}>
        <Text style={styles.infoText}>Name: Sarah Johnson</Text>
        <Text style={styles.infoText}>ID: 123456789</Text>
        <Text style={styles.infoText}>Rescue Date: 2025-04-10</Text>
        <Text style={styles.infoText}>Condition: Stable</Text>
        <Text style={styles.infoText}>Treatment: Completed</Text>
      </View>

      {/* Footer Text */}
      <Text style={styles.footerText}>
        Table in which are described data about rescued patients, including their condition and treatment details.
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