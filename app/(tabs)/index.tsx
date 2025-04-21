import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword, sendSignInLinkToEmail } from 'firebase/auth';
import app from '../scripts/firebaseConfig';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isMfaStep, setIsMfaStep] = useState(false);
  const [isMfaEnabled, setIsMfaEnabled] = useState(true); // State to toggle MFA on/off

  // Toggle MFA on or off
  const toggleMfa = () => {
    setIsMfaEnabled((prev) => !prev);
  };

  // Handle user login
  const handleLogin = async () => {
    const auth = getAuth(app);
    try {
      // User login with email and password
      await signInWithEmailAndPassword(auth, email, password);

      if (isMfaEnabled) {
        // If MFA is enabled, generate a verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
        setGeneratedCode(code);

        // Send the verification code via email
        await sendSignInLinkToEmail(auth, email, {
          url: 'https://emergency-8a562.firebaseapp.com', // Firebase URL
          handleCodeInApp: true,
        });

        Alert.alert('Verification Required', 'A verification code has been sent to your email.');
        setIsMfaStep(true); // Proceed to MFA step
      } else {
        // If MFA is disabled, log in directly
        Alert.alert('Success', 'You have successfully logged in.');
        router.push('/mainPage');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Login Failed', errorMessage);
    }
  };

  // Handle verification code submission
  const handleVerifyCode = () => {
    if (verificationCode === generatedCode) {
      router.push('/mainPage');
    } else {
      Alert.alert('Verification Failed', 'The verification code is incorrect.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* MFA Toggle */}
      <View style={styles.mfaToggle}>
        <Text style={styles.mfaToggleText}>Enable MFA</Text>
        <Switch value={isMfaEnabled} onValueChange={toggleMfa} />
      </View>

      {!isMfaStep ? (
        <>
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
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
            <Text style={styles.buttonText}>Verify Code</Text>
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