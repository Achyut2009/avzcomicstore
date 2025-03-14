"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaUser, FaBook, FaBars, FaTimes, FaSearch, FaSignOutAlt, FaTrash, FaEye, FaEnvelope, FaKey, FaSun, FaMoon } from "react-icons/fa";
import { auth } from "../../lib/firebase";
import { resetPassword } from "../../lib/firebase"; // Import the resetPassword function

// Define the Comic type
type Comic = {
  id: number;
  title: string;
  author: string;
  pages: number;
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"welcome" | "comics">("welcome");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [setResetEmailSent] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false); // New state to track page load
  const [modalOpen, setModalOpen] = useState(false); // State for search modal
  const [darkMode, setDarkMode] = useState(true); // State for dark/light mode
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }

    // Trigger page load animation on the first load or refresh
    setIsPageLoaded(true);

    const savedSection = localStorage.getItem("activeSection");
    if (savedSection) {
      setActiveSection(savedSection as "welcome" | "comics");
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    }
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        setModalOpen(true); // Open search modal on Ctrl+K
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  // Dummy comics data
  const comics: Comic[] = [
    { id: 1, title: "Highly Flammable Book-1 Chapter-1", author: "Viraj Pranshu", pages: 10 },
    { id: 2, title: "Highly Flammable Book-1 Chapter-2", author: "Viraj Pranshu", pages: 10 },
    { id: 3, title: "Highly Flammable Book-1 Chapter-3", author: "Viraj Pranshu", pages: 10 },
    { id: 4, title: "Highly Flammable Book-1 Chapter-4", author: "Viraj Pranshu", pages: 10 },
    { id: 5, title: "Highly Flammable Book-1 Chapter-5", author: "Viraj Pranshu", pages: 10 },
  ];

  const filteredComics = comics.filter((comic) =>
    comic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    document.title = "Redirecting...";
    setTimeout(() => {
      auth.signOut().then(() => {
        router.push("/login");
      });
    }, 2000); // 2 seconds delay
  };

  const handleResetPassword = async () => {
    if (userEmail) {
      document.title = "Redirecting...";
      setIsResettingPassword(true);
      try {
        await resetPassword(userEmail); // Use the resetPassword function from firebase.ts
        setResetEmailSent(true);
        setTimeout(() => {
          alert("Reset link was sent");
          document.title = "Dashboard"; // Reset the title after the alert
          setIsResettingPassword(false);
        }, 2000); // 2 seconds delay
      } catch (error) {
        console.error("Error sending password reset email:", error);
        setIsResettingPassword(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action is irreversible!");
    if (confirmDelete) {
      const user = auth.currentUser;
      if (user) {
        await user.delete();
        router.push("/signup");
      }
    }
  };

  return (
    <div className={`relative min-h-screen ${darkMode ? "bg-neutral-900 text-gray-100" : "bg-gray-200 text-neutral-900"}`}>
      {/* Dark overlay when sidebar is open */}
      {sidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-10"></div>}

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 ${darkMode ? "bg-neutral-800" : "bg-white"} z-30 `}>
        <div className="flex items-center">
          <button className={`text-2xl ${darkMode ? "text-white" : "text-neutral-800"}`} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? "bg-neutral-700" : "bg-gray-200"}`}
          >
            {darkMode ? <FaSun className="text-gray-200" /> : <FaMoon className="text-gray-700" />}
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <motion.div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 ${darkMode ? "bg-neutral-800 text-white" : "bg-white text-neutral-800"} z-20`}
        initial={{ width: "80px" }}
        animate={{ width: sidebarOpen ? "256px" : "80px" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-between items-center">
            <button className={`text-2xl ${darkMode ? "text-white" : "text-neutral-800"}`} onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          <div className="flex flex-col space-y-6 p-4">
            <button
              onClick={() => setActiveSection("welcome")}
              className={`${darkMode ? "hover:bg-neutral-600" : "hover:bg-gray-200"} p-2 rounded flex items-center transition-colors w-full`}
            >
              <FaUser className={`mr-2 ${darkMode ? "text-white" : "text-neutral-800"}`} />
              {sidebarOpen && <span className={darkMode ? "text-white" : "text-neutral-800"}>Profile</span>}
            </button>
            <button
              onClick={() => setActiveSection("comics")}
              className={`${darkMode ? "hover:bg-neutral-600" : "hover:bg-gray-200"} p-2 rounded flex items-center transition-colors w-full`}
            >
              <FaBook className={`mr-2 ${darkMode ? "text-white" : "text-neutral-800"}`} />
              {sidebarOpen && <span className={darkMode ? "text-white" : "text-neutral-800"}>Comics</span>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content with animation on first load */}
      <motion.div
        className="flex-1 ml-20 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: isPageLoaded ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {activeSection === "welcome" && (
          <div className={`w-full p-6 rounded-lg shadow-lg ${darkMode ? "bg-neutral-800" : "bg-white"} mt-24`}>
            {/* Welcome Section */}
            <h3 className={`text-2xl font-semibold flex items-center ${darkMode ? "text-white" : "text-neutral-700"}`}>
              Welcome back!
            </h3>
            <p className={`mt-2 ${darkMode ? "text-white" : "text-neutral-700"}`}>We're glad to have you here!</p>

            {/* Integrated Settings Options */}
            <div className="mt-6 space-y-4">
              {/* Email */}
              <div className={`flex items-center p-4 rounded-lg ${darkMode ? "bg-neutral-700" : "bg-gray-300"}`}>
                <FaEnvelope className="mr-3" />
                <span className={` truncate ${darkMode ? "text-white" : "text-neutral-700"}`}>Email: {userEmail}</span>
              </div>

              {/* Reset Password */}
              <div
                onClick={handleResetPassword}
                className={`flex items-center p-4 rounded-lg ${darkMode ? "bg-neutral-700" : "bg-gray-300"} ${darkMode ? "hover:bg-neutral-600" : "hover:bg-neutral-400"} hover:cursor-pointer`}
              >
                <FaKey className="mr-3" />
                <span className={'${darkMode ? "bg-neutral-700" : "bg-gray-300"}'}>
                  {isResettingPassword ? "Sending email..." : "Reset Password"}
                </span>
              </div>

              {/* Logout */}
              <div
                onClick={handleLogout}
                className={`flex items-center p-4 rounded-lg ${darkMode ? "bg-neutral-700" : "bg-gray-300"} ${darkMode ? "hover:bg-neutral-600" : "hover:bg-neutral-400"} hover:cursor-pointer`}
              >
                <FaSignOutAlt className={`mr-3`} />
                <span className={'${darkMode ? "bg-neutral-700" : "bg-gray-300"}'}>Logout</span>
              </div>

              {/* Delete Account */}
              <div
                onClick={handleDeleteAccount}
                className={`flex items-center p-4 rounded-lg ${darkMode ? "bg-neutral-700" : "bg-gray-300"} ${darkMode ? "hover:bg-red-600" : "hover:bg-red-400"} hover:cursor-pointer`}
              >
                <FaTrash className={`mr-3`} />
                <span className={'${darkMode ? "bg-neutral-700" : "bg-gray-300"}'}>Delete Account</span>
              </div>
            </div>
          </div>
        )}

        {activeSection === "comics" && (
          <div>
            <h2 className={`text-3xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-neutral-900"}`}>Comics Available Online!!</h2>

            {/* Search Bar */}
            <div className={`p-2 border ${darkMode ? "border-neutral-600" : "border-gray-300"} rounded-md w-full max-w-md flex items-center ${darkMode ? "bg-neutral-800" : "bg-white"}`}>
              <FaSearch className="mr-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search comics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full outline-none ${darkMode ? "bg-transparent text-white" : "bg-transparent text-neutral-900"}`}
              />
              <button onClick={() => setModalOpen(true)} className="ml-2 text-gray-400">
                Ctrl+K
              </button>
            </div>

            {/* Modal for Searching */}
            {modalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className={`${darkMode ? "bg-neutral-800" : "bg-white"} p-6 rounded-lg shadow-lg w-96 relative`}>
                  {/* Close button with cross icon */}
                  <button
                    onClick={() => setModalOpen(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 text-3xl"
                  >
                    ×
                  </button>
                  <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-neutral-900"}`}>Search Comics</h3>
                  <input
                    type="text"
                    placeholder="Type here..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`p-2 border ${darkMode ? "border-orange-500" : "border-orange-300"} rounded-md w-full ${darkMode ? "bg-neutral-700 text-white" : "bg-gray-200 text-neutral-900"}`}
                  />
                </div>
              </div>
            )}

            {/* Comics Vertical List */}
            <div className="grid grid-cols-1 gap-6 mt-6">
              {filteredComics.map((comic) => (
                <div key={comic.id} className={`${darkMode ? "bg-neutral-800" : "bg-white"} p-4 rounded-lg shadow-md`}>
                  <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-neutral-900"}`}>{comic.title}</h3>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>By {comic.author}</p>

                  {/* View More Button Inline */}
                  <div className="mt-4 flex justify-between items-center">
                    <a
                      href={`/comic_viewer?comicId=${comic.id}`} // Link to the comic viewer page
                      target="_blank" // Open in a new tab
                      rel="noopener noreferrer" // Security best practice for target="_blank"
                      className="flex items-center bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                    >
                      <FaEye className="mr-2" /> View & Read
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
