import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function RescuedPatientScreen() {
  return (
    <View style={styles.container}>
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

      <Text style={styles.rescued}>Rescued Patient Info</Text>

      <View style={styles.content}>
        <View style={styles.infoTable}>
          <Text style={styles.infoText}>Name: Sarah Johnson</Text>
          <Text style={styles.infoText}>ID: 123456789</Text>
          <Text style={styles.infoText}>Rescue Date: 2025-04-10</Text>
          <Text style={styles.infoText}>Condition: Stable</Text>
          <Text style={styles.infoText}>Treatment: Completed</Text>
        </View>

        <Text style={styles.footerText}>
          Table in which are described data about rescued patients, including their condition and treatment details.
        </Text>
      </View>

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
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  rescued:{
    fontSize: 24,
    fontWeight: 'bold',
    alignItems: 'center',
    paddingVertical: 70,
    marginBottom: -25,
    justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    justifyContent: 'center',
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
});