"use client";

import { INCIDENT_API_URL, SHIFT_API_URL } from "@/utils/constants";
import React, { useState } from "react";
import {
  FaExchangeAlt,
  FaFileAlt,
  FaCheckCircle,
  FaTimes,
  FaUsers,
  FaDownload,
} from "react-icons/fa";

interface ShiftInfo {
  id: string;
  supervisor: string;
  nextSupervisor: string;
  location: string;
  start: string;
  end: string;
}

interface Task {
  id: number;
  description: string;
  status: string;
}

interface ShiftHandoverButtonProps {
  shiftInfo: ShiftInfo;
}

const ShiftHandoverButton: React.FC<ShiftHandoverButtonProps> = ({
  shiftInfo,
}) => {
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [unfinishedTasks, setUnfinishedTasks] = useState<Task[]>([
    {
      id: 1,
      description: "Equipment inspection for drilling machinery",
      status: "in_progress",
    },
    {
      id: 2,
      description: "Safety check for Section C perimeter",
      status: "in_progress",
    },
    {
      id: 3,
      description: "Ventilation system maintenance",
      status: "in_progress",
    },
  ]);
  const [handoverStep, setHandoverStep] = useState("review");
  const [reportGenerated, setReportGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleMarkTaskUnfinished = async (taskId: number) => {
    setIsLoading(true);
    try {
      setUnfinishedTasks(
        unfinishedTasks.map((task) =>
          task.id === taskId ? { ...task, status: "unfinished" } : task,
        ),
      );

      console.log(`Marked task ${taskId} as unfinished`);
    } catch (error) {
      console.error("Error marking task as unfinished:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const shiftId = localStorage.getItem("shiftId");

      if (!shiftId) {
        throw new Error("Shift ID not found in localStorage");
      }

      const response = await fetch(`${INCIDENT_API_URL}/reports/${shiftId}`, {
        method: "GET",
        headers: {
          Accept: "application/pdf",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate report");
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      setReportUrl(url);
      setReportGenerated(true);
      setHandoverStep("report");
    } catch (error) {
      console.error("Error generating shift report:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate report",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeHandover = async () => {
    setIsLoading(true);
    try {
      const shiftId = localStorage.getItem("shiftId");

      if (!shiftId) {
        throw new Error("Shift ID not found in localStorage");
      }

      const response = await fetch(`${SHIFT_API_URL}/shifts/${shiftId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "handed_over" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to finalize handover");
      }

      setHandoverStep("finalize");
      setTimeout(() => {
        setShowHandoverModal(false);
        if (reportUrl) {
          URL.revokeObjectURL(reportUrl);
        }
      }, 2000);
    } catch (error) {
      console.error("Error finalizing handover:", error);
      setError(
        error instanceof Error ? error.message : "Failed to finalize handover",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (reportUrl) {
      const link = document.createElement("a");
      link.href = reportUrl;
      link.download = `shift-report-${shiftInfo.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowHandoverModal(true)}
        className="px-4 py-2 bg-cyan-600 text-white font-medium rounded-md hover:bg-cyan-700 transition-colors flex items-center"
      >
        <FaExchangeAlt className="mr-2" />
        Shift Handover
      </button>

      {showHandoverModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto relative">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  Shift Handover
                </h3>
                <button
                  onClick={() => setShowHandoverModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                  disabled={isLoading}
                >
                  <FaTimes size={18} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {handoverStep === "review" && (
                <>
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Next Supervisor
                    </h4>
                    <div className="flex items-center bg-gray-50 p-3 rounded-md">
                      <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 mr-3">
                        <FaUsers />
                      </div>
                      <div>
                        <span className="font-medium">
                          {shiftInfo.nextSupervisor}
                        </span>
                        <p className="text-sm text-gray-500">
                          Incoming shift supervisor
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Tasks in Progress
                    </h4>
                    <div className="space-y-3">
                      {unfinishedTasks.map((task) => (
                        <div
                          key={task.id}
                          className="border border-gray-200 p-3 rounded-md"
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-sm">{task.description}</p>
                            {task.status === "in_progress" ? (
                              <button
                                onClick={() =>
                                  handleMarkTaskUnfinished(task.id)
                                }
                                className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded border border-amber-200 hover:bg-amber-100"
                                disabled={isLoading}
                              >
                                Mark Unfinished
                              </button>
                            ) : (
                              <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded border border-red-200">
                                Unfinished
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={handleGenerateReport}
                      className="px-4 py-2 bg-cyan-600 text-white font-medium rounded-md hover:bg-cyan-700 transition-colors flex items-center"
                      disabled={isLoading}
                    >
                      {isLoading ? "Generating..." : "Generate Shift Report"}
                      {!isLoading && <FaFileAlt className="ml-2" />}
                    </button>
                  </div>
                </>
              )}

              {handoverStep === "report" && (
                <>
                  <div className="mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start mb-4">
                      <FaCheckCircle className="text-green-500 mr-3 mt-1" />
                      <div>
                        <h4 className="font-medium text-green-700">
                          Shift Report Generated
                        </h4>
                        <p className="text-sm text-green-600">
                          Report has been created for this shift.
                        </p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-md p-4">
                      <h4 className="font-medium text-gray-700 mb-3">
                        Shift Summary
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Shift ID:</span>
                          <span className="font-medium">{shiftInfo.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Supervisor:</span>
                          <span className="font-medium">
                            {shiftInfo.supervisor}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Location:</span>
                          <span className="font-medium">
                            {shiftInfo.location}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Start Time:</span>
                          <span className="font-medium">
                            {formatTime(shiftInfo.start)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">End Time:</span>
                          <span className="font-medium">
                            {formatTime(shiftInfo.end)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            Unfinished Tasks:
                          </span>
                          <span className="font-medium">
                            {
                              unfinishedTasks.filter(
                                (t) => t.status === "unfinished",
                              ).length
                            }
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            Next Supervisor:
                          </span>
                          <span className="font-medium">
                            {shiftInfo.nextSupervisor}
                          </span>
                        </div>
                      </div>
                    </div>

                    {reportUrl && (
                      <div className="mt-4">
                        <button
                          onClick={handleDownloadReport}
                          className="w-full py-2 bg-cyan-50 text-cyan-700 border border-cyan-200 font-medium rounded-md hover:bg-cyan-100 transition-colors flex items-center justify-center"
                        >
                          <FaDownload className="mr-2" />
                          Download Report
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleFinalizeHandover}
                      className="px-4 py-2 bg-cyan-600 text-white font-medium rounded-md hover:bg-cyan-700 transition-colors flex items-center"
                      disabled={isLoading}
                    >
                      {isLoading ? "Finalizing..." : "Finalize Handover"}
                      {!isLoading && <FaCheckCircle className="ml-2" />}
                    </button>
                  </div>
                </>
              )}

              {handoverStep === "finalize" && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-green-500 text-3xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Handover Complete
                  </h3>
                  <p className="text-gray-600 mb-4">
                    The shift has been successfully handed over to{" "}
                    {shiftInfo.nextSupervisor}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShiftHandoverButton;
