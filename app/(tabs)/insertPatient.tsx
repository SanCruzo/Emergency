import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useRouter } from 'expo-router';

const symptomsList = {
  Respiratory: ['Dyspnea', 'Rales', 'Cough', 'Cyanosis', 'Tachypnea'],
  Cardiac: ['Chest pain', 'Palpitations', 'Hypotension', 'Tachycardia', 'Absent pulse'],
  Neurological: ['Confusion', 'Loss of consciousness', 'Convulsions', 'Paralysis'],
  Cutaneous: ['Pallor', 'Cold sweats', 'Petechiae', 'Jaundice'],
  Gastrointestinal: ['Abdominal pain', 'Vomiting', 'Diarrhea', 'Blood in stool'],
  Trauma: ['Wounds', 'Fractures', 'Bruises', 'Immobility', 'Hemorrhages']
};

const triageColors = [
  { label: 'White - No triage', value: 'white' },
  { label: 'Green - Minor', value: 'green' },
  { label: 'Orange - Moderate', value: 'orange' },
  { label: 'Red - Major', value: 'red' },
];

export default function AddPatientScreen() {
  const [name, setName] = useState('');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [triageCode, setTriageCode] = useState('');
  const [isActive, setIsActive] = useState(true);
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
    if (!triageCode) {
      Alert.alert('Error', 'Please select a triage code.');
      return;
    }
    setLoading(true);

    // Seçili semptomları dizi olarak topla
    const selectedSymptoms: string[] = [];
    Object.entries(checkedItems).forEach(([key, value]) => {
      if (value) {
        const [, symptom] = key.split('-');
        selectedSymptoms.push(symptom);
      }
    });

    try {
      const response = await fetch('http://192.168.1.104:8000/api/patients/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || null,
          symptoms: selectedSymptoms,
          triage_code: triageCode,
          is_active: isActive,
        }),
      });
      if (response.ok) {
        setName('');
        setCheckedItems({});
        setTriageCode('');
        setIsActive(true);
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
      <Text style={styles.title}>Add Patient</Text>
      <TextInput
        style={styles.input}
        placeholder="Name (optional)"
        value={name}
        onChangeText={setName}
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

      {/* Aktif/Pasif hasta seçimi */}
      <View style={styles.activeContainer}>
        <Text style={styles.label}>Is Active?</Text>
        <TouchableOpacity
          style={[styles.activeButton, isActive && styles.activeSelected]}
          onPress={() => setIsActive(true)}
        >
          <Text style={styles.activeText}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.activeButton, !isActive && styles.activeSelected]}
          onPress={() => setIsActive(false)}
        >
          <Text style={styles.activeText}>Passive</Text>
        </TouchableOpacity>
      </View>

      <Button title={loading ? 'Adding...' : 'Add Patient'} onPress={handleAdd} disabled={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    width: '100%',
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
  activeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 10,
  },
  activeButton: {
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  activeSelected: {
    backgroundColor: '#90caf9',
  },
  activeText: {
    fontWeight: 'bold',
    color: '#333',
  },
});