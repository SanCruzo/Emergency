import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function PatientScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient</Text>
      <View style={styles.buttonContainer}>
        {/* Button for patient with ID */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/patientAfterRegister?hasID=true')}
        >
          <Text style={styles.buttonText}>
            Registration patient (via Tessera Sanitaria) or Carta d’identità (NFC?)
          </Text>
        </TouchableOpacity>

        {/* Button for patient without ID */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/patientAfterRegister?hasID=false')}
        >
          <Text style={styles.buttonText}>Registration patient (without any ID)</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>
        Before accessing the PSS (=summary health profile) without consent, the healthcare worker
        must complete an electronic self-certification attesting the need to consult the file for
        treatment purposes in an emergency situation.
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
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#90caf9',
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
});