import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
} from "react-icons/fa";
import { createPortal } from "react-dom";

type Incident = {
  id: string;
  reportType: string;
  description: string;
  initialSeverity: string;
  locationDescription: string;
};

type WorkplanModalProps = {
  incident: Incident;
  onClose: () => void;
};

const WorkplanModal: React.FC<WorkplanModalProps> = ({ incident, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [hazards, setHazards] = useState([]);
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [controlPlan, setControlPlan] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [assignedWorkers, setAssignedWorkers] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalRoot, setModalRoot] = useState<Element | null>(null);

  // Set up modal root for portal
  useEffect(() => {
    setModalRoot(document.body);
  }, []);

  const categories = [
    { id: "mining", label: "Mining Operations" },
    { id: "electricity", label: "Electrical Systems" },
    { id: "machinery", label: "Machinery & Equipment" },
    { id: "rr_siding", label: "Railroad Siding" },
  ];

  useEffect(() => {
    if (step === 2 && selectedCategory) {
      fetchHazards(selectedCategory, currentPage);
    }
  }, [selectedCategory, currentPage, step]);

  useEffect(() => {
    if (step === 3 && selectedHazard) {
      fetchControlPlan(selectedHazard.id);
      fetchWorkers();
    }
  }, [selectedHazard, step]);

  // Add body class to prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const fetchHazards = async (category, page) => {
    setLoading(true);
    try {
      // Mock response
      const mockHazards = [
        {
          id: 1,
          smpDocumentId: 1,
          category: "mining",
          description: "Use of mobile during blasting operation",
          riskCons: "4",
          riskExposure: "5",
          riskProb: "6",
          riskRating: "60",
          createdAt: "2025-04-13T15:06:06.870Z",
          updatedAt: "2025-04-13T15:14:14.776Z",
          deletedAt: null,
          isDeleted: true,
        },
        {
          id: 2,
          smpDocumentId: 2,
          category: "mining",
          description: "Working in unsupported roof conditions",
          riskCons: "5",
          riskExposure: "4",
          riskProb: "3",
          riskRating: "40",
          createdAt: "2025-04-13T15:06:06.870Z",
          updatedAt: "2025-04-13T15:14:14.776Z",
          deletedAt: null,
          isDeleted: false,
        },
        {
          id: 3,
          smpDocumentId: 3,
          category: "electricity",
          description: "Working on live electrical equipment",
          riskCons: "6",
          riskExposure: "3",
          riskProb: "4",
          riskRating: "48",
          createdAt: "2025-04-13T15:06:06.870Z",
          updatedAt: "2025-04-13T15:14:14.776Z",
          deletedAt: null,
          isDeleted: false,
        },
      ].filter((h) => h.category === category);

      setHazards(mockHazards);
      setTotalPages(Math.ceil(mockHazards.length / 10));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching hazards:", error);
      setLoading(false);
    }
  };

  const fetchControlPlan = async (hazardId) => {
    setLoading(true);
    try {
      // Mock response based on hazardId
      const mockControlPlan = {
        controlPlan: {
          id: 1,
          hazardId: hazardId,
          erci: "medium",
          personRes: "Colliery Manager, Blasting Officer, Blasting Overman",
          steps: [
            {
              id: 1,
              controlPlanId: 1,
              description: "Mobile phone shall not be used during operations.",
            },
            {
              id: 2,
              controlPlanId: 1,
              description: "Implement regular inspections of all equipment.",
            },
            {
              id: 3,
              controlPlanId: 1,
              description: "Maintain safe distance from blasting zones.",
            },
          ],
        },
      };

      setControlPlan(mockControlPlan.controlPlan);

      // Initialize assigned workers object with empty arrays for each step
      const initialAssignments = {};
      mockControlPlan.controlPlan.steps.forEach((step) => {
        initialAssignments[step.id] = [];
      });
      setAssignedWorkers(initialAssignments);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching control plan:", error);
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      // Mock response
      const mockShiftData = {
        id: 8,
        supervisorId: 1,
        nextSupervisorId: 5,
        startTime: "2025-04-13T20:13:28.187Z",
        endTime: null,
        status: "to_begin",
        finalizedAt: null,
        acknowledgedAt: null,
        workers: [
          {
            id: 15,
            supervisorId: 1,
            shiftId: 8,
            workerId: 2,
            workerName: "John Smith",
          },
          {
            id: 16,
            supervisorId: 1,
            shiftId: 8,
            workerId: 4,
            workerName: "Emily Johnson",
          },
          {
            id: 17,
            supervisorId: 1,
            shiftId: 8,
            workerId: 5,
            workerName: "Michael Brown",
          },
        ],
      };

      setWorkers(mockShiftData.workers);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setHazards([]);
    setStep(2);
  };

  const handleHazardSelect = (hazard) => {
    setSelectedHazard(hazard);
    setStep(3);
  };

  const handleWorkerAssignment = (stepId, workerId) => {
    const worker = workers.find((w) => w.workerId.toString() === workerId);

    if (!worker) return;

    setAssignedWorkers((prev) => ({
      ...prev,
      [stepId]: [
        {
          id: worker.workerId.toString(),
          name: worker.workerName,
        },
      ],
    }));
  };

  const handleSubmitWorkplan = async () => {
    // Check if all steps have workers assigned
    const allStepsAssigned = controlPlan.steps.every(
      (step) => assignedWorkers[step.id] && assignedWorkers[step.id].length > 0,
    );

    if (!allStepsAssigned) {
      alert("Please assign workers to all steps before submitting");
      return;
    }

    const formattedSteps = controlPlan.steps.map((step) => ({
      id: step.id.toString(),
      taskDescription: step.description,
      workers: assignedWorkers[step.id],
    }));

    const payload = {
      incidentId: incident.id,
      hazardId: selectedHazard.id.toString(),
      steps: formattedSteps,
    };

    try {
      console.log("Submitting workplan:", payload);
      // Simulate success
      alert("Workplan submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting workplan:", error);
      alert("Failed to submit workplan. Please try again.");
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select Hazard Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`p-4 rounded-lg border ${
                    selectedCategory === category.id
                      ? "border-cyan-500 bg-cyan-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } transition-colors text-left`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <div className="font-medium text-gray-800">
                    {category.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    Select for related hazards
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Select Hazard
              </h3>
              <button
                className="flex items-center text-cyan-600 hover:text-cyan-700"
                onClick={() => setStep(1)}
              >
                <FaChevronLeft className="mr-1" /> Back to Categories
              </button>
            </div>

            <div className="relative mb-4">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search hazards..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
              </div>
            ) : hazards.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {hazards.map((hazard) => (
                  <div
                    key={hazard.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedHazard?.id === hazard.id
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleHazardSelect(hazard)}
                  >
                    <div className="font-medium text-gray-800">
                      {hazard.description}
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">
                        Risk Rating: {hazard.riskRating}
                      </span>
                      <span
                        className={`text-sm px-2 py-0.5 rounded-full ${
                          parseInt(hazard.riskRating) > 50
                            ? "bg-red-100 text-red-800"
                            : parseInt(hazard.riskRating) > 30
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {parseInt(hazard.riskRating) > 50
                          ? "High"
                          : parseInt(hazard.riskRating) > 30
                            ? "Medium"
                            : "Low"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <FaExclamationTriangle className="mx-auto text-gray-400 text-xl mb-2" />
                <p className="text-gray-500">
                  No hazards found for this category.
                </p>
              </div>
            )}

            {hazards.length > 0 && (
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  <FaChevronLeft className="inline mr-1" /> Previous
                </button>

                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next <FaChevronRight className="inline ml-1" />
                </button>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Assign Control Steps
              </h3>
              <button
                className="flex items-center text-cyan-600 hover:text-cyan-700"
                onClick={() => setStep(2)}
              >
                <FaChevronLeft className="mr-1" /> Back to Hazards
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
              </div>
            ) : controlPlan ? (
              <div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h4 className="font-medium text-gray-700">
                        Selected Hazard:
                      </h4>
                      <p className="text-gray-900">
                        {selectedHazard.description}
                      </p>
                    </div>
                    <div className="mt-3 md:mt-0">
                      <h4 className="font-medium text-gray-700">
                        Risk Control Index:
                      </h4>
                      <p className="capitalize text-gray-900">
                        {controlPlan.erci}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-medium text-gray-700">
                      Person Responsible:
                    </h4>
                    <p className="text-gray-900">{controlPlan.personRes}</p>
                  </div>
                </div>

                <h4 className="font-medium text-gray-800 mb-2">
                  Control Steps:
                </h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {controlPlan.steps.map((step) => (
                    <div
                      key={step.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="w-full md:w-2/3">
                          <p className="font-medium text-gray-800">
                            {step.description}
                          </p>
                        </div>
                        <div className="w-full md:w-1/3 mt-3 md:mt-0">
                          <label
                            htmlFor={`worker-${step.id}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Assign to Worker:
                          </label>
                          <select
                            id={`worker-${step.id}`}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-cyan-500 focus:border-cyan-500"
                            value={assignedWorkers[step.id]?.[0]?.id || ""}
                            onChange={(e) =>
                              handleWorkerAssignment(step.id, e.target.value)
                            }
                          >
                            <option value="">Select a worker</option>
                            {workers.map((worker) => (
                              <option
                                key={worker.workerId}
                                value={worker.workerId.toString()}
                              >
                                {worker.workerName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <FaExclamationTriangle className="mx-auto text-gray-400 text-xl mb-2" />
                <p className="text-gray-500">
                  Failed to load control plan. Please try again.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl">
          <div className="flex justify-between items-center border-b border-gray-200 p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Initialize Workplan for Incident
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6">
            {/* Incident Information */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase">
                Incident Details
              </h3>
              <div className="mt-2">
                <p className="text-gray-900 font-medium">
                  {incident.reportType.replace("_", " ")} -{" "}
                  {incident.description}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  <span className="capitalize">
                    {incident.initialSeverity} severity
                  </span>{" "}
                  • {incident.locationDescription}
                </p>
              </div>
            </div>

            {renderStepContent()}
          </div>

          <div className="flex justify-end border-t border-gray-200 p-4">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors mr-3"
              onClick={onClose}
            >
              Cancel
            </button>

            {step === 3 && (
              <button
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                onClick={handleSubmitWorkplan}
              >
                Initialize Workplan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return modalRoot ? createPortal(modalContent, modalRoot) : null;
};

export default WorkplanModal;
