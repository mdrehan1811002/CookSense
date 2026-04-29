import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS, check } from 'react-native-permissions';
import axios from 'axios';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyCtM1jo8qzhEn2XZ8SVCoboULcondCjZio';

/**
 * LocationService - Robust location handling with retry logic and permission checks.
 */
export const LocationService = {
  /**
   * Check if permission is already granted or request it
   */
  requestPermission: async () => {
    const permission = Platform.OS === 'ios' 
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    // First check current status
    const status = await check(permission);
    if (status === RESULTS.GRANTED) return true;

    // If not granted, request it
    const result = await request(permission);
    return result === RESULTS.GRANTED;
  },

  /**
   * Get current coordinates with fallback to low accuracy if high accuracy fails
   */
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords);
        },
        (error) => {
          // If high accuracy fails (often happens when GPS is just turned on), try low accuracy
          if (error.code === 3 || error.code === 2) { // Timeout or Unavailable
            Geolocation.getCurrentPosition(
              (pos) => resolve(pos.coords),
              (err) => reject(err),
              { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
            );
          } else {
            reject(error);
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
      );
    });
  },

  /**
   * Reverse Geocoding using Google Maps API
   */
  getLocationName: async (latitude, longitude) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await axios.get(url);
      
      if (response.data.results && response.data.results.length > 0) {
        const addressComponents = response.data.results[0].address_components;
        const city = addressComponents.find(c => c.types.includes('locality'))?.long_name;
        const state = addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.long_name;
        const country = addressComponents.find(c => c.types.includes('country'))?.long_name;
        
        if (city && country) {
          return state ? `${city}, ${state}, ${country}` : `${city}, ${country}`;
        }
        return response.data.results[0].formatted_address;
      }
      return 'Unknown Location';
    } catch (error) {
      console.error('Geocoding Error:', error);
      return 'Location Error';
    }
  }
};
