import React, { useState, useRef } from "react";
import { Sidebar } from "../components/Sidebar";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { motion } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaPalette,
  FaSignOutAlt,
  FaCamera,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";

export const Settings: React.FC = () => {
  const { user, updateProfile, updatePassword, logout, isLoading } =
    useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const [name, setName] = useState(user?.name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    user?.profilePic || null
  );

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (fileInputRef.current?.files?.[0]) {
      formData.append("profilePic", fileInputRef.current.files[0]);
    }
    await updateProfile(formData);
  };

  const handleRemoveDP = async () => {
    const formData = new FormData();
    formData.append("removeDP", "true");
    await updateProfile(formData);
    setPreview(null);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    await updatePassword({ oldPassword, newPassword });
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-z-gray dark:bg-[#0a0a0a] text-z-text dark:text-neutral-100 transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 ml-16 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-8"
          >
            Settings
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Section */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-[#171717] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800"
            >
              <div className="flex items-center gap-2 mb-6 text-xl font-semibold">
                <FaUser className="text-z-blue" />
                <h2>Profile</h2>
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-z-blue bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-gray-400">
                        {user?.name[0]}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-z-blue text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaCamera size={14} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={onFileChange}
                    accept="image/*"
                  />
                </div>
                {preview && (
                  <button
                    onClick={handleRemoveDP}
                    className="mt-4 text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <FaTrash size={12} /> Remove Picture
                  </button>
                )}
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#262626] dark:text-white border border-gray-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-z-blue transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#262626] dark:text-white border border-gray-200 dark:border-neutral-700 opacity-60 cursor-not-allowed"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 bg-z-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Update Profile"}
                </button>
              </form>
            </motion.section>

            {/* Appearance Section */}
            <div className="space-y-8">
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-[#171717] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800"
              >
                <div className="flex items-center gap-2 mb-6 text-xl font-semibold">
                  <FaPalette className="text-z-blue" />
                  <h2>Appearance</h2>
                </div>

                <div className="flex items-center justify-between">
                  <span>Theme Mode</span>
                  <div
                    onClick={toggleTheme}
                    className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                      theme === "dark" ? "bg-z-blue" : "bg-gray-300"
                    }`}
                  >
                    <motion.div
                      layout
                      className="w-5 h-5 bg-white rounded-full shadow-md"
                      animate={{ x: theme === "dark" ? 28 : 0 }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Currently using {theme} mode
                </p>
              </motion.section>

              {/* Password Section */}
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-[#171717] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800"
              >
                <div className="flex items-center gap-2 mb-6 text-xl font-semibold">
                  <FaLock className="text-z-blue" />
                  <h2>Security</h2>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#262626] dark:text-white border border-gray-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-z-blue transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#262626] dark:text-white border border-gray-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-z-blue transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#262626] dark:text-white border border-gray-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-z-blue transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
                  >
                    Change Password
                  </button>
                </form>
              </motion.section>

              {/* Account Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-red-600 dark:text-red-400">
                      Logout Account
                    </h2>
                    <p className="text-sm text-red-500/80">
                      You will be logged out of your session
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/30"
                  >
                    <FaSignOutAlt size={20} />
                  </button>
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
