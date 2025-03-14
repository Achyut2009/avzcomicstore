"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signUpWithEmailPassword } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const message = await signUpWithEmailPassword(email, password);
      setSuccess(message); // Success message (string)
      router.push("/dashboard"); // Redirect to dashboard after successful sign-up
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    router.prefetch("/login");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-animate-gradient p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-sm p-8 bg-black/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10"
      >
        <h2 className="text-white text-3xl font-bold text-center mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>} {/* Success message */}
          
          <div>
            <label className="text-white block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-black/20 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="text-white block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md bg-black/20 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                placeholder="Enter your password"
                required
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
        <p className="text-white text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bg-animate-gradient {
          background: linear-gradient(270deg, rgb(196, 180, 4), rgb(166, 8, 0), rgb(168, 114, 0));
          background-size: 600% 600%;
          animation: gradient 10s ease infinite;
        }
      `}</style>
    </div>
  );
}