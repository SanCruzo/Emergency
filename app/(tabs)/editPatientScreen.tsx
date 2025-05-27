import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from '../config';
import { getAccessToken, getRole } from '../utils/auth';

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

export default function EditPatientScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const patient = params.patient ? JSON.parse(params.patient as string) : {};
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Get user role when component mounts
    getRole().then((role) => setUserRole(role || ''));
  }, []);

  const isNoID = !patient.hasID;

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
  const [ageGroup, setAgeGroup] = useState(patient.approximate_age || '');
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
        gender,
        approximate_age: ageGroup,
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
        symptoms: selectedSymptoms,
        triage_code: triageCode,
      };
    }

    try {
      const token = await getAccessToken();
      if (!token) {
        Alert.alert('Error', 'You are not logged in');
        router.push('/');
        return;
      }

      const response = await fetch(
        `${API_URL}/patients/${patient.id}/`,
        {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
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

  const handleDelete = async () => {
    if (userRole !== 'admin') {
      Alert.alert('Access Denied', 'Only admins can delete patients.');
      return;
    }

    Alert.alert(
      'Delete Patient',
      'Are you sure you want to delete this patient? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const token = await getAccessToken();
              if (!token) {
                Alert.alert('Error', 'You are not logged in');
                router.push('/');
                return;
              }

              const response = await fetch(
                `${API_URL}/patients/${patient.id}/`,
                {
                  method: 'DELETE',
                  headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                }
              );
              if (response.ok) {
                Alert.alert('Success', 'Patient deleted successfully!');
                router.back();
              } else {
                const error = await response.text();
                Alert.alert('Error', 'Failed to delete patient: ' + error);
              }
            } catch (e) {
              Alert.alert('Error', 'Network error.');
            }
            setLoading(false);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top bar with logo and header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Patient</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.infoCard}>
            {isNoID ? (
              <>
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


              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Patient ID"
                  value={patient.patient_id || `${patient.id} (NO ID)`}
                  editable={false}
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
              <Text style={styles.label}>Patient Status:</Text>
              <TouchableOpacity
                style={[styles.activeButton, isActive && styles.activeSelected]}
                onPress={() => setIsActive(true)}
              >
                <Text style={[styles.activeText, isActive && styles.activeTextSelected]}>Active</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.activeButton, !isActive && styles.activeSelected]}
                onPress={() => setIsActive(false)}
              >
                <Text style={[styles.activeText, !isActive && styles.activeTextSelected]}>Passive</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdate}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Updating...' : 'Update Patient'}
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={loading}
          >
            <Text style={styles.deleteButtonText}>Delete Patient</Text>
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
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
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
  infoCard: {
    backgroundColor: '#00B7EB',
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
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
  groupContainer: {
    marginBottom: 30,
    width: '100%',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingLeft: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
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
    borderColor: '#fff',
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
    marginTop: 20,
    gap: 10,
  },
  activeButton: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    minWidth: 100,
    alignItems: 'center',
  },
  activeSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  activeText: {
    fontWeight: 'bold',
    color: '#333',
  },
  activeTextSelected: {
    color: '#fff',
  },
  updateButton: {
    backgroundColor: '#00B7EB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 40,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  vitalSignsButton: {
    backgroundColor: '#00B7EB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
});