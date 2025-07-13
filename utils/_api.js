import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.237.35:5000/api';

// Helper to get token
const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('Authentication failed. Please sign in again.');
  return { Authorization: `Bearer ${token}` };
};

// ✅ Sign Up
export const signUp = async (formData) => {
  try {
    console.log(`📤 Sending Sign-up request to: ${API_BASE_URL}/auth/signup`);

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Sign-up failed.');

    if (data.token && data.vendorId) {
      await AsyncStorage.multiSet([
        ['token', data.token],
        ['vendorId', data.vendorId.toString()],
      ]);
    }

    return data;
  } catch (error) {
    console.error('❌ Sign-up Error:', error.message);
    throw error;
  }
};

// ✅ Sign In
export const signIn = async (formData) => {
  try {
    console.log('📤 Sending Sign-in request to:', `${API_BASE_URL}/auth/signin`);

    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Sign-in failed.');

    if (data.token && data.vendorId) {
      await AsyncStorage.multiSet([
        ['token', data.token],
        ['vendorId', data.vendorId],
      ]);
    }

    return data;
  } catch (error) {
    console.error('❌ Sign-in Error:', error.message);
    throw error;
  }
};

// ✅ Add Item
export const addItem = async (itemData) => {
  try {
    const vendorId = await AsyncStorage.getItem("vendorId");
    if (!vendorId) throw new Error("Vendor ID is missing. Please sign in again.");

    const formattedItem = {
      name: itemData.name,
      description: itemData.description,
      prices: [{ city: itemData.city, price: parseFloat(itemData.price) }],
      category: itemData.category,
      image: itemData.imageUrl,
      vendor: vendorId,
    };

    const response = await fetch(`${API_BASE_URL}/items/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedItem),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to add item.");
    }

    return response.json();
  } catch (error) {
    console.error("❌ Add Item Error:", error.message);
    throw error;
  }
};

// ✅ Update Profile
export const updateProfile = async (profileData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const vendorId = await AsyncStorage.getItem('vendorId');
    if (!token || !vendorId) throw new Error('Authentication failed. Please sign in again.');

    const response = await fetch(`${API_BASE_URL}/auth/profile/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...profileData, vendorId }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Profile update failed.');

    return data;
  } catch (error) {
    console.error('❌ Profile Update Error:', error.message);
    throw error;
  }
};

// ✅ Get Profile with token refresh
export const getProfile = async () => {
  try {
    let token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('No token found.');

    let response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('Refresh token missing.');

      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) throw new Error('Token refresh failed.');

      const { accessToken } = await refreshResponse.json();
      await AsyncStorage.setItem('token', accessToken);

      response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    if (!response.ok) throw new Error('Failed to fetch profile.');

    return await response.json();
  } catch (error) {
    console.error('❌ Get Profile Error:', error.message);
    return null;
  }
};

// ✅ Upload Image to Cloudinary
export const uploadToCloudinary = async (imageUri) => {
  const mimeType = imageUri.endsWith('.png') ? 'image/png' : 'image/jpeg';

  const data = new FormData();
  data.append("file", {
    uri: imageUri,
    type: mimeType,
    name: `upload.${mimeType.split("/")[1]}`,
  });
  data.append("upload_preset", "utsavia");
  data.append("folder", "your_folder_name");

  try {
    console.log("📤 Uploading to Cloudinary:", imageUri);

    const response = await fetch("https://api.cloudinary.com/v1_1/dfzxcrlry/image/upload", {
      method: "POST",
      body: data,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result?.error?.message || "Upload failed.");

    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error.message);
    throw error;
  }
};

// ✅ Fetch Bookings
export const fetchBookings = async () => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(await getAuthHeader()),
    };

    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch bookings.");

    return data;
  } catch (error) {
    console.error("❌ Fetch Bookings Error:", error.message);
    throw error;
  }
};

// ✅ Fetch Items
export const fetchItems = async () => {
  try {
    const vendorId = await AsyncStorage.getItem("vendorId");
    if (!vendorId) throw new Error("Vendor ID is missing.");

    const response = await fetch(`${API_BASE_URL}/items/fetch`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "vendorid": vendorId,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch items.");

    return data;
  } catch (error) {
    console.error("❌ Fetch Items Error:", error.message);
    throw error;
  }
};

// ✅ Confirm Booking
export const confirmBooking = async (bookingId) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(await getAuthHeader()),
    };

    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/confirm`, {
      method: "PUT",
      headers,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to confirm booking");

    return result;
  } catch (error) {
    console.error("❌ Confirm Booking Error:", error.message);
    throw error;
  }
};

// ✅ Fetch Confirmed Bookings
export const fetchConfirmedBookings = async () => {
  try {
    const headers = await getAuthHeader();

    const response = await fetch(`${API_BASE_URL}/bookings/confirmed`, {
      method: 'GET',
      headers,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to fetch confirmed bookings.");

    return result;
  } catch (error) {
    console.error("❌ Confirmed Bookings Error:", error.message);
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error('Failed to cancel booking');
    }
    return await response.json();
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

