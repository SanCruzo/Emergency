import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

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

      {/* Main Buttons */}
      <View style={styles.buttonGrid}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/patient')}>
          <Text style={{ fontWeight: 'bold' }}>Insert Patient</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.button} onPress={() => router.push('/ambulanceInfo')}>
          <Text style={{ fontWeight: 'bold' }}>Ambulance Info</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/vitalSigns')}>
          <Text style={{ fontWeight: 'bold' }}>Vital Parameters</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/rescuedPatient')}>
          <Text style={{ fontWeight: 'bold' }}>Rescued Patient Info</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/directMessageUsers')}>
          <Text style={{ fontWeight: 'bold' }}>Direct Message</Text>
        </TouchableOpacity>
        

      </View>


      {/* Exit Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace('/')} // Navigate to Login page and clear history
      >
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
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
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: 10,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginTop: 40,
  },
  button: {
    backgroundColor: '#00B7EB',
    width: 320,
    height: 100,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    paddingHorizontal: 10,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#eee',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutText: {
    fontWeight: 'bold',
  },
});
