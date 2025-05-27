import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

export default function HomeScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  const ctrl = 'h'; // control variable ('amb' or 'h')

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

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
        <Text style={styles.title}>Emergency</Text>
      </View>

      {/* Main Buttons */}
      <View style={styles.buttonGrid}>
        {ctrl === 'amb' && (
          <>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/patient')}>
              <Text style={styles.buttonText}>Insert Patient</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/ambulanceInfo')}>
              <Text style={styles.buttonText}>Ambulance Info</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/vital_signs')}>
              <Text style={styles.buttonText}>Vital Signs</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/rescuedPatient')}>
              <Text style={styles.buttonText}>Rescued Patient Info</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/chat')}>
              <Text style={styles.buttonText}>Hospital Chat</Text>
            </TouchableOpacity>
          </>
        )}

        {ctrl === 'h' && (
          <>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/chat')}>
              <Text style={styles.buttonText}>Ambulance Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/patient_overview')}>
              <Text style={styles.buttonText}>Patient Overview</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Bottom Bar */}
      {ctrl === 'amb' && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logged user: John Doe (Ambulance)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      )}

      {ctrl === 'h' && (
              <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.logoutButton}>
                  <Text style={styles.logoutText}>Logged user: Jane Doe (Hospital)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton}>
                  <Text style={styles.logoutText}>LOGOUT</Text>
                </TouchableOpacity>
              </View>
            )}
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
    fontFamily: 'Roboto_700Bold',
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
  buttonText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: 'black',
  },
  logoutButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
  },
  logoutText: {
    fontFamily: 'Roboto_400Regular',
    fontWeight: 'bold',
  },
});
