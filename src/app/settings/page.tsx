"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser, FaBook, FaCogs, FaSearch, FaBars, FaTimes, FaSun, FaMoon, FaEnvelope, FaKey, FaTrash, FaSignOutAlt } from "react-icons/fa";
import { auth } from "../../lib/firebase"; // Import the auth object from your Firebase config
import { sendPasswordResetEmail, deleteUser, signOut } from "firebase/auth"; // Import Firebase auth methods

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null); // State to store the user's email
  const [darkMode, setDarkMode] = useState(false); // State to toggle dark/light mode
  const router = useRouter();

  // Fetch the authenticated user's email
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email); // Set the user's email
      } else {
        router.push("/login"); // Redirect to login if the user is not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [router]);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark/light mode to the body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault(); // Prevent the default Google search bar from opening
        setShowSearch(true);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Handle password reset
  const handlePasswordReset = () => {
    if (userEmail) {
      sendPasswordResetEmail(auth, userEmail)
        .then(() => {
          alert("Password reset email sent.");
        })
        .catch((error) => {
          alert("Error sending password reset email: " + error.message);
        });
    }
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    if (auth.currentUser) {
      const user = auth.currentUser;
      if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
        user.delete()
          .then(() => {
            alert("Account deleted successfully.");
            router.push("/login"); // Redirect to login page after deletion
          })
          .catch((error) => {
            alert("Error deleting account: " + error.message);
          });
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/login"); // Redirect to login page after logout
      })
      .catch((error) => {
        alert("Error logging out: " + error.message);
      });
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-black" : "bg-white"} text-white dark:text-gray-100`} tabIndex={0}>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transition-all duration-300 ease-in-out ${darkMode ? "bg-gray-800" : "bg-black"} text-white ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-between items-center">
            <button className="text-white text-2xl" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          <div className="flex flex-col space-y-6 p-4">
            <Link href="/dashboard" className="hover:bg-gray-800 p-2 rounded flex items-center">
              <FaUser className="mr-2" />
              {sidebarOpen && "Profile"}
            </Link>
            <Link href="/comics" className="hover:bg-gray-800 p-2 rounded flex items-center">
              <FaBook className="mr-2" />
              {sidebarOpen && "Comics"}
            </Link>
            <Link href="/settings" className="hover:bg-gray-800 p-2 rounded flex items-center">
              <FaCogs className="mr-2" />
              {sidebarOpen && "Settings"}
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Top Search Bar */}
          <div className={`p-4 flex justify-between items-center ${darkMode ? "bg-gray-800" : "bg-black"}`}>
            <div className="relative w-full max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                className={`w-full p-3 rounded-md ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"} focus:ring-2 focus:ring-blue-400`}
                placeholder="Ctrl + K"
                autoFocus={showSearch}
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {/* Dark/Light Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`ml-4 p-2 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
            </button>
          </div>

          {/* Dashboard Content */}
          <div className="p-4 h-[calc(100vh-8rem)] flex flex-col justify-between">
            <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 h-[80%]">

              {/* Settings Section */}
              <div className={`flex-1 p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
                <h3 className={`text-2xl font-semibold flex items-center ${darkMode ? "text-white" : "text-black"}`}>
                  <FaCogs className="mr-2" /> Settings
                </h3>
                <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Manage your account settings</p>

                {/* Settings Options */}
                <div className="mt-6 space-y-4">
                  {/* Email */}
                  <div className={`flex items-center p-4 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-100"}`}>
                    <FaEnvelope className={`mr-3 ${darkMode ? "text-white" : "text-black"}`} />
                    <span className={`${darkMode ? "text-white" : "text-black"}`}>Email: {userEmail}</span>
                  </div>

                  {/* Reset Password */}
                  <div
                    onClick={handlePasswordReset}
                    className={`flex items-center p-4 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-100"} hover:cursor-pointer`}
                  >
                    <FaKey className={`mr-3 ${darkMode ? "text-white" : "text-black"}`} />
                    <span className={`${darkMode ? "text-white" : "text-black"}`}>Reset Password</span>
                  </div>

                  {/* Delete Account */}
                  <div
                    onClick={handleDeleteAccount}
                    className={`flex items-center p-4 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-100"} hover:cursor-pointer`}
                  >
                    <FaTrash className={`mr-3 ${darkMode ? "text-white" : "text-black"}`} />
                    <span className={`${darkMode ? "text-white" : "text-black"}`}>Delete Account</span>
                  </div>

                  {/* Logout */}
                  <div
                    onClick={handleLogout}
                    className={`flex items-center p-4 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-100"} hover:cursor-pointer`}
                  >
                    <FaSignOutAlt className={`mr-3 ${darkMode ? "text-white" : "text-black"}`} />
                    <span className={`${darkMode ? "text-white" : "text-black"}`}>Logout</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Bottom Margin */}
            <div className="h-[5%]"></div> {/* This creates a 5% margin at the bottom */}
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`bg-white text-black w-full max-w-lg p-6 rounded-lg ${darkMode ? "dark:bg-gray-800 dark:text-gray-100" : ""}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Search</h3>
              <button onClick={() => setShowSearch(false)}>
                <FaTimes className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className={`w-full p-3 rounded-md ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"} focus:ring-2 focus:ring-blue-400`}
              placeholder="Search for comics..."
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}