import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import { router } from 'expo-router';

export class TokenManager {
  private static refreshPromise: Promise<string | null> | null = null;

  static async getAccessToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        // No token found, user needs to login
        await this.logout();
        return null;
      }

      // Check if token is expired
      const tokenData = this.parseJwt(token);
      if (tokenData.exp * 1000 < Date.now()) {
        // Token is expired, try to refresh
        return await this.refreshToken();
      }

      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      await this.logout();
      return null;
    }
  }

  static async refreshToken(): Promise<string | null> {
    // If there's already a refresh in progress, return that promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          await this.logout();
          return null;
        }

        const response = await fetch(`${API_URL}/token/refresh/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        });

        if (!response.ok) {
          await this.logout();
          return null;
        }

        const data = await response.json();
        await AsyncStorage.setItem('accessToken', data.access);
        return data.access;
      } catch (error) {
        console.error('Error refreshing token:', error);
        await this.logout();
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  static async logout() {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'username', 'role']);
      router.replace('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  private static parseJwt(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return { exp: 0 };
    }
  }
} 