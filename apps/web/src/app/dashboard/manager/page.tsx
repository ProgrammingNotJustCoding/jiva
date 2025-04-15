"use client";
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DashboardPage: React.FC = () => {
  const stats = {
    ongoingShifts: 12,
    activeWorkers: 47,
    pendingReviews: 8,
    totalHazards: 124,
  };

  const hazardData = [
    { month: "Jan", occurrences: 18 },
    { month: "Feb", occurrences: 12 },
    { month: "Mar", occurrences: 15 },
    { month: "Apr", occurrences: 8 },
    { month: "May", occurrences: 10 },
    { month: "Jun", occurrences: 6 },
  ];

  const incidentData = [
    { month: "Jan", occurrences: 3 },
    { month: "Feb", occurrences: 1 },
    { month: "Mar", occurrences: 2 },
    { month: "Apr", occurrences: 0 },
    { month: "May", occurrences: 1 },
    { month: "Jun", occurrences: 0 },
  ];

  const pieData = [
    { name: "Hazards", value: 124, color: "#06b6d4" },
    { name: "Incidents", value: 7, color: "#f97316" },
  ];

  const topHazardsIncidents = [
    { id: 1, type: "Hazard", description: "Slippery surface", occurrences: 28 },
    { id: 2, type: "Incident", description: "Worker fall", occurrences: 3 },
    {
      id: 3,
      type: "Hazard",
      description: "Electrical wiring exposed",
      occurrences: 24,
    },
    {
      id: 4,
      type: "Hazard",
      description: "Inadequate lighting",
      occurrences: 19,
    },
    {
      id: 5,
      type: "Hazard",
      description: "Missing guardrails",
      occurrences: 17,
    },
    {
      id: 6,
      type: "Incident",
      description: "Equipment malfunction",
      occurrences: 2,
    },
    {
      id: 7,
      type: "Hazard",
      description: "Unstable scaffolding",
      occurrences: 15,
    },
    {
      id: 8,
      type: "Hazard",
      description: "Unsecured materials",
      occurrences: 13,
    },
    { id: 9, type: "Incident", description: "Chemical spill", occurrences: 1 },
    {
      id: 10,
      type: "Hazard",
      description: "Poor ventilation",
      occurrences: 11,
    },
  ];

  return (
    <DashboardLayout userRole="admin">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-100">
            <h3 className="text-neutral-500 text-sm font-medium">
              Ongoing Shifts
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.ongoingShifts}
            </p>
            <div className="mt-2 w-16 h-1 bg-cyan-500 rounded-full"></div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-100">
            <h3 className="text-neutral-500 text-sm font-medium">
              Active Workers
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.activeWorkers}
            </p>
            <div className="mt-2 w-16 h-1 bg-cyan-500 rounded-full"></div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-100">
            <h3 className="text-neutral-500 text-sm font-medium">
              Pending Reviews
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.pendingReviews}
            </p>
            <div className="mt-2 w-16 h-1 bg-cyan-500 rounded-full"></div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-100">
            <h3 className="text-neutral-500 text-sm font-medium">
              Total Hazards Reported
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.totalHazards}
            </p>
            <div className="mt-2 w-16 h-1 bg-cyan-500 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-100">
            <h2 className="text-lg font-semibold mb-4 text-neutral-800">
              Hazard Occurrences (Last 6 Months)
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hazardData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="occurrences"
                    fill="#06b6d4"
                    name="Hazards"
                  />{" "}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-100">
            <h2 className="text-lg font-semibold mb-4 text-neutral-800">
              Incident Occurrences (Last 6 Months)
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="occurrences"
                    fill="#f97316"
                    name="Incidents"
                  />{" "}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-100">
            <h2 className="text-lg font-semibold mb-4 text-neutral-800">
              Hazards vs Incidents
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-neutral-100 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-neutral-800">
              Top 10 Hazards and Incidents
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50 rounded-tl-md">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50 rounded-tr-md">
                      Occurrences
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-100">
                  {topHazardsIncidents.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.type === "Hazard"
                              ? "bg-cyan-100 text-cyan-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-neutral-700">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                        {item.occurrences}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
