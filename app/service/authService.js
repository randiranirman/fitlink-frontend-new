import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://192.168.8.108:8080/api/auth";

// Helper to decode token claims
export const jwtDecodeClaims = (token) => {
  try {
    if (!token) return null;
    const decoded = jwtDecode(token);
    return {
      id: decoded.id || null,
      role: decoded.role || null,
      name: decoded.name || null,  // only works if you add "name" claim in backend
      email: decoded.sub || null,  // "sub" holds username/email
    };
  } catch (error) {
    console.log("Failed to decode token:", error);
    return null;
  }
};

// 🔹 Login
export const loginUser = async (requestBody) => {
  try {
    const response = await axios.post(`${API_URL}/login`, requestBody);

    if (response.status === 200 && response.data?.accessToken) {
      const token = response.data.accessToken;
      await AsyncStorage.setItem("accessToken", token);

      const claims = jwtDecodeClaims(token);

      if (claims?.role === "CLIENT") {
        router.push("../roles/Client/clientScreens/clientDashboard");
      } else if (claims?.role === "TRAINER") {
        router.push("../roles/Trainer/trainerScreens/trainerDashboard");
      } 
    }

    return response.data;
  } catch (error) {
    console.log("Login failed:", error);
    throw error;
  }
};

//  Register
export const registerUser = async (requestBody) => {
  try {
    const response = await axios.post(`${API_URL}/register`, requestBody);

    if (response.status === 200 && response.data?.accessToken) {
      const token = response.data.accessToken;
      await AsyncStorage.setItem("accessToken", token);

      const claims = jwtDecodeClaims(token);

      if (claims?.role === "CLIENT") {
        router.push("../roles/Client/clientScreens/clientDashboard");
      } else if (claims?.role === "TRAINER") {
        router.push("../roles/Trainer/trainerScreens/trainerDashboard");
      } else if (claims?.role === "ADMIN") {
        router.push("../roles/Admin/adminScreens/adminDashboard");
      }
    }
    console.log(requestBody

    )

    return response.data;
  } catch (error) {
    console.log(requestBody)
    console.log("Error registering:", error);
    throw error;
  }
};
