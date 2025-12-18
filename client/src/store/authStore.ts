import { create } from "zustand";
import authService from "../features/auth/authService";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
  theme?: string;
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
  updateProfile: (formData: FormData) => Promise<void>;
  updatePassword: (passwordData: any) => Promise<void>;
  updateTheme: (theme: string) => Promise<void>;
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
  updateProfile: async (formData) => {
    try {
      set({ isLoading: true });
      const user = await authService.updateProfile(
        formData,
        useAuthStore.getState().user?.token || ""
      );
      set({
        user,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });
      toast.success("Profile updated!");
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({ isError: true, isLoading: false, message });
      toast.error(message);
    }
  },
  updatePassword: async (passwordData) => {
    try {
      set({ isLoading: true });
      await authService.updatePassword(
        passwordData,
        useAuthStore.getState().user?.token || ""
      );
      set({ isLoading: false, isSuccess: true, isError: false });
      toast.success("Password updated!");
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      set({ isError: true, isLoading: false, message });
      toast.error(message);
    }
  },
  updateTheme: async (theme) => {
    try {
      await authService.updateTheme(
        theme,
        useAuthStore.getState().user?.token || ""
      );
      const user = useAuthStore.getState().user;
      if (user) {
        const updatedUser = { ...user, theme };
        set({ user: updatedUser });
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error: any) {
      console.error("Failed to update theme on server", error);
    }
  },
}));
