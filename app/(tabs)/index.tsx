import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication'; // Import Local Authentication
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../scripts/firebaseConfig'; // Import the configured auth instance

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMfaEnabled, setIsMfaEnabled] = useState(true); // State to toggle MFA on/off

  // Toggle MFA on or off
  const toggleMfa = () => {
    setIsMfaEnabled((prev) => !prev);
  };

  // Handle biometric authentication
  const handleBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('Error', 'Your device does not support biometric authentication.');
        return false;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert('Error', 'No biometric authentication methods are enrolled.');
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Biometrics',
        fallbackLabel: 'Use Passcode',
      });

      return result.success;
    } catch (error) {
      console.error('Biometric Authentication Error:', error);
      Alert.alert('Error', 'An error occurred during biometric authentication.');
      return false;
    }
  };

  // Handle user login
  const handleLogin = async () => {
    try {
      // User login with email and password
      await signInWithEmailAndPassword(auth, email, password);

      if (isMfaEnabled) {
        // If MFA is enabled, proceed to biometric authentication
        const isBiometricAuthenticated = await handleBiometricAuth();
        if (isBiometricAuthenticated) {
          router.push('/mainPage');
        }
      } else {
        // If MFA is disabled, log in directly
        router.push('/mainPage');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Login Failed', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* MFA Toggle */}
      <View style={styles.mfaToggle}>
        <Text style={styles.mfaToggleText}>Enable Biometric MFA</Text>
        <Switch value={isMfaEnabled} onValueChange={toggleMfa} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
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
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#f9a825',
    width: '100%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  mfaToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  mfaToggleText: {
    fontSize: 16,
    marginRight: 10,
  },
});