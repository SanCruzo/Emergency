import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function PatientAfterRegisterScreen() {
  const { hasID } = useLocalSearchParams(); // Get the hasID parameter from the route

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient {hasID === 'true' ? 'with ID' : 'without any ID'}</Text>

      {/* Form based on ID status */}
      {hasID === 'true' ? (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Form to describe symptoms of the patient</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter symptoms"
            multiline
          />
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Form to describe the patient</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter physical info, age, etc."
            multiline
          />
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
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
  formContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});