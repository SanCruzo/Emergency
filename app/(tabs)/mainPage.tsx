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
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Emergency Response</Text>
      </View>

      {/* Main Buttons */}
      <View style={styles.buttonGrid}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/patient')}
        >
          <Text>Insert Patient</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/nearestHospital')} 
        >
          <Text>Nearest Hospital</Text>
        </TouchableOpacity>

<TouchableOpacity
  style={styles.button}
  onPress={() => router.push('/ambulanceInfo')} // Navigate to Ambulance Info page
>
  <Text>Ambulance Info</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.button}
  onPress={() => router.push('/activePatient')} // Navigate to Active Patient Info page
>
  <Text>Active Patient Info</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.button}
  onPress={() => router.push('/rescuedPatient')} // Navigate to Rescued Patient Info page
>
  <Text>Rescued Patient Info</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.button}
  onPress={() => router.push('/directMessageUsers')}
>
  <Text>Direct Message</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 100,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginTop: 40,
  },
  button: {
    backgroundColor: '#f9a825',
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
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoutText: {
    fontWeight: 'bold',
  },
});
