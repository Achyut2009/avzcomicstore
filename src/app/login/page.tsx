"use client";

import { useState } from "react";
import { loginWithEmailPassword, resetPassword } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMode, setResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await loginWithEmailPassword(email, password);
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred during login.");
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccessMessage("Password reset link sent! Check your email.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred during password reset.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleResetMode = () => {
    setLoading(true);
    setTimeout(() => {
      setResetMode(!resetMode);
      setError(null);
      setSuccessMessage(null);
      setLoading(false);
    }, 1500); // 1.5-second delay
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-animate-gradient p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-sm p-8 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-lg border border-transparent"
      >
        <h2 className="text-white text-3xl font-bold text-center mb-6">
          {resetMode ? "Reset Password" : "Login"}
        </h2>

        <form onSubmit={resetMode ? handleResetPassword : handleSubmit} className="space-y-6">
          {error && <div className="text-red-500">{error}</div>}
          {successMessage && <div className="text-green-500">{successMessage}</div>}

          <div>
            <label className="text-white block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-white/30 backdrop-blur-md text-white"
              required
            />
          </div>

          {!resetMode && (
            <div>
              <label className="text-white block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-md bg-white/30 backdrop-blur-md text-white pr-12"
                  required
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-3 rounded-md transition-colors duration-300 hover:bg-blue-600 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {resetMode ? "Send Reset Link" : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={toggleResetMode}
            className={`text-gray-400 hover:underline ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Redirecting..." : resetMode ? "Back to Login" : "Forgot your password?"}
          </button>
        </div>

        {!resetMode && (
          <p className="text-white text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-gray-400 hover:underline">
              Sign Up
            </Link>
          </p>
        )}
      </motion.div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bg-animate-gradient {
          background: linear-gradient(270deg, rgba(56, 34, 202, 0.98), rgb(117, 12, 165), rgb(133, 43, 217));
          background-size: 600% 600%;
          animation: gradient 10s ease infinite;
        }
      `}</style>
    </div>
  );
}
