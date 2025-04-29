import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function PatientAfterRegisterScreen() {
  const { hasID } = useLocalSearchParams(); // Get the hasID parameter from the route

  return (
    <View style={styles.container}>
      {/* TopBar */}
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

      {/* Form container in the middle */}
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Login User</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            secureTextEntry
          />
          <TouchableOpacity style={styles.submitButton} onPress={() => console.log('Submitted')}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
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
    title: {
      fontSize: 24,
      fontWeight: '600',
      paddingVertical: 10,
    },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  formContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
