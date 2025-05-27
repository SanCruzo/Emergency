import React from 'react';
import { View, Text, StyleSheet,Image, TouchableOpacity } from 'react-native';

export default function ActivePatientScreen() {
  return (
    <View style={styles.container}>
      {/* Page Title */}
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

      <Text style={styles.vp}>Vital Signs</Text>

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

      <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Logged user')}>
            <Text style={styles.logoutText}>Logged user: John Doe</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Logout button pressed')}>
            <Text style={styles.logoutText}>LOGOUT</Text>
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
      justifyContent: 'space-between',
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
    marginBottom: 20,
  },
  vp:{
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
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    marginTop: 20,
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
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
});
