import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../config';
import { storeAuth } from '../utils/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle initial login
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      
      // First step: Send credentials to backend
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show verification code input
        setShowVerification(true);
        Alert.alert('Verification Code Sent', 'Please check your email for the verification code.');
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerification = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/verify-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          verification_code: verificationCode,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Store JWT tokens and user info securely
        await storeAuth(data.access, data.refresh, {
          user_id: data.user_id,
          username: data.username,
          role: data.role,
        });
        // Navigate to main page after successful login
        router.push('/mainPage');
      } else {
        Alert.alert('Verification Failed', data.error || 'Invalid verification code');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {!showVerification ? (
        // Initial login form
        <>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.registerLink} 
            onPress={() => router.push('/register')}
          >
            <Text style={styles.registerLinkText}>
              Don't have an account? Register
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        // Verification code form
        <>
          <Text style={styles.verificationText}>
            Please enter the verification code sent to your email
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            maxLength={6}
          />
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleVerification}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Verifying...' : 'Verify'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => setShowVerification(false)}
          >
            <Text style={styles.secondaryButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </>
      )}
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#00B7EB',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#00B7EB',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00B7EB',
    width: '100%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  verificationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  secondaryButton: {
    marginTop: 15,
    padding: 10,
  },
  secondaryButtonText: {
    color: '#00B7EB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 15,
    padding: 10,
  },
  registerLinkText: {
    color: '#00B7EB',
    fontSize: 16,
    fontWeight: 'bold',
  },
});