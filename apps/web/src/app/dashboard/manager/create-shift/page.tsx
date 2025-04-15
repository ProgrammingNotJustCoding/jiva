"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/layouts/DashboardLayout";
import { FaCalendarAlt, FaUserTie, FaHardHat, FaCheck } from "react-icons/fa";
import { toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

const CreateShift = () => {
  const router = useRouter();
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [workers, setWorkers] = useState<User[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [selectedWorkers, setSelectedWorkers] = useState<User[]>([]);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await fetch(
          `${API_URL}/details/designation?d=supervisor`,
        );
        if (!response.ok) throw new Error("Failed to fetch supervisors");
        const data = await response.json();
        setSupervisors(data.data || []);
      } catch (error) {
        console.log("Error fetching supervisors:", error);
        toast.error("Failed to load supervisors");
      }
    };

    fetchSupervisors();
  }, []);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch(`${API_URL}/details/designation?d=worker`);
        if (!response.ok) throw new Error("Failed to fetch workers");
        const data = await response.json();
        setWorkers(data.data || []);

        const workersToSelect = data.data?.slice(0, 3) || [];
        setSelectedWorkers(workersToSelect);
      } catch (error) {
        console.log("Error fetching workers:", error);
        toast.error("Failed to load workers");
      }
    };

    fetchWorkers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSupervisor || !startTime || selectedWorkers.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        supervisorId: selectedSupervisor,
        startTime: new Date(startTime).toISOString(),
        status: "to_begin",
        workers: selectedWorkers.map((worker) => ({
          id: worker.id.toString(),
        })),
      };

      const response = await fetch(`${API_URL}/shifts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create shift");

      setIsSubmitted(true);
      toast.success("Shift created successfully!");
    } catch (error) {
      console.error("Error creating shift:", error);
      toast.error("Failed to create shift");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isSubmitted) {
    return (
      <DashboardLayout userRole="admin">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheck className="text-green-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Shift Created Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              You have successfully created a new shift with the following
              details:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Supervisor</p>
                  <p className="font-medium">
                    {
                      supervisors.find(
                        (s) => s.id.toString() === selectedSupervisor,
                      )?.firstName
                    }{" "}
                    {
                      supervisors.find(
                        (s) => s.id.toString() === selectedSupervisor,
                      )?.lastName
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Time</p>
                  <p className="font-medium">{formatDateTime(startTime)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Workers Assigned</p>
                  <ul className="list-disc list-inside">
                    {selectedWorkers.map((worker) => (
                      <li key={worker.id} className="font-medium">
                        {worker.firstName} {worker.lastName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push("/dashboard/manager")}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors font-medium"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSelectedSupervisor("");
                  setStartTime("");
                  setSelectedWorkers(workers.slice(0, 3));
                }}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors font-medium"
              >
                Create Another Shift
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create New Shift
          </h2>
          <p className="text-gray-600">
            Schedule a new work shift by assigning a supervisor and workers
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="supervisor"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Supervisor <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserTie className="text-gray-400" />
                </div>
                <select
                  id="supervisor"
                  value={selectedSupervisor}
                  onChange={(e) => setSelectedSupervisor(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                  required
                >
                  <option value="">Select a supervisor</option>
                  {supervisors.map((supervisor) => (
                    <option key={supervisor.id} value={supervisor.id}>
                      {supervisor.firstName} {supervisor.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="startTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Shift Start Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Workers <span className="text-red-500">*</span>
              </label>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center mb-3">
                  <FaHardHat className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Selected workers (3)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {workers.slice(0, 3).map((worker) => (
                    <div
                      key={worker.id}
                      className="bg-white p-3 rounded border border-gray-200 shadow-sm"
                    >
                      <div className="font-medium">
                        {worker.firstName} {worker.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        Worker ID: {worker.id}
                      </div>
                    </div>
                  ))}
                </div>
                {workers.length < 3 && (
                  <div className="mt-3 text-amber-600 text-sm">
                    Warning: Not enough workers available. Only {workers.length}{" "}
                    worker(s) selected.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Creating Shift..." : "Create Shift"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateShift;
