"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AUTH_API_URL } from "@/utils/constants";

const Auth: React.FC = () => {
  const [credentials, setCredentials] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${AUTH_API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userCode: credentials,
          password: password,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to sign in");
      }

      localStorage.setItem("auth-token", resData.data.token);

      window.location.href = "/dashboard";
      if (resData.data.role === "admin") {
        window.location.href = "/dashboard/manager";
      } else if (resData.data.role === "supervisor") {
        window.location.href = "/dashboard/supervisor";
      } else {
        console.log("Unknown role");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        typeof err === "object" && err instanceof Error
          ? err.message
          : "Authentication failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full h-screen bg-white flex">
      <div className="flex lg:flex-row w-full h-full">
        <div className="w-full lg:w-1/2 px-6 py-12 md:px-16 lg:px-20 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Sign In</h2>
            <p className="text-neutral-600 mb-8">
              Welcome back. Enter your credentials to access your account.
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="credentials"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  User Code
                </label>
                <input
                  id="credentials"
                  type="text"
                  value={credentials}
                  onChange={(e) => setCredentials(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter your user code"
                  required
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-cyan-500 hover:text-cyan-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-700 text-white px-6 py-3 rounded-md text-lg font-medium transition-colors mb-4 disabled:bg-cyan-300"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>

        <div className="w-2/3 lg:flex hidden bg-gray-50 px-6 py-12 md:px-16 lg:px-20 items-center">
          <div className="w-full max-w-md mx-auto text-center">
            <div className="relative w-48 h-48 mx-auto mb-8">
              <Image
                src="/images/logo.png"
                alt="Jiva Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Making Coal Mine Operations Safer and More Productive
            </h3>

            <p className="text-neutral-600">
              Jiva simplifies daily tasks and enhances safety compliance for
              everyone working in coal mines, with an easy-to-use digital
              solution that improves efficiency and safety.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;
