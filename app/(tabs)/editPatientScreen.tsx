import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  { label: 'White - No triage', value: 'white' },
  { label: 'Green - Minor', value: 'green' },
  { label: 'Orange - Moderate', value: 'orange' },
  { label: 'Red - Major', value: 'red' },
];

export default function EditPatientScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const patient = params.patient ? JSON.parse(params.patient as string) : {};

  const isNoID = !patient.name;

  const [name, setName] = useState(patient.name || '');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (Array.isArray(patient.symptoms)) {
      Object.entries(symptomsList).forEach(([category, items]) => {
        items.forEach((symptom) => {
          const key = `${category}-${symptom}`;
          initial[key] = patient.symptoms.includes(symptom);
        });
      });
    }
    return initial;
  });
  const [triageCode, setTriageCode] = useState(patient.triage_code || '');
  const [isActive, setIsActive] = useState(patient.is_active ?? true);

  const [gender, setGender] = useState(patient.gender || '');
  const [ageGroup, setAgeGroup] = useState(patient.age_group || '');
  const [height, setHeight] = useState(patient.height || '');
  const [weight, setWeight] = useState(patient.weight || '');
  const [complexion, setComplexion] = useState(patient.complexion || '');
  const [hair, setHair] = useState(patient.hair || '');

  const [loading, setLoading] = useState(false);

  const toggleCheckbox = (category: string, symptom: string) => {
    const key = `${category}-${symptom}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);

    let body: any = { is_active: isActive };

    if (isNoID) {
      body = {
        ...body,
        name: null,
        gender,
        age_group: ageGroup,
        height,
        weight,
        complexion,
        hair,
      };
    } else {
      const selectedSymptoms: string[] = [];
      Object.entries(checkedItems).forEach(([key, value]) => {
        if (value) {
          const [, symptom] = key.split('-');
          selectedSymptoms.push(symptom);
        }
      });
      body = {
        ...body,
        name: name || null,
        symptoms: selectedSymptoms,
        triage_code: triageCode,
      };
    }

    try {
      const response = await fetch(
        `${API_URL}/patients/${patient.id}/`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      if (response.ok) {
        Alert.alert('Success', 'Patient updated!');
        router.back();
      } else {
        const error = await response.text();
        Alert.alert('Error', 'Failed to update patient: ' + error);
      }
    } catch (e) {
      Alert.alert('Error', 'Network error.');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Patient</Text>
      {isNoID ? (
        <>
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
        </>
      ) : (
        <>
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
        </>
      )}

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

      <Button title={loading ? 'Updating...' : 'Update Patient'} onPress={handleUpdate} disabled={loading} />
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
    justifyContent: 'center',
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
  picker: {
    backgroundColor: '#fff',
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
});