import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { API_URL } from '../config';

export default function InsertPatientNO_IDScreen() {
  const router = useRouter();
  const [gender, setGender] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [complexion, setComplexion] = useState('');
  const [hair, setHair] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!gender || !ageGroup || !height || !weight || !complexion || !hair) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/patients/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: null,
          gender,
          age_group: ageGroup,
          height,
          weight,
          complexion,
          hair,
        }),
      });
      if (response.ok) {
        setGender('');
        setAgeGroup('');
        setHeight('');
        setWeight('');
        setComplexion('');
        setHair('');
        Alert.alert('Success', 'Patient added!');
        router.back();
      } else {
        const error = await response.text();
        Alert.alert('Error', 'Failed to add patient: ' + error);
      }
    } catch (e) {
      Alert.alert('Error', 'Network error.');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Patient (No ID)</Text>

      {/* Gender */}
      <Text style={styles.label}>Gender</Text>
      <Picker
        selectedValue={gender}
        onValueChange={setGender}
        style={styles.picker}
      >
        <Picker.Item label="Select gender..." value="" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Unknown" value="unknown" />
      </Picker>

      {/* Age Group */}
      <Text style={styles.label}>Approximate Age</Text>
      <Picker
        selectedValue={ageGroup}
        onValueChange={setAgeGroup}
        style={styles.picker}
      >
        <Picker.Item label="Select age group..." value="" />
        <Picker.Item label="Infant" value="infant" />
        <Picker.Item label="Child" value="child" />
        <Picker.Item label="Adult" value="adult" />
        <Picker.Item label="Elderly person" value="elderly" />
      </Picker>

      {/* Height */}
      <Text style={styles.label}>Height</Text>
      <Picker
        selectedValue={height}
        onValueChange={setHeight}
        style={styles.picker}
      >
        <Picker.Item label="Select height..." value="" />
        <Picker.Item label="<150 cm" value="<150" />
        <Picker.Item label="150-170 cm" value="150-170" />
        <Picker.Item label="170-190 cm" value="170-190" />
        <Picker.Item label=">190 cm" value=">190" />
      </Picker>

      {/* Weight */}
      <Text style={styles.label}>Weight</Text>
      <Picker
        selectedValue={weight}
        onValueChange={setWeight}
        style={styles.picker}
      >
        <Picker.Item label="Select weight..." value="" />
        <Picker.Item label="<50 kg" value="<50" />
        <Picker.Item label="50-70 kg" value="50-70" />
        <Picker.Item label="70-90 kg" value="70-90" />
        <Picker.Item label=">90 kg" value=">90" />
      </Picker>

      {/* Complexion */}
      <Text style={styles.label}>Complexion</Text>
      <Picker
        selectedValue={complexion}
        onValueChange={setComplexion}
        style={styles.picker}
      >
        <Picker.Item label="Select complexion..." value="" />
        <Picker.Item label="Light" value="light" />
        <Picker.Item label="Olive" value="olive" />
        <Picker.Item label="Dark" value="dark" />
        <Picker.Item label="Very dark" value="very-dark" />
      </Picker>

      {/* Hair */}
      <Text style={styles.label}>Hair</Text>
      <Picker
        selectedValue={hair}
        onValueChange={setHair}
        style={styles.picker}
      >
        <Picker.Item label="Select hair color..." value="" />
        <Picker.Item label="Blonde" value="blonde" />
        <Picker.Item label="Brown" value="brown" />
        <Picker.Item label="Red" value="red" />
        <Picker.Item label="Grey" value="grey" />
        <Picker.Item label="Bald" value="bald" />
      </Picker>

      <TouchableOpacity
        style={styles.button}
        onPress={handleAdd}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Adding...' : 'Insert Patient'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    fontWeight: 'bold',
    width: '100%',
  },
  picker: {
    backgroundColor: '#fff',
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  button: {
    backgroundColor: '#f9a825',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});