import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaPlus,
  FaCog,
  FaHardHat,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaUsers,
  FaLeaf,
  FaTools,
  FaEllipsisH,
} from "react-icons/fa";
import { SHIFT_API_URL } from "@/utils/constants";

type LogType =
  | "operation"
  | "equipment"
  | "safety"
  | "instruction"
  | "personnel"
  | "environment"
  | "other";

interface LogWorker {
  firstName: string;
  lastName: string;
}

interface ShiftLog {
  id: number;
  shiftId: number;
  workerId: number;
  category: LogType;
  details: string;
  relatedEquipment?: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isDeleted: boolean;
  workerName: LogWorker;
  workerDesignation: string;
}

interface ShiftLogsProps {
  shiftId?: number;
}

const ShiftLogs: React.FC<ShiftLogsProps> = ({ shiftId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<LogType | "all">("all");
  const [logs, setLogs] = useState<ShiftLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!shiftId) return;

      try {
        setLoading(true);
        const response = await fetch(`${SHIFT_API_URL}/logs/${shiftId}`);

        if (!response.ok) {
          throw new Error(`Error fetching logs: ${response.status}`);
        }

        const responseData = await response.json();
        setLogs(responseData.data || []);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [shiftId]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.relatedEquipment &&
        log.relatedEquipment.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === "all" || log.category === filterType;

    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: LogType) => {
    switch (type) {
      case "operation":
        return <FaCog className="text-blue-500" />;
      case "equipment":
        return <FaTools className="text-amber-500" />;
      case "safety":
        return <FaHardHat className="text-red-500" />;
      case "instruction":
        return <FaClipboardCheck className="text-purple-500" />;
      case "personnel":
        return <FaUsers className="text-cyan-500" />;
      case "environment":
        return <FaLeaf className="text-green-500" />;
      case "other":
        return <FaEllipsisH className="text-gray-500" />;
      default:
        return <FaEllipsisH className="text-gray-500" />;
    }
  };

  const getTypeBadge = (type: LogType) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";

    switch (type) {
      case "operation":
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            Operation
          </span>
        );
      case "equipment":
        return (
          <span className={`${baseClasses} bg-amber-100 text-amber-800`}>
            Equipment
          </span>
        );
      case "safety":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            Safety
          </span>
        );
      case "instruction":
        return (
          <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
            Instruction
          </span>
        );
      case "personnel":
        return (
          <span className={`${baseClasses} bg-cyan-100 text-cyan-800`}>
            Personnel
          </span>
        );
      case "environment":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Environment
          </span>
        );
      case "other":
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            Other
          </span>
        );
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-3 text-gray-600">Loading shift logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <h3 className="text-xl font-medium text-red-700 mb-2">
            Error Loading Logs
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">
          Shift Logs <span className="text-gray-500">({logs.length})</span>
        </h3>

        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search logs..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as LogType | "all")}
          >
            <option value="all">All Types</option>
            <option value="operation">Operation</option>
            <option value="equipment">Equipment</option>
            <option value="safety">Safety</option>
            <option value="instruction">Instruction</option>
            <option value="personnel">Personnel</option>
            <option value="environment">Environment</option>
            <option value="other">Other</option>
          </select>

          <button className="flex items-center justify-center px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
            <FaPlus className="mr-2" />
            <span>Add Log</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <div key={log.id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-start">
                <div className="p-3 rounded-full bg-white shadow-sm mr-4">
                  {getTypeIcon(log.category)}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <div className="flex items-center mb-2 md:mb-0">
                      <div className="text-sm font-medium text-gray-900 mr-3">
                        {formatTimestamp(log.createdAt)}
                      </div>
                      {getTypeBadge(log.category)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Created by: {log.workerName.firstName}{" "}
                      {log.workerName.lastName}
                    </div>
                  </div>

                  <p className="text-gray-800 mb-2">{log.details}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 space-y-1 sm:space-y-0 sm:space-x-6">
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Location:</span>{" "}
                      {log.location}
                    </div>
                    {log.relatedEquipment && (
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Equipment:</span>{" "}
                        {log.relatedEquipment}
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-4">
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaEllipsisH />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaExclamationTriangle className="mx-auto text-gray-400 text-3xl mb-3" />
            <p className="text-gray-500">
              {searchTerm || filterType !== "all"
                ? "No logs found matching your search criteria."
                : "No logs have been recorded for this shift yet."}
            </p>
            {(searchTerm || filterType !== "all") && (
              <button
                className="mt-4 text-cyan-600 hover:text-cyan-800"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftLogs;
