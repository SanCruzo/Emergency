import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function PatientScreen() {
  const router = useRouter();

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

            <Text style={styles.patient}>Insert Patient Info</Text>
      <View style={styles.buttonContainer}>
        {/* Button for patient with ID */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/InsertPatient')}
        >
          <Text style={styles.buttonText}>
            Registration patient (via Tessera Sanitaria)
          </Text>
        </TouchableOpacity>

        {/* Button for patient without ID */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/InsertPatientNO_ID')}
        >
          <Text style={styles.buttonText}>Registration patient (without any ID)</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>
        Before accessing the PSS (=summary health profile) without consent, the healthcare worker
        must complete an electronic self-certification attesting the need to consult the file for
        treatment purposes in an emergency situation.
      </Text>

      <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Logged user')}>
            <Text style={styles.logoutText}>Logged user: John Doe</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Logout button pressed')}>
            <Text style={styles.logoutTexùt}>LOGOUT</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  patient:{
      fontSize: 24,
      fontWeight: 'bold',
      alignItems: 'center',
      paddingVertical: 70,
      marginBottom: -25,
      justifyContent: 'center',
    },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00B7EB',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
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
