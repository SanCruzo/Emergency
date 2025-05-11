import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const symptoms = {
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

export default function SymptomsCheckboxList() {
  const [checkedItems, setCheckedItems] = React.useState({});
  const [triageCode, setTriageCode] = React.useState('');

  const toggleCheckbox = (category, symptom) => {
    const key = `${category}-${symptom}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Checkbox groups */}
      {Object.entries(symptoms).map(([category, items]) => (
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

    <TouchableOpacity style={styles.sendButton} onPress={() => console.log('Send button pressed')}>
      <Text style={styles.sendButtonText}>SEND</Text>
    </TouchableOpacity>

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
  pickerWrapper: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    marginBottom: 30,
  },
  picker: {
    height: 50,
    width: '100%',
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
    borderColor: 'black',
    borderWidth: 1,
  },

  triageOptionLabel: {
    fontSize: 16,
  },

  sendButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
  },

  sendButtonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20
  },
});
