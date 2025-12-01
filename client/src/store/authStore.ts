import { create } from "zustand";
import authService from "../features/auth/authService";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  register: (userData: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (userData: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  reset: () => void;
}

// Get user from localStorage
const getUserFromStorage = (): User | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getUserFromStorage(),
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",

  register: async (userData) => {
    try {
      set({ isLoading: true });
      const user = await authService.register(userData);
      set({
        user,
        isLoading: false,
        isSuccess: true,
        isError: false,
        message: "",
      });
      toast.success("Account created successfully! Welcome to Zedit.");
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({
        isError: true,
        isLoading: false,
        isSuccess: false,
        message,
        user: null,
      });
      toast.error(message);
    }
  },

  login: async (userData) => {
    try {
      set({ isLoading: true });
      const user = await authService.login(userData);
      set({
        user,
        isLoading: false,
        isSuccess: true,
        isError: false,
        message: "",
      });
      toast.success(`Welcome back, ${user.name}!`);
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({
        isError: true,
        isLoading: false,
        isSuccess: false,
        message,
        user: null,
      });
      toast.error(message);
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null });
    toast.info("You have been logged out");
  },

  reset: () => {
    set({
      isError: false,
      isSuccess: false,
      isLoading: false,
      message: "",
    });
  },
}));
