"use client";

import React, { useState } from "react";
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

  const shiftInfo = {
    id: "8",
    start: "2023-10-15T07:00:00",
    end: "2023-10-15T19:00:00",
    location: "Mine Section B - East Wing",
    supervisor: "John Smith",
    status: "ongoing",
    nextSupervisor: "Sarah Johnson",
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "workers":
        return <ShiftWorkers />;
      case "logs":
        return <ShiftLogs />;
      case "hazards":
        return <HazardsAndIncidents />;
      default:
        return <ShiftWorkers />;
    }
  };

  return (
    <DashboardLayout userRole="supervisor" userName="John Smith">
      <div className="relative overflow-hidden">
        <div className="space-y-6 relative z-10">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold text-gray-800 mr-3">
                    Current Shift
                  </h2>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{shiftInfo.id}</p>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center">
                <div className="flex flex-col mr-6">
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium mr-2">Time:</span>
                    <span>
                      {formatTime(shiftInfo.start)} -{" "}
                      {formatTime(shiftInfo.end)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700 mt-1">
                    <span className="font-medium mr-2">Location:</span>
                    <span>{shiftInfo.location}</span>
                  </div>
                </div>

                <ShiftHandoverButton shiftInfo={shiftInfo} />
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
