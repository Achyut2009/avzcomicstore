"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/avz-logo.svg"
            alt="AV'z Comicstore Logo"
            width={120}
            height={30}
            className="dark:invert"
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/shop" className="text-sm font-medium hover:text-orange-500">
            Shop
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-orange-500">
            About Us
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-orange-500">
            Contact
          </Link>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
}