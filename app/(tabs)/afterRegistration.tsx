import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function AfterRegistration() {
  const router = useRouter();

  useEffect(() => {
    // 2 second timer
    const timer = setTimeout(() => {
      router.replace('/mainPage');
    }, 2000);

    // Clear timer
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Patient Successfully Registered</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50', // Yeşil renk başarı mesajı için
    textAlign: 'center',
  },
});