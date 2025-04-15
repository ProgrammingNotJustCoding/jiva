import React, { useState } from "react";
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

type LogType =
  | "operation"
  | "equipment"
  | "safety"
  | "instruction"
  | "personnel"
  | "environment"
  | "other";

interface ShiftLog {
  id: number;
  timestamp: string;
  type: LogType;
  details: string;
  relatedEquipment?: string;
  location: string;
  createdBy: string;
}

const ShiftLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<LogType | "all">("all");

  const logs: ShiftLog[] = [
    {
      id: 5001,
      timestamp: "2023-10-15T07:15:00",
      type: "operation",
      details: "Started extraction in section B-7",
      relatedEquipment: "Continuous Miner CM-103",
      location: "Section B-7",
      createdBy: "John Smith",
    },
    {
      id: 5002,
      timestamp: "2023-10-15T08:30:00",
      type: "safety",
      details: "Completed pre-shift safety checks",
      location: "All sections",
      createdBy: "Sarah Williams",
    },
    {
      id: 5003,
      timestamp: "2023-10-15T09:45:00",
      type: "equipment",
      details: "Maintenance check on conveyor system",
      relatedEquipment: "Conveyor Belt CB-207",
      location: "Transport Tunnel 3",
      createdBy: "David Brown",
    },
    {
      id: 5004,
      timestamp: "2023-10-15T10:15:00",
      type: "instruction",
      details: "Team briefing on new ventilation procedures",
      location: "Briefing Room",
      createdBy: "John Smith",
    },
    {
      id: 5005,
      timestamp: "2023-10-15T11:30:00",
      type: "personnel",
      details: "Team rotation for lunch break initiated",
      location: "All sections",
      createdBy: "John Smith",
    },
    {
      id: 5006,
      timestamp: "2023-10-15T12:45:00",
      type: "environment",
      details: "Methane levels checked and within normal parameters",
      location: "Sections B-5 through B-9",
      createdBy: "Emma Davis",
    },
    {
      id: 5007,
      timestamp: "2023-10-15T13:20:00",
      type: "equipment",
      details: "Minor repair to hydraulic system",
      relatedEquipment: "Roof Bolter RB-42",
      location: "Section B-8",
      createdBy: "Robert Wilson",
    },
    {
      id: 5008,
      timestamp: "2023-10-15T14:10:00",
      type: "operation",
      details: "Completed planned extraction target for section B-7",
      relatedEquipment: "Continuous Miner CM-103",
      location: "Section B-7",
      createdBy: "Michael Miller",
    },
    {
      id: 5009,
      timestamp: "2023-10-15T15:30:00",
      type: "other",
      details: "External inspector arrival, escorted to office",
      location: "Mine Entrance",
      createdBy: "Jennifer Taylor",
    },
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.relatedEquipment &&
        log.relatedEquipment.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === "all" || log.type === filterType;

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
        {filteredLogs.map((log) => (
          <div key={log.id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-white shadow-sm mr-4">
                {getTypeIcon(log.type)}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <div className="flex items-center mb-2 md:mb-0">
                    <div className="text-sm font-medium text-gray-900 mr-3">
                      {formatTimestamp(log.timestamp)}
                    </div>
                    {getTypeBadge(log.type)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Created by: {log.createdBy}
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
        ))}

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaExclamationTriangle className="mx-auto text-gray-400 text-3xl mb-3" />
            <p className="text-gray-500">
              No logs found matching your search criteria.
            </p>
            <button
              className="mt-4 text-cyan-600 hover:text-cyan-800"
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftLogs;
