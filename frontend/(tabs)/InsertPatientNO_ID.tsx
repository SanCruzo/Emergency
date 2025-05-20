import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

export default function PatientInfoForm() {
  const router = useRouter();
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [complexion, setComplexion] = useState('');
  const [hair, setHair] = useState('');

  return (
    <View style={styles.container}>
      {/* Gender */}
      <Text style={styles.label}>Gender</Text>
      <Picker
        selectedValue={gender}
        onValueChange={(itemValue) => setGender(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select gender..." value="" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Unknown" value="unknown" />
      </Picker>

      {/* Approximate Age */}
      <Text style={styles.label}>Approximate Age</Text>
      <Picker
        selectedValue={age}
        onValueChange={(itemValue) => setAge(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select age group..." value="" />
        <Picker.Item label="Infant" value="infant" />
        <Picker.Item label="Child" value="child" />
        <Picker.Item label="Adult" value="adult" />
        <Picker.Item label="Elderly person" value="elderly" />
      </Picker>

      {/* Approximate Height */}
      <Text style={styles.label}>Height</Text>
      <Picker
        selectedValue={height}
        onValueChange={(itemValue) => setHeight(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select height..." value="" />
        <Picker.Item label="<150 cm" value="<150" />
        <Picker.Item label="150-170 cm" value="150-170" />
        <Picker.Item label="170-190 cm" value="170-190" />
        <Picker.Item label=">190 cm" value=">190" />
      </Picker>

      {/* Approximate Weight */}
      <Text style={styles.label}>Weight</Text>
      <Picker
        selectedValue={weight}
        onValueChange={(itemValue) => setWeight(itemValue)}
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
        onValueChange={(itemValue) => setComplexion(itemValue)}
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
        onValueChange={(itemValue) => setHair(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select hair color..." value="" />
        <Picker.Item label="Blonde" value="blonde" />
        <Picker.Item label="Brown" value="brown" />
        <Picker.Item label="Red" value="red" />
        <Picker.Item label="Grey" value="grey" />
        <Picker.Item label="Bald" value="bald" />
      </Picker>

      {/* Button for patient without ID */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/InsertPatient')}
      >
        <Text style={styles.buttonText}>Insert Patient</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    fontWeight: 'bold',
  },
  picker: {
    backgroundColor: '#fff',
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#00FFFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
