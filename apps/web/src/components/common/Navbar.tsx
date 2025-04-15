"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CgClose } from "react-icons/cg";
import { BiMenu } from "react-icons/bi";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-sm shadow-sm"
          : "bg-white/70 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-cyan-500 flex flex-row items-center"
            >
              <Image
                src="/images/logo.png"
                alt="Jiva Logo"
                width={50}
                height={50}
                className="w-24 h-24"
              />
              Jiva
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/features"
              className="text-gray-700 hover:text-cyan-500 font-medium transition duration-150"
            >
              Features
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-cyan-500 font-medium transition duration-150"
            >
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth"
              className="text-gray-700 hover:text-cyan-500 font-medium transition duration-150"
            >
              Log in
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-cyan-500 focus:outline-none transition duration-150"
            >
              {mobileMenuOpen ? (
                <CgClose className="h-6 w-6" />
              ) : (
                <BiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden fixed w-full bg-white/95 backdrop-blur-sm transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen
            ? "max-h-[100vh] opacity-100 border-b border-gray-100 shadow-lg"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/features"
            className="block px-3 py-2.5 text-base font-medium text-gray-700 hover:text-cyan-500 hover:bg-gray-50 rounded-md transition duration-150"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/contact"
            className="block px-3 py-2.5 text-base font-medium text-gray-700 hover:text-cyan-500 hover:bg-gray-50 rounded-md transition duration-150"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex flex-col gap-3">
            <Link
              href="/auth"
              className="block w-full text-center py-2.5 text-base font-medium text-gray-700 hover:text-cyan-500 border border-gray-200 rounded-md transition duration-150"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
