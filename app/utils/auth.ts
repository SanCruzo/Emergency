import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenManager } from './tokenManager';

// Store JWT tokens and user info securely
export const storeAuth = async (access: string, refresh: string, user: { user_id: string, username: string, role: string }) => {
  await AsyncStorage.setItem('accessToken', access);
  await AsyncStorage.setItem('refreshToken', refresh);
  await AsyncStorage.setItem('userId', user.user_id);
  await AsyncStorage.setItem('username', user.username);
  await AsyncStorage.setItem('role', user.role);
};

// Retrieve access token
export const getAccessToken = async () => {
  return await TokenManager.getAccessToken();
};

// Retrieve user ID
export const getUserId = async () => AsyncStorage.getItem('userId');

// Retrieve username
export const getUsername = async () => {
  return await AsyncStorage.getItem('username');
};

// Retrieve user role
export const getRole = async () => {
  return await AsyncStorage.getItem('role');
};

// Clear all stored authentication info
export const clearAuth = async () => {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userId', 'username', 'role']);
};

export const refreshAccessToken = async () => {
  const refresh = await AsyncStorage.getItem('refreshToken');
  if (!refresh) return null;
  const response = await fetch(`${process.env.API_URL}/token/refresh/`, {
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

export const logout = async () => {
  return await TokenManager.logout();
};

export const setAuthData = async (accessToken: string, refreshToken: string, username: string, role: string) => {
  await AsyncStorage.multiSet([
    ['accessToken', accessToken],
    ['refreshToken', refreshToken],
    ['username', username],
    ['role', role],
  ]);
}; 