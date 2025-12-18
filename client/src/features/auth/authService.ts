import axios from "axios";
const API_URL = "/api/users/";

const register = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(API_URL + "register", userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData: { email: string; password: string }) => {
  const response = await axios.post(API_URL + "login", userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const updateProfile = async (formData: FormData, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await axios.put(API_URL + "profile", formData, config);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const updatePassword = async (passwordData: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + "password", passwordData, config);
  return response.data;
};

const updateTheme = async (theme: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + "theme", { theme }, config);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  updateProfile,
  updatePassword,
  updateTheme,
};

export default authService;
