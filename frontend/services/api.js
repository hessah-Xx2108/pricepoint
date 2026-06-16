// services/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ============================================
// CONFIGURATION - Choose your connection type
// ============================================

// Option 1: Physical Device (Phone) - Use your laptop's IP on same Wi-Fi
// Run 'ipconfig' in Command Prompt to find your IP
const LAPTOP_IP = '172.20.10.2';  // 👈 CHANGE THIS to your actual IP
const PHYSICAL_DEVICE_URL = `http://${LAPTOP_IP}:5050/api`;  // Port 5050

// Option 2: Android Emulator
const ANDROID_EMULATOR_URL = 'http://10.0.2.2:5050/api';

// Option 3: iOS Simulator
const IOS_SIMULATOR_URL = 'http://localhost:5050/api';

// ✅ Choose ONE option - uncomment the one you're using
const API_URL = PHYSICAL_DEVICE_URL;  // FOR PHYSICAL PHONE
// const API_URL = ANDROID_EMULATOR_URL;  // FOR ANDROID EMULATOR
// const API_URL = IOS_SIMULATOR_URL;  // FOR IOS SIMULATOR

// Debug: Print the API URL (check your console)
console.log('📍 API_URL is set to:', API_URL);

// ============================================
// HELPER: Get JWT Token from AsyncStorage
// ============================================
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('🔑 Token retrieved:', token ? 'Yes (length: ' + token.length + ')' : 'No');
    return token;
  } catch (error) {
    console.error('❌ Get token error:', error);
    return null;
  }
};

// ============================================
// API OBJECT - All your API calls
// ============================================
export const api = {
  // ==========================================
  // AUTHENTICATION ENDPOINTS
  // ==========================================

  // Register new user
  register: async (userData) => {
    console.log('📡 [register] Sending to:', `${API_URL}/auth/register`);
    console.log('📡 [register] Data:', userData);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('📥 [register] Response:', data);
      return data;
    } catch (error) {
      console.error('❌ [register] Error:', error);
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    console.log('📡 [login] Sending to:', `${API_URL}/auth/login`);
    console.log('📡 [login] Email:', email);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      const data = await response.json();
      console.log('📥 [login] Response:', data);
      return data;
    } catch (error) {
      console.error('❌ [login] Error:', error);
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.log('⚠️ [getProfile] No token found');
        throw new Error('No token found');
      }

      console.log('📡 [getProfile] Fetching profile');
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('📥 [getProfile] Response:', data);
      return data;
    } catch (error) {
      console.error('❌ [getProfile] Error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No token found');
      }

      console.log('📡 [updateProfile] Updating profile');
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('📥 [updateProfile] Response:', data);
      return data;
    } catch (error) {
      console.error('❌ [updateProfile] Error:', error);
      throw error;
    }
  },

  // ==========================================
  // PRICE SUBMISSION ENDPOINTS
  // ==========================================

  // Submit price with photos
  submitPrice: async (formData) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No token found');
      }

      console.log('📡 [submitPrice] Submitting form data');
      const response = await fetch(`${API_URL}/prices/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('📥 [submitPrice] Response:', data);
      return data;
    } catch (error) {
      console.error('❌ [submitPrice] Error:', error);
      throw error;
    }
  },

  // Get nearby prices by product ID
  getNearbyPrices: async (productId, latitude, longitude) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No token found');
      }

      console.log('📡 [getNearbyPrices] Fetching nearby prices');
      const response = await fetch(
        `${API_URL}/prices/nearby?productId=${productId}&latitude=${latitude}&longitude=${longitude}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log('📥 [getNearbyPrices] Response:', data);
      return data;
    } catch (error) {
      console.error('❌ [getNearbyPrices] Error:', error);
      throw error;
    }
  },

  // Get nearby prices by product name
  getNearbyPricesByName: async (productName) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No token found');
      }

      console.log('📡 [getNearbyPricesByName] Fetching prices for:', productName);
      const response = await fetch(
        `${API_URL}/prices/by-name?name=${encodeURIComponent(productName)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log('📥 [getNearbyPricesByName] Response:', data);
      return data;
    } catch (error) {
      console.error('❌ [getNearbyPricesByName] Error:', error);
      throw error;
    }
  },

  // Get user's own submissions
  getMySubmissions: async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No token found');
      }

      console.log('📡 [getMySubmissions] Fetching user submissions');
      const response = await fetch(`${API_URL}/prices/my-submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('📥 [getMySubmissions] Response:', data);
      return data;
    } catch (error) {
      console.error('❌ [getMySubmissions] Error:', error);
      throw error;
    }
  },

  // Get all submissions (admin only)
  getAllSubmissions: async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No token found');
      }

      console.log('📡 [getAllSubmissions] Fetching all submissions (admin)');
      const response = await fetch(`${API_URL}/prices/all-submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('📥 [getAllSubmissions] Response:', data);
      return data;
    } catch (error) {
      console.error('❌ [getAllSubmissions] Error:', error);
      throw error;
    }
  },

  // ==========================================
  // ADMIN ENDPOINTS
  // ==========================================

  // Approve a submission (admin only)
  approveSubmission: async (id) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No token found');
      }

      console.log('📡 [approveSubmission] Approving submission:', id);
      const response = await fetch(`${API_URL}/prices/approve/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('📥 [approveSubmission] Response:', data);
      return data;
    } catch (error) {
      console.error('❌ [approveSubmission] Error:', error);
      throw error;
    }
  },

  // Reject a submission (admin only)
  rejectSubmission: async (id) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No token found');
      }

      console.log('📡 [rejectSubmission] Rejecting submission:', id);
      const response = await fetch(`${API_URL}/prices/reject/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('📥 [rejectSubmission] Response:', data);
      return data;
    } catch (error) {
      console.error('❌ [rejectSubmission] Error:', error);
      throw error;
    }
  },

  // Update product name for a submission (admin only)
  updateProductName: async (submissionId, newName) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No token found');
      }

      console.log('📡 [updateProductName] Updating product name for submission:', submissionId);
      const response = await fetch(`${API_URL}/prices/update-product-name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          submissionId,
          newName,
        }),
      });

      const data = await response.json();
      console.log('📥 [updateProductName] Response:', data);
      return data;
    } catch (error) {
      console.error('❌ [updateProductName] Error:', error);
      throw error;
    }
  },

  // ==========================================
  // VOUCHER ENDPOINTS
  // ==========================================

  // Get user's vouchers
  getMyVouchers: async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No token found');
      }

      console.log('📡 [getMyVouchers] Fetching user vouchers');
      const response = await fetch(`${API_URL}/prices/my-vouchers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('📥 [getMyVouchers] Response:', data);
      return data;
    } catch (error) {
      console.error('❌ [getMyVouchers] Error:', error);
      throw error;
    }
  },
};

// Debug: Log that API is ready
console.log('✅ API service initialized with base URL:', API_URL);