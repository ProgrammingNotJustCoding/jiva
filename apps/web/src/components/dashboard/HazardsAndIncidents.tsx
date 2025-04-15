/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { FaExclamationTriangle, FaPlus, FaInfo, FaTools } from "react-icons/fa";
import WorkplanModal from "./WorkplanModal";
import { INCIDENT_API_URL } from "@/utils/constants";

type Props = {
  shiftId: string;
};

type Incident = {
  id: string;
  description: string;
  reportType: string;
  initialSeverity: string;
  status: string;
  locationDescription: string;
  rootCause: string | null;
  createdAt: string;
  reporttedByUserId: string;
};

const HazardsAndIncidents: React.FC<Props> = ({ shiftId }) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showWorkplanModal, setShowWorkplanModal] = useState(false);
  const [workerNames, setWorkerNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const getWorkerInfo = () => {
      try {
        const shiftData = localStorage.getItem("shift-workers");
        if (shiftData) {
          const workers = JSON.parse(shiftData);
          const namesMap: Record<string, string> = {};
          workers.forEach((worker: any) => {
            namesMap[worker.id] = `${worker.firstName} ${worker.lastName}`;
          });
          setWorkerNames(namesMap);
        }
      } catch (error) {
        console.error("Error parsing worker data from localStorage:", error);
      }
    };

    const fetchIncidents = async () => {
      if (!shiftId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${INCIDENT_API_URL}/incidents/${shiftId}`,
        );

        if (!response.ok) {
          throw new Error(`Error fetching incidents: ${response.status}`);
        }

        const result = await response.json();
        setIncidents(result.data || []);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    getWorkerInfo();
    fetchIncidents();
  }, [shiftId]);

  const getReporterName = (userId: string) => {
    return workerNames[userId] || `User #${userId}`;
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-blue-100 text-blue-800";
      case "acknowledged":
        return "bg-indigo-100 text-indigo-800";
      case "investigating":
        return "bg-purple-100 text-purple-800";
      case "pending_actions":
        return "bg-amber-100 text-amber-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleInitWorkplan = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowWorkplanModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Hazards & Incidents
        </h3>

        <button className="flex items-center justify-center px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
          <FaPlus className="mr-2" />
          <span>Report New</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : incidents.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-300">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <FaExclamationTriangle className="text-gray-400 text-2xl" />
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            No Hazards or Incidents
          </h4>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            No hazards or incidents have been reported for this shift. Use the
            &quot;Report New&quot; button to document any safety concerns or
            incidents.
          </p>
          <div className="flex justify-center">
            <button className="px-4 py-2 bg-white text-cyan-600 border border-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors mr-3">
              View Safety Procedures
            </button>
            <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
              Report New
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((incident: Incident) => (
            <div
              key={incident.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium mr-2 capitalize ${getSeverityClass(incident.initialSeverity)}`}
                    >
                      {incident.initialSeverity}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusClass(incident.status)}`}
                    >
                      {incident.status.replace("_", " ")}
                    </span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mt-2 capitalize">
                    {incident.reportType.replace("_", " ")}:{" "}
                    {incident.description.substring(0, 60)}
                    {incident.description.length > 60 ? "..." : ""}
                  </h4>
                  <p className="text-gray-500 text-sm mt-1">
                    Reported by{" "}
                    {getReporterName(
                      incident.reporttedByUserId,
                    )}{" "}
                    • {formatDate(incident.createdAt)}
                  </p>
                </div>
                <div className="flex">
                  <button
                    className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-full mr-2"
                    title="View Details"
                  >
                    <FaInfo />
                  </button>
                  <button
                    className="flex items-center px-3 py-1 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                    onClick={() => handleInitWorkplan(incident)}
                  >
                    <FaTools className="mr-1" />
                    <span className="text-sm">Initialize Workplan</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row text-sm text-gray-500 gap-2">
                <div>
                  <span className="font-medium">Location:</span>{" "}
                  {incident.locationDescription}
                </div>
                <div className="sm:ml-4">
                  <span className="font-medium">Root Cause:</span>{" "}
                  {incident.rootCause || "Under investigation"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showWorkplanModal && selectedIncident && (
        <WorkplanModal
          incident={selectedIncident}
          onClose={() => setShowWorkplanModal(false)}
        />
      )}
    </div>
  );
};

export default HazardsAndIncidents;
