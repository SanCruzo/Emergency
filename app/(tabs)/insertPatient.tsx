import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { API_URL } from '../config';

const symptomsList = {
  Respiratory: ['Dyspnea', 'Rales', 'Cough', 'Cyanosis', 'Tachypnea'],
  Cardiac: ['Chest pain', 'Palpitations', 'Hypotension', 'Tachycardia', 'Absent pulse'],
  Neurological: ['Confusion', 'Loss of consciousness', 'Convulsions', 'Paralysis'],
  Cutaneous: ['Pallor', 'Cold sweats', 'Petechiae', 'Jaundice'],
  Gastrointestinal: ['Abdominal pain', 'Vomiting', 'Diarrhea', 'Blood in stool'],
  Trauma: ['Wounds', 'Fractures', 'Bruises', 'Immobility', 'Hemorrhages']
};

const triageColors = [
  { label: 'White - Not Urgent', value: 'white' },
  { label: 'Green - Minor Urgent', value: 'green' },
  { label: 'Light Blue - Deferrable Urgency', value: 'deepskyblue' },
  { label: 'Orange - Urgent', value: 'orange' },
  { label: 'Red - Major Urgent', value: 'red' },
];

export default function AddPatientScreen() {
  const [patientId, setPatientId] = useState('');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [triageCode, setTriageCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleCheckbox = (category: string, symptom: string) => {
    const key = `${category}-${symptom}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAdd = async () => {
    if (!patientId) {
      Alert.alert('Error', 'Please enter patient ID.');
      return;
    }
    if (!triageCode) {
      Alert.alert('Error', 'Please select a triage code.');
      return;
    }
    setLoading(true);

    const selectedSymptoms: string[] = [];
    Object.entries(checkedItems).forEach(([key, value]) => {
      if (value) {
        const [, symptom] = key.split('-');
        selectedSymptoms.push(symptom);
      }
    });

    try {
      const response = await fetch(`${API_URL}/patients/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          hasID: true,
          symptoms: selectedSymptoms,
          triage_code: triageCode,
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
          <Text style={styles.title}>Add Patient with ID</Text>
        </View>

        <ScrollView style={styles.content}>
          <TextInput
            style={styles.input}
            placeholder="Patient ID (required)"
            value={patientId}
            onChangeText={setPatientId}
          />

          {/* Checkbox groups */}
          {Object.entries(symptomsList).map(([category, items]) => (
            <View key={category} style={styles.groupContainer}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {items.map((symptom) => {
                const key = `${category}-${symptom}`;
                return (
                  <View key={key} style={styles.checkboxContainer}>
                    <Checkbox
                      status={checkedItems[key] ? 'checked' : 'unchecked'}
                      onPress={() => toggleCheckbox(category, symptom)}
                    />
                    <Text style={styles.label}>{symptom}</Text>
                  </View>
                );
              })}
            </View>
          ))}

          {/* Select triage color */}
          <Text style={styles.categoryTitle}>Triage Code</Text>
          <View style={styles.triageOptionsContainer}>
            {triageColors.map((color) => (
              <TouchableOpacity
                key={color.value}
                style={[
                  styles.triageOption,
                  triageCode === color.value && styles.triageOptionSelected,
                ]}
                onPress={() => setTriageCode(color.value)}
              >
                <View
                  style={[
                    styles.triageColorBoxSmall,
                    { backgroundColor: color.value },
                  ]}
                />
                <Text style={styles.triageOptionLabel}>{color.label}</Text>
              </TouchableOpacity>
            ))}
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
  input: {
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#fff',
  },
  groupContainer: {
    marginBottom: 30,
    width: '100%',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingLeft: 20,
  },
  label: {
    fontSize: 16,
  },
  triageOptionsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  triageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  triageOptionSelected: {
    borderColor: '#007bff',
    backgroundColor: '#e6f0ff',
  },
  triageColorBoxSmall: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 15,
  },
  triageOptionLabel: {
    fontSize: 16,
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