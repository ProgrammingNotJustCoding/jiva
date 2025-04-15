"use client";

import React from "react";
import Image from "next/image";
import {
  FaCalendarCheck,
  FaExclamationTriangle,
  FaUserClock,
  FaClipboardCheck,
  FaShieldAlt,
} from "react-icons/fa";
import DashboardLayout from "@/layouts/DashboardLayout";

const SupervisorDashboard = () => {
  const metrics = {
    totalShifts: 124,
    incidentsReported: 7,
    averageShiftLength: "8.5 hours",
    workersSupervised: 42,
    complianceRate: "98%",
    safetyScore: 94,
    dgmsCompliance: 96,
    smpAdherence: 92,
  };

  return (
    <DashboardLayout userRole="supervisor" userName="John Smith">
      <div className="relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-1/2 h-full z-0 opacity-20"
          style={{
            clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
          }}
        >
          <Image
            src="/images/gradient.webp"
            alt="Background gradient"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        <div className="space-y-8 relative z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Supervisor Dashboard
            </h2>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              Operational Overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-xl border border-cyan-200 shadow-sm transition-transform hover:scale-105">
                <div className="flex items-center">
                  <div className="rounded-full bg-cyan-500/20 p-4 mr-5">
                    <FaCalendarCheck className="text-cyan-600 text-xl" />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-gray-800">
                      {metrics.totalShifts}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      Total Shifts
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 shadow-sm transition-transform hover:scale-105">
                <div className="flex items-center">
                  <div className="rounded-full bg-red-500/20 p-4 mr-5">
                    <FaExclamationTriangle className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-gray-800">
                      {metrics.incidentsReported}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      Incidents Reported
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-sm transition-transform hover:scale-105">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-500/20 p-4 mr-5">
                    <FaUserClock className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-gray-800">
                      {metrics.workersSupervised}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      Workers Supervised
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Compliance Metrics
              </h3>

              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <FaShieldAlt className="text-cyan-600 mr-3 text-xl" />
                  <h4 className="text-lg font-medium text-gray-800">
                    DGMS Compliance
                  </h4>
                </div>
                <p className="text-gray-600 mb-4">
                  The Directorate General of Mine Safety (DGMS) compliance
                  indicates how well your operations adhere to the regulatory
                  requirements set by the national mining authority. This
                  includes equipment inspections, safety protocols, and incident
                  reporting.
                </p>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Current Score</span>
                    <span className="text-sm font-medium text-cyan-600">
                      {metrics.dgmsCompliance}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-cyan-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${metrics.dgmsCompliance}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <FaClipboardCheck className="text-green-600 mr-3 text-xl" />
                  <h4 className="text-lg font-medium text-gray-800">
                    SMP Adherence
                  </h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Safety Management Plan (SMP) adherence measures how
                  consistently your team follows the mine-specific safety
                  protocols. A strong SMP score indicates good risk management
                  practices, proper hazard identification, and systematic safety
                  procedures.
                </p>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Current Score</span>
                    <span className="text-sm font-medium text-green-600">
                      {metrics.smpAdherence}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${metrics.smpAdherence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Recent Activity
              </h3>
              <div className="space-y-5">
                {[
                  {
                    title: "DGMS inspection cleared",
                    description:
                      "All equipment passed quarterly safety inspection",
                    time: "2 hours ago",
                    type: "success",
                  },
                  {
                    title: "SMP training completed",
                    description:
                      "12 workers completed their annual safety refresher course",
                    time: "1 day ago",
                    type: "info",
                  },
                  {
                    title: "Minor incident reported",
                    description:
                      "Machinery malfunction in section B - no injuries",
                    time: "2 days ago",
                    type: "warning",
                  },
                  {
                    title: "Shift #127 completed",
                    description:
                      "All safety protocols followed, productivity at 103% of target",
                    time: "3 days ago",
                    type: "normal",
                  },
                ].map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-start pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div
                      className={`w-3 h-3 mt-1.5 rounded-full mr-4 ${
                        activity.type === "success"
                          ? "bg-green-500"
                          : activity.type === "warning"
                            ? "bg-amber-500"
                            : activity.type === "info"
                              ? "bg-cyan-500"
                              : "bg-gray-400"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-base font-medium text-gray-800">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-medium transition-colors">
                View All Activity
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-500 to-cyan-700 rounded-xl shadow-lg p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">
                  Safety First Initiative
                </h3>
                <p className="text-cyan-100 max-w-xl">
                  Your team is currently leading the mine's safety performance.
                  Keep up the excellent work by continuing to enforce DGMS
                  regulations and maintaining SMP compliance.
                </p>
              </div>
              <div className="flex items-center">
                <button className="bg-white text-cyan-700 hover:bg-cyan-50 px-6 py-3 rounded-md text-sm font-medium transition-colors shadow-md">
                  View Safety Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupervisorDashboard;
