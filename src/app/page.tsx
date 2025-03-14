"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react"; // Removed unused Sun and Moon icons
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import Image from "next/image"; // Import Next.js Image component

export default function Home() {
  const { resolvedTheme } = useTheme(); // Removed unused setTheme
  const [mounted, setMounted] = useState(false);
  const [scrambleText, setScrambleText] = useState(""); // State for scramble effect
  const fullText = "Welcome to AV&apos;z Comicstore"; // Text to display with proper HTML special character
  const [openQuestion, setOpenQuestion] = useState<number | null>(null); // State for FAQ dropdown
  const [screenWidth, setScreenWidth] = useState<number>(0); // State to track screen width

  useEffect(() => {
    setMounted(true);

    // Function to update screen width
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    // Set initial screen width
    updateScreenWidth();

    // Add event listener to update screen width on resize
    window.addEventListener("resize", updateScreenWidth);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    const scrambleInterval = setInterval(() => {
      setScrambleText((_) => {
        return fullText
          .split("")
          .map((char, index) => {
            if (index < currentIndex) return char; // Keep resolved characters as is
            if (char === " ") return " "; // Keep spaces as is
            return String.fromCharCode(Math.floor(Math.random() * 94) + 33); // Random ASCII character
          })
          .join("");
      });
    }, 50); // Change characters every 50ms (faster)

    // Resolve one letter at a time
    const resolveInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        currentIndex++;
      } else {
        clearInterval(scrambleInterval); // Stop scramble effect
        clearInterval(resolveInterval); // Stop resolve effect
      }
    }, 100); // Resolve one letter every 100ms (faster)

    // Cleanup intervals on unmount
    return () => {
      clearInterval(scrambleInterval);
      clearInterval(resolveInterval);
    };
  }, []);

  if (!mounted) return null; // Prevents hydration mismatch

  // Comic names
  const comicNames = [
    "Highly Flammable Part 1",
    "Highly Flammable Part 2",
    "Highly Flammable Part 3",
    "Highly Flammable Part 4",
    "Highly Flammable Part 5",
    "The Ultimate Great Fellow",
  ];

  // FAQ Data
  const faqData = [
    {
      question: "How can I read the comics?",
      answer: "You need to sign up or log in to access and read the comics. Once logged in, you can explore all available comics.",
    },
    {
      question: "Why am I not getting any reset link in my email at the time of login?",
      answer: "This can probably occur because your account might have been deleted.",
    },
    {
      question: "Can I download the comics?",
      answer: "Currently, downloading comics is not supported. You can read them online on our platform.",
    },
    {
      question: "Why am I not able to login to my account?",
      answer: "This is probably because your account might have been blocked or banned by the avzcomicstore temporarily.",
    },
  ];

  // Function to toggle FAQ answer
  const toggleFAQ = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-12 font-sans relative overflow-hidden transition-all duration-300 text-gray-900 dark:text-yellow-100"
      style={{ backgroundColor: resolvedTheme === "dark" ? "oklch(0.269 0 0)" : "#fed7aa" }}
    >
      {/* Background Grid for Hero Section */}
      <div className={`absolute inset-0 z-0 transform rotate-45 overflow-hidden ${screenWidth < 770 ? "hidden" : ""}`}>
        <div className="grid grid-cols-12 grid-rows-12 gap-2 w-full h-[200vh]">
          {[...Array(144)].map((_, i) => (
            <div
              key={i}
              className="bg-orange-100 dark:bg-orange-200/20 rounded-lg"
            ></div>
          ))}
        </div>
      </div>

      {/* Particle Effects */}
      <div className="absolute inset-0 overflow-hidden z-10">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, x: Math.random() * 100 }}
            animate={{ y: [0, 100, 0], x: [Math.random() * 100, Math.random() * 100] }}
            transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 2 }}
            className="absolute w-2 h-2 bg-orange-400/50 rounded-full dark:bg-yellow-400/50"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          ></motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <section id="home" className="flex flex-col items-center justify-center text-center w-full min-h-screen relative z-20 -mt-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400" style={{ textShadow: "0 0 20px rgba(255, 165, 0, 0.8), 0 0 40px rgba(255, 165, 0, 0.6), 0 0 60px rgba(255, 165, 0, 0.4)" }}>
          {scrambleText}
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-yellow-100 mb-8 font-mono max-w-2xl">
          Discover the world of comics written by Achyut and Viraj. Dive into fantasy, thrill, adventure, and unexpected twists. Our comics promise to keep you at the edge of your seat.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/signup" // Link to signup
            target="_blank" // Open in new tab
            rel="noopener noreferrer"
            className="rounded-lg px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/50"
          >
            Sign Up
          </a>
          <a
            href="/login" // Link to login
            target="_blank" // Open in new tab
            rel="noopener noreferrer"
            className="rounded-lg px-6 py-3 border border-orange-500 text-orange-300 font-semibold hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/50"
          >
            Login
          </a>
        </div>
      </section>

      {/* Achyut Paliwal and Viraj Pranshu Section */}
      <div className="w-full mt-16 relative z-20">
        {/* Authors Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400" style={{ textShadow: "0 0 20px rgba(255, 165, 0, 0.8), 0 0 40px rgba(255, 165, 0, 0.6), 0 0 60px rgba(255, 165, 0, 0.4)" }}>
          About the Authors
        </h2>

        {/* Author Cards */}
        <div className="flex flex-wrap justify-center gap-8">
          {/* Achyut Paliwal Box */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }} // Ensures animation only happens once
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-6 bg-white dark:bg-stone-900 rounded-lg shadow-lg flex flex-col items-center transition-all transform hover:scale-105 cursor-pointer hover:shadow-xl"
          >
            {/* Circular Image */}
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <Image
                src="/achyut.png" // Replace with Achyut's image URL
                alt="Achyut Paliwal"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-orange-500">Achyut Paliwal</h2>
            <p className="text-gray-700 dark:text-yellow-100 text-center">
              The founder of AVz comicstore who is very passionate about programming, web development and writing. He is also the founder and ceo of SkyDark. He had also scored 1st place in the DPS-Modern Indian School hackathon.
            </p>
          </motion.div>

          {/* Viraj Pranshu Box */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }} // Ensures animation only happens once
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-6 bg-white dark:bg-stone-900 rounded-lg shadow-lg flex flex-col items-center transition-all transform hover:scale-105 cursor-pointer hover:shadow-xl"
          >
            {/* Circular Image */}
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <Image
                src="/viraj.png" // Replace with Viraj's image URL
                alt="Viraj Pranshu"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-orange-500">Viraj Pranshu</h2>
            <p className="text-gray-700 dark:text-yellow-100 text-center">
              A creative writer and co-founder of AVz comicstore bringing stories to life! He is also a very professional badminton player who had won the 1st place in international level in Kuwait.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Spacing after About the Authors Section */}
      <div className="mt-16"></div>

      {/* Frequently Asked Questions Section */}
      <div className="w-full relative z-20 mt-64">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400" style={{ textShadow: "0 0 20px rgba(255, 165, 0, 0.8), 0 0 40px rgba(255, 165, 0, 0.6), 0 0 60px rgba(255, 165, 0, 0.4)" }}>
          Frequently Asked Questions
        </h2>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }} // Ensures animation only happens once
              className="mb-4"
            >
              {/* Question */}
              <div className="p-4 bg-white dark:bg-stone-900 rounded-lg shadow-lg flex justify-between items-center cursor-pointer hover:shadow-xl">
                <h3 className="text-xl font-semibold text-orange-500">{faq.question}</h3>
                <button
                  onClick={() => toggleFAQ(index)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-stone-700 transition-all"
                >
                  {openQuestion === index ? (
                    <Minus className="w-6 h-6 text-orange-500" />
                  ) : (
                    <Plus className="w-6 h-6 text-orange-500" />
                  )}
                </button>
              </div>
              {/* Answer */}
              <AnimatePresence>
                {openQuestion === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-white dark:bg-stone-900 rounded-b-lg shadow-lg mt-2">
                      <p className="text-gray-700 dark:text-yellow-100">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Spacing after FAQ Section */}
      <div className="mt-16"></div>

      {/* Comics Section */}
      <div className="w-full relative z-20 overflow-hidden mt-64">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
          Explore Our Comics
        </h2>
        <div className="relative w-full h-64 overflow-hidden">
          {/* Marquee Container */}
          <div className="absolute top-0 left-0 w-[800%] h-full flex gap-8 animate-marquee whitespace-nowrap">
            {/* Comic Cards */}
            {[...Array(4)].map((_, iteration) =>
              comicNames.map((name, i) => (
                <div
                  key={`${iteration}-${i}`}
                  className="w-64 h-64 bg-white dark:bg-stone-900 rounded-lg shadow-lg flex flex-col items-center justify-center relative group transition-all transform hover:scale-105 cursor-pointer hover:shadow-xl"
                >
                  {/* Comic Name */}
                  <h3 className="text-xl font-bold text-orange-500 text-center">
                    {name}
                  </h3>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href="/login" // Link to login
                      target="_blank" // Open in new tab
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all transform hover:scale-105"
                    >
                      Login to Read
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Spacing after Comics Section */}
      <div className="mt-16"></div>

      {/* Marquee Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite; /* Slowed down speed */
        }
      `}</style>
    </div>
  );
}
