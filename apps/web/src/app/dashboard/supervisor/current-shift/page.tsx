"use client";

import React, { useState, useEffect } from "react";
import { SHIFT_API_URL } from "@/utils/constants";
import {
  FaUsers,
  FaClipboardList,
  FaExclamationTriangle,
} from "react-icons/fa";
import DashboardLayout from "@/layouts/DashboardLayout";
import ShiftWorkers from "@/components/dashboard/ShiftWorkers";
import ShiftLogs from "@/components/dashboard/ShiftLogs";
import HazardsAndIncidents from "@/components/dashboard/HazardsAndIncidents";
import ShiftHandoverButton from "@/components/dashboard/ShiftHandoverButton";

const CurrentShiftPage = () => {
  const [activeTab, setActiveTab] = useState("workers");
  const [shiftData, setShiftData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentShift = async () => {
      try {
        const getUserData = localStorage.getItem("user-data");
        const userId = getUserData ? JSON.parse(getUserData).id : null;

        if (!userId) {
          throw new Error("User ID not found");
        }

        const response = await fetch(
          `${SHIFT_API_URL}/shifts/current-shift/${userId}`,
        );

        if (!response.ok) {
          throw new Error(`Error fetching shift data: ${response.status}`);
        }

        const resData = await response.json();
        setShiftData(resData.data);

        if (resData.data?.workers?.length) {
          localStorage.setItem(
            "shift-workers",
            JSON.stringify(resData.data.workers),
          );

          localStorage.setItem("shiftId", resData.data.id);
        }
      } catch (err) {
        console.error("Failed to fetch shift data:", err);
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentShift();
  }, []);

  useEffect(() => {
    if (shiftData && shiftData.status === "to_begin") {
      const checkAndUpdateShiftStatus = async () => {
        const now = new Date();
        const shiftStartTime = new Date(shiftData.startTime);

        if (now >= shiftStartTime) {
          try {
            const response = await fetch(
              `${SHIFT_API_URL}/shifts/${shiftData.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "ongoing" }),
              },
            );

            if (response.ok) {
              setShiftData({
                ...shiftData,
                status: "ongoing",
              });
              console.log("Shift status updated to ongoing");
            } else {
              console.error(
                "Failed to update shift status:",
                await response.text(),
              );
            }
          } catch (err) {
            console.error("Error updating shift status:", err);
          }
        } else {
          const timeUntilStart = shiftStartTime.getTime() - now.getTime();
          if (timeUntilStart > 0 && timeUntilStart < 2147483647) {
            const timerId = setTimeout(() => {
              checkAndUpdateShiftStatus();
            }, timeUntilStart);

            return () => clearTimeout(timerId);
          }
        }
      };

      checkAndUpdateShiftStatus();
    }
  }, [shiftData]);

  const formatTime = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const getShiftStatus = (status: string) => {
    switch (status) {
      case "to_begin":
        return { label: "To Begin", className: "bg-blue-100 text-blue-800" };
      case "ongoing":
        return { label: "Active", className: "bg-green-100 text-green-800" };
      case "completed":
        return { label: "Completed", className: "bg-gray-100 text-gray-800" };
      default:
        return { label: status, className: "bg-gray-100 text-gray-800" };
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "workers":
        return <ShiftWorkers workers={shiftData?.workers || []} />;
      case "logs":
        return <ShiftLogs shiftId={shiftData?.id} />;
      case "hazards":
        return <HazardsAndIncidents shiftId={shiftData?.id} />;
      default:
        return <ShiftWorkers workers={shiftData?.workers || []} />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="supervisor">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading shift data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="supervisor">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <h3 className="text-xl font-medium text-red-700 mb-2">
            Error Loading Shift Data
          </h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!shiftData) {
    return (
      <DashboardLayout userRole="supervisor">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <h3 className="text-xl font-medium text-amber-700 mb-2">
            No Active Shift
          </h3>
          <p className="text-amber-600">
            You don&apos;t have any active shift at the moment.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const statusInfo = getShiftStatus(shiftData.status);

  return (
    <DashboardLayout userRole="supervisor">
      <div className="relative overflow-hidden">
        <div className="space-y-6 relative z-10">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold text-gray-800 mr-3">
                    Current Shift
                  </h2>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.className}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">Shift #{shiftData.id}</p>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center">
                <div className="flex flex-col mr-6">
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium mr-2">Supervisor:</span>
                    <span>
                      {shiftData.supervisor.firstName}{" "}
                      {shiftData.supervisor.lastName}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700 mt-1">
                    <span className="font-medium mr-2">Date:</span>
                    <span>{formatDate(shiftData.startTime)}</span>
                  </div>
                  <div className="flex items-center text-gray-700 mt-1">
                    <span className="font-medium mr-2">Time:</span>
                    <span>
                      {formatTime(shiftData.startTime)}
                      {shiftData.endTime
                        ? ` - ${formatTime(shiftData.endTime)}`
                        : " - Ongoing"}
                    </span>
                  </div>
                </div>

                <ShiftHandoverButton
                  shiftInfo={{
                    id: shiftData.id,
                    status: shiftData.status,
                    nextSupervisor: shiftData.nextSupervisor
                      ? `${shiftData.nextSupervisor.firstName} ${shiftData.nextSupervisor.lastName}`
                      : null,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px space-x-8">
                <button
                  onClick={() => setActiveTab("workers")}
                  className={`py-4 px-1 flex items-center text-sm font-medium ${
                    activeTab === "workers"
                      ? "border-b-2 border-cyan-500 text-cyan-600"
                      : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FaUsers
                    className={`mr-2 ${
                      activeTab === "workers"
                        ? "text-cyan-500"
                        : "text-gray-400"
                    }`}
                  />
                  <span>Shift Workers</span>
                </button>

                <button
                  onClick={() => setActiveTab("logs")}
                  className={`py-4 px-1 flex items-center text-sm font-medium ${
                    activeTab === "logs"
                      ? "border-b-2 border-cyan-500 text-cyan-600"
                      : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FaClipboardList
                    className={`mr-2 ${
                      activeTab === "logs" ? "text-cyan-500" : "text-gray-400"
                    }`}
                  />
                  <span>Shift Logs</span>
                </button>

                <button
                  onClick={() => setActiveTab("hazards")}
                  className={`py-4 px-1 flex items-center text-sm font-medium ${
                    activeTab === "hazards"
                      ? "border-b-2 border-cyan-500 text-cyan-600"
                      : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FaExclamationTriangle
                    className={`mr-2 ${
                      activeTab === "hazards"
                        ? "text-cyan-500"
                        : "text-gray-400"
                    }`}
                  />
                  <span>Hazards & Incidents</span>
                </button>
              </nav>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CurrentShiftPage;
