import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image} from 'react-native';
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
      {/* Logo and Header */}
      <View style={styles.topBar}>
        <View style={styles.logoPlaceholder}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Emergency Response</Text>
      </View>

      <Text style={styles.multimedia}>Multimedia</Text>
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
      <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Logged user')}>
            <Text style={styles.logoutText}>Logged user: John Doe</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Logout button pressed')}>
            <Text style={styles.logoutText}>LOGOUT</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 40,
        paddingVertical: 30,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        alignItems: 'center',
  },
  topBar: {
        flexDirection: 'row',
        backgroundColor: '#00FFFF',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 100,
        width: '100%',
        borderRadius: 15,
        paddingHorizontal: 10,
      },
    logoPlaceholder: {
      width: 100,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00B7EB',
    borderRadius: 10,
    padding: 20,
    width: '30%',
    alignItems: 'center',
  },
  multimedia: {
    fontSize: 24,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },

  footerText: {
      fontSize: 14,
      textAlign: 'center',
      color: '#555',
      marginTop: 20,
      marginBottom: 20,
    },
    bottomBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 60,
      width: '100%',
      backgroundColor: '000FFFF',
      borderRadius: 10,
      paddingHorizontal: 20,
      marginTop: 10,
    },
    logoutButton: {
      backgroundColor: '#eee',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    logoutText: {
      fontWeight: 'bold',
    },
});
