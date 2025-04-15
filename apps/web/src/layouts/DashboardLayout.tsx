"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AUTH_API_URL } from "../utils/constants";
import {
  FaHome,
  FaUserTie,
  FaHardHat,
  FaFileAlt,
  FaCalendarAlt,
  FaUser,
  FaKey,
  FaExchangeAlt,
} from "react-icons/fa";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole?: "admin" | "supervisor" | "manager" | "worker";
  userName?: string;
}

interface User {
  id: string;
  name: string;
  role: string;
  userCode: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userRole: propUserRole,
  userName: propUserName,
}) => {
  const [currentPath, setCurrentPath] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    verifyAuthentication();
  }, []);

  const verifyAuthentication = async () => {
    try {
      const token = localStorage.getItem("auth-token");

      if (!token) {
        router.push("/auth");
        return;
      }

      const response = await fetch(`${AUTH_API_URL}/auth/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const userData = await response.json();
      setUser(userData.data);
      localStorage.setItem("user-data", JSON.stringify(userData.data));
    } catch (error) {
      console.error("Authentication error:", error);
      localStorage.removeItem("auth-token");
      router.push("/auth");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Use props if provided, otherwise use data from API
  const userRole = propUserRole || user?.role || "worker";
  const userName = propUserName || user?.name || "User";

  // Map roles from API to component props if needed
  const mappedRole = userRole === "worker" ? "supervisor" : userRole;

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      <div className="w-64 bg-white text-gray-800 shadow-lg relative z-10">
        <div className="p-6 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Jiva Logo"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="text-xl font-bold text-cyan-600">Jiva Safety</span>
          </div>
        </div>

        <nav className="p-4">
          <div className="text-xs uppercase text-neutral-500 font-medium mb-4 ml-2">
            Main Navigation
          </div>
          <ul className="space-y-1">
            {mappedRole === "admin" || mappedRole === "manager" ? (
              <>
                <li>
                  <Link
                    href="/dashboard/manager"
                    className={`flex items-center p-3 rounded-md hover:bg-cyan-50 transition-colors ${
                      currentPath ===
                      `/dashboard/${mappedRole === "admin" ? "manager" : "supervisor"}`
                        ? "bg-cyan-50 text-cyan-600"
                        : "text-neutral-700 hover:text-cyan-600"
                    }`}
                  >
                    <FaHome
                      className={`mr-3 ${currentPath === "/dashboard" ? "text-cyan-600" : "text-neutral-400"}`}
                    />
                    <span className="font-medium">Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/manager/create-supervisor"
                    className={`flex items-center p-3 rounded-md hover:bg-cyan-50 transition-colors ${
                      currentPath === "/dashboard/create-supervisor"
                        ? "bg-cyan-50 text-cyan-600"
                        : "text-neutral-700 hover:text-cyan-600"
                    }`}
                  >
                    <FaUserTie
                      className={`mr-3 ${currentPath === "/dashboard/create-supervisor" ? "text-cyan-600" : "text-neutral-400"}`}
                    />
                    <span className="font-medium">Create Supervisor</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/manager/create-worker"
                    className={`flex items-center p-3 rounded-md hover:bg-cyan-50 transition-colors ${
                      currentPath === "/dashboard/manager/create-worker"
                        ? "bg-cyan-50 text-cyan-600"
                        : "text-neutral-700 hover:text-cyan-600"
                    }`}
                  >
                    <FaHardHat
                      className={`mr-3 ${currentPath === "/dashboard/manager/create-worker" ? "text-cyan-600" : "text-neutral-400"}`}
                    />
                    <span className="font-medium">Create Worker</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/manager/smp-documents"
                    className={`flex items-center p-3 rounded-md hover:bg-cyan-50 transition-colors ${
                      currentPath === "/dashboard/manager/smp-documents"
                        ? "bg-cyan-50 text-cyan-600"
                        : "text-neutral-700 hover:text-cyan-600"
                    }`}
                  >
                    <FaFileAlt
                      className={`mr-3 ${currentPath === "/dashboard/manager/smp-documents" ? "text-cyan-600" : "text-neutral-400"}`}
                    />
                    <span className="font-medium">SMP Documents</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/manager/create-shift"
                    className={`flex items-center p-3 rounded-md hover:bg-cyan-50 transition-colors ${
                      currentPath === "/dashboard/manager/create-shift"
                        ? "bg-cyan-50 text-cyan-600"
                        : "text-neutral-700 hover:text-cyan-600"
                    }`}
                  >
                    <FaCalendarAlt
                      className={`mr-3 ${currentPath === "/dashboard/manager/create-shift" ? "text-cyan-600" : "text-neutral-400"}`}
                    />
                    <span className="font-medium">Create Shift</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/dashboard/supervisor"
                    className={`flex items-center p-3 rounded-md hover:bg-cyan-50 transition-colors ${
                      currentPath === "/dashboard/supervisor"
                        ? "bg-cyan-50 text-cyan-600"
                        : "text-neutral-700 hover:text-cyan-600"
                    }`}
                  >
                    <FaHome
                      className={`mr-3 ${currentPath === "/dashboard/supervisor/supervisor" ? "text-cyan-600" : "text-neutral-400"}`}
                    />
                    <span className="font-medium">Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/supervisor/current-shift"
                    className={`flex items-center p-3 rounded-md hover:bg-cyan-50 transition-colors ${
                      currentPath === "/dashboard/supervisor/current-shift"
                        ? "bg-cyan-50 text-cyan-600"
                        : "text-neutral-700 hover:text-cyan-600"
                    }`}
                  >
                    <FaCalendarAlt
                      className={`mr-3 ${currentPath === "/dashboard/supervisor/current-shift" ? "text-cyan-600" : "text-neutral-400"}`}
                    />
                    <span className="font-medium">Current Shift</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/supervisor/my-shifts"
                    className={`flex items-center p-3 rounded-md hover:bg-cyan-50 transition-colors ${
                      currentPath === "/dashboard/supervisor/my-shifts"
                        ? "bg-cyan-50 text-cyan-600"
                        : "text-neutral-700 hover:text-cyan-600"
                    }`}
                  >
                    <FaExchangeAlt
                      className={`mr-3 ${currentPath === "/dashboard/supervisor/my-shifts" ? "text-cyan-600" : "text-neutral-400"}`}
                    />
                    <span className="font-medium">My Shifts</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 w-full border-t border-neutral-100">
          {(mappedRole === "supervisor" || mappedRole === "manager") && (
            <div className="p-4 flex items-center">
              <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 mr-3">
                <FaUser />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{userName}</div>
                <button className="text-xs text-cyan-600 flex items-center mt-1 hover:underline">
                  <FaKey className="mr-1 text-xs" />
                  Change Password
                </button>
              </div>
            </div>
          )}
          <div className="p-4 text-sm text-neutral-500">
            © 2023 Jiva Safety
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div
          className="absolute top-0 right-0 w-full h-full z-0 opacity-10"
          style={{
            clipPath: "polygon(100% 0%, 100% 100%, 50% 100%)",
          }}
        >
          <Image
            src="/images/gradient.webp"
            alt="Background gradient"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        <header className="bg-white shadow-sm p-4 border-b border-neutral-100 relative z-10">
          <h1 className="text-xl font-semibold text-neutral-800">
            Safety Management Portal
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
