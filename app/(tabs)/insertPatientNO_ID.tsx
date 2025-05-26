import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, SafeAreaView } from 'react-native';
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
          hasID: false,
          gender,
          age_group: ageGroup,
          height,
          weight,
          complexion,
          hair,
          is_active: true,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        router.push({
          pathname: '/vitalSignsRegister',
          params: { patientId: data.id }
        });
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top bar with logo and header */}
        <View style={styles.topBar}>
          <View style={styles.logoPlaceholder}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Add Patient (No ID)</Text>
        </View>

        <ScrollView style={styles.content}>
          {/* Gender */}
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
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
          </View>

          {/* Age Group */}
          <Text style={styles.label}>Approximate Age</Text>
          <View style={styles.pickerContainer}>
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
          </View>

          {/* Height */}
          <Text style={styles.label}>Height</Text>
          <View style={styles.pickerContainer}>
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
          </View>

          {/* Weight */}
          <Text style={styles.label}>Weight</Text>
          <View style={styles.pickerContainer}>
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
          </View>

          {/* Complexion */}
          <Text style={styles.label}>Complexion</Text>
          <View style={styles.pickerContainer}>
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
          </View>

          {/* Hair */}
          <Text style={styles.label}>Hair</Text>
          <View style={styles.pickerContainer}>
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
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleAdd}
            disabled={loading}
          >
            <Text style={styles.nextButtonText}>{loading ? 'Saving...' : 'Next'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    backgroundColor: '#00FFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    width: '100%',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 30,
  },
  logoPlaceholder: {
    width: 70,
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
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    fontWeight: '600',
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 15,
  },
  picker: {
    width: '100%',
  },
  nextButton: {
    backgroundColor: '#00B7EB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});