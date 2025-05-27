import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

export default function ActivePatientScreen() {
  return (
    <View style={styles.container}>
      {/* Contenuto principale scrollabile */}
      <ScrollView contentContainerStyle={styles.content}>

        {/* Page Header */}
        <View style={styles.topBar}>
          <View style={styles.logoPlaceholder}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Emergency</Text>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Patient Information</Text>

        {/* Patient Info */}
        <View style={styles.infoTable}>
          <Text style={styles.infoText}>Name: Chris Anderson</Text>
          <Text style={styles.infoText}>ID: 22503152452</Text>
          <Text style={styles.infoText}>Symptoms: list of symptoms</Text>
          <Text style={styles.infoText}>Rescue Date: 2025-05-27</Text>
          <Text style={styles.infoText}>Triage Code: Red</Text>
          <Text style={styles.infoText}>Blood Pressure: 120/80 mmHg</Text>
          <Text style={styles.infoText}>Heart Rate: 72 bpm</Text>
          <Text style={styles.infoText}>Electromyography: Normal</Text>
          <Text style={styles.infoText}>Oxygen Saturation: 98%</Text>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Ambulance Information</Text>

        {/* Ambulance Info */}
        <View style={styles.infoTable}>
          <Text style={styles.infoText}>Ambulance Plate: AB123CD</Text>
          <Text style={styles.infoText}>Staff: Dr. Smith, Nurse Kelly</Text>
          <Text style={styles.infoText}>On-board Equipment: Defibrillator, ECG, Oxygen</Text>
          <Text style={styles.infoText}>Location: 41.9028° N, 12.4964° E</Text>
        </View>

        {/* Footer Note */}
        <Text style={styles.footerText}>
          Overview of current patient data and ambulance assignment.
        </Text>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Logged user')}>
          <Text style={styles.logoutText}>Logged user: John Doe</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Logout')}>
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 40,
    paddingVertical: 30,
    alignItems: 'center',
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
    marginBottom: 30,
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
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    textAlign: 'center',
  },
  infoTable: {
    width: '100%',
    padding: 20,
    backgroundColor: '#00B7EB',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
    marginBottom: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  logoutButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  logoutText: {
    fontWeight: 'bold',
  },
});
