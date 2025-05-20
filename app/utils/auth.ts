import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

// Store JWT tokens and user info securely
export const storeAuth = async (access: string, refresh: string, user: { user_id: string, username: string, role: string }) => {
  await AsyncStorage.setItem('accessToken', access);
  await AsyncStorage.setItem('refreshToken', refresh);
  await AsyncStorage.setItem('userId', user.user_id);
  await AsyncStorage.setItem('username', user.username);
  await AsyncStorage.setItem('role', user.role);
};

// Retrieve access token
export const getAccessToken = async () => AsyncStorage.getItem('accessToken');
// Retrieve user ID
export const getUserId = async () => AsyncStorage.getItem('userId');
// Retrieve username
export const getUsername = async () => AsyncStorage.getItem('username');
// Retrieve user role
export const getRole = async () => AsyncStorage.getItem('role');
// Clear all stored authentication info
export const clearAuth = async () => {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userId', 'username', 'role']);
};

export const refreshAccessToken = async () => {
  const refresh = await AsyncStorage.getItem('refreshToken');
  if (!refresh) return null;
  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (response.ok) {
    const data = await response.json();
    await AsyncStorage.setItem('accessToken', data.access);
    return data.access;
  }
  return null;
}; 