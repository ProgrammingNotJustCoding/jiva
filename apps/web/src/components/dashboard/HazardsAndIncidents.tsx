import React, { useState, useEffect } from "react";
import { FaExclamationTriangle, FaPlus, FaInfo, FaTools } from "react-icons/fa";
import WorkplanModal from "./WorkplanModal";

const HazardsAndIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showWorkplanModal, setShowWorkplanModal] = useState(false);

  useEffect(() => {
    // Simulating fetch from backend
    const fetchIncidents = async () => {
      try {
        // Mocked data for demonstration
        const mockIncidents = [
          {
            id: "1",
            reportType: "hazard",
            reportedByUserId: "user123",
            reportedByName: "John Doe",
            locationDescription: "Main tunnel, section B-4",
            gpsLatitude: "37.7749",
            gpsLongitude: "-122.4194",
            description: "Loose rocks observed on the ceiling of the tunnel",
            initialSeverity: "medium",
            status: "reported",
            rootCause: "Natural erosion over time",
            createdAt: "2025-04-12T10:30:00Z",
          },
          {
            id: "2",
            reportType: "near_miss",
            reportedByUserId: "user456",
            reportedByName: "Jane Smith",
            locationDescription: "Conveyor belt area, near exit point",
            gpsLatitude: "37.7750",
            gpsLongitude: "-122.4195",
            description: "Worker almost got caught in moving machinery",
            initialSeverity: "high",
            status: "investigating",
            rootCause: "Inadequate safety barriers",
            createdAt: "2025-04-13T08:15:00Z",
          },
          {
            id: "3",
            reportType: "environmental",
            reportedByUserId: "user789",
            reportedByName: "Robert Johnson",
            locationDescription: "East side drainage area",
            gpsLatitude: "37.7751",
            gpsLongitude: "-122.4196",
            description: "Unusual discoloration in water runoff",
            initialSeverity: "critical",
            status: "acknowledged",
            rootCause: "Under investigation",
            createdAt: "2025-04-13T14:45:00Z",
          },
        ];

        setIncidents(mockIncidents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching incidents:", error);
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const getSeverityClass = (severity) => {
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

  const getStatusClass = (status) => {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleInitWorkplan = (incident) => {
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
          {incidents.map((incident) => (
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
                    Reported by {incident.reportedByName} •{" "}
                    {formatDate(incident.createdAt)}
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

      {showWorkplanModal && (
        <WorkplanModal
          incident={selectedIncident}
          onClose={() => setShowWorkplanModal(false)}
        />
      )}
    </div>
  );
};

export default HazardsAndIncidents;
