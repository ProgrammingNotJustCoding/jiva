"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
  FaCalendarAlt,
  FaUser,
  FaSpinner,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";

interface Shift {
  id: number;
  supervisorId: number;
  nextSupervisorId: number | null;
  startTime: string;
  endTime: string | null;
  status:
    | "to_begin"
    | "ongoing"
    | "ready_for_handover"
    | "handed_over"
    | "acknowledged";
}

const MyShiftsPage = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = 1;

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/shifts?supervisorId=${userId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch shifts");
        }

        const data = await response.json();
        setShifts(data.data);
      } catch (err) {
        console.log("Error fetching shifts:", err);
        setError("Failed to load shifts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [userId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "to_begin":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            To Begin
          </span>
        );
      case "in_progress":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            Completed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <DashboardLayout userRole="supervisor">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">My Shifts</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="text-cyan-600 text-4xl animate-spin" />
            <span className="ml-2 text-gray-600">Loading shifts...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md flex items-center">
            <FaExclamationCircle className="text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        ) : shifts.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-md text-center">
            <FaCalendarAlt className="text-gray-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700">
              No shifts found
            </h3>
            <p className="text-gray-500 mt-2">
              You don&apos;t have any shifts assigned at the moment.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Shift ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    End Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Next Supervisor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{shift.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaClock className="text-cyan-500 mr-2" />
                        {formatDate(shift.startTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shift.endTime ? formatDate(shift.endTime) : "Not ended"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-2" />
                        {shift.nextSupervisorId
                          ? `Supervisor #${shift.nextSupervisorId}`
                          : "Yet to be allotted"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(shift.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyShiftsPage;
