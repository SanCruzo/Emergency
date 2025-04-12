import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

export default function MultimediaScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  // Function to handle photo capture
  const handlePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Photo URI:', result.assets[0].uri);
      Alert.alert('Photo Captured', `Photo saved at: ${result.assets[0].uri}`);
    }
  };

  // Function to handle video recording
  const handleVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required to record videos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Video URI:', result.assets[0].uri);
      Alert.alert('Video Recorded', `Video saved at: ${result.assets[0].uri}`);
    }
  };

  // Function to handle audio notes
  const handleAudio = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Microphone access is required to record audio.');
        return;
      }
  
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
  
      if (recording) {
        console.log('Stopping recording...');
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped, file saved at:', uri);
        Alert.alert('Audio Recorded', `Audio saved at: ${uri}`);
        setRecording(null);
      } else {
        console.log('Starting recording...');
        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await newRecording.startAsync();
        setRecording(newRecording);
        console.log('Recording started');
      }
    } catch (error) {
      console.error('Failed to record audio:', error);
      Alert.alert('Error', 'Failed to start/stop recording.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Page Title */}
      <Text style={styles.title}>Multimedia</Text>

      {/* Buttons for Multimedia Options */}
      <View style={styles.buttonGrid}>
        <TouchableOpacity style={styles.button} onPress={handlePhoto}>
          <Text style={styles.buttonText}>Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleVideo}>
          <Text style={styles.buttonText}>Video Recording</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAudio}>
          <Text style={styles.buttonText}>
            {recording ? 'Stop Recording' : 'Audio Notes'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer Text */}
      <Text style={styles.footerText}>
        They can share photos, videos, or audio to the hospital to improve the rescues.
      </Text>
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
  buttonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#90caf9',
    borderRadius: 10,
    padding: 20,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
});