import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function AmbulanceInfoScreen() {
  return (
    <View style={styles.container}>
      {/* Logo and Header */}
        <View style={styles.topBar}>
          <View style={styles.logoPlaceholder}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Emergency Response</Text>
        </View>

    <Text style={styles.Info}>Ambulance Info</Text>
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

      {/* Bottom Bar */}
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
    topBar: {
      flexDirection: 'row',
      backgroundColor: '#00FFFF',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 100,
      width: '100%',
      borderRadius: 15,
      paddingHorizontal: 10,
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
  Info:{
    fontSize: 24,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  infoTable: {
    width: '100%',
    padding: 20,
    backgroundColor: '#00B7EB',
    borderRadius: 10,
    alignItems: 'center',
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
    marginBottom: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    width: '100%',
    backgroundColor: '000FFFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    marginTop: 10,
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
