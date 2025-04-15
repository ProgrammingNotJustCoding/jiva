import React, { useState } from "react";
import { FaSearch, FaPhoneAlt, FaUserCircle } from "react-icons/fa";

interface Worker {
  id: number;
  name: string;
  phoneNumber: string;
  role: string;
  status: "active" | "break" | "offsite";
}

const ShiftWorkers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const workers: Worker[] = [
    {
      id: 1001,
      name: "Mike Johnson",
      phoneNumber: "555-123-4567",
      role: "Equipment Operator",
      status: "active",
    },
    {
      id: 1002,
      name: "Sarah Williams",
      phoneNumber: "555-234-5678",
      role: "Safety Inspector",
      status: "active",
    },
    {
      id: 1003,
      name: "David Brown",
      phoneNumber: "555-345-6789",
      role: "Maintenance Technician",
      status: "break",
    },
    {
      id: 1004,
      name: "Emma Davis",
      phoneNumber: "555-456-7890",
      role: "Equipment Operator",
      status: "active",
    },
    {
      id: 1005,
      name: "Robert Wilson",
      phoneNumber: "555-567-8901",
      role: "Electrician",
      status: "offsite",
    },
    {
      id: 1006,
      name: "Jennifer Taylor",
      phoneNumber: "555-678-9012",
      role: "Geologist",
      status: "active",
    },
    {
      id: 1007,
      name: "Michael Miller",
      phoneNumber: "555-789-0123",
      role: "Equipment Operator",
      status: "active",
    },
    {
      id: 1008,
      name: "Lisa Anderson",
      phoneNumber: "555-890-1234",
      role: "Supervisor Assistant",
      status: "break",
    },
  ];

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.id.toString().includes(searchTerm) ||
      worker.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Active
          </span>
        );
      case "break":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
            On Break
          </span>
        );
      case "offsite":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            Offsite
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">
          Shift Workers{" "}
          <span className="text-gray-500">({workers.length})</span>
        </h3>

        <div className="w-full md:w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search workers..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phone
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredWorkers.map((worker) => (
              <tr key={worker.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {worker.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <FaUserCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {worker.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {worker.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(worker.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <FaPhoneAlt className="mr-2 text-gray-400" />
                    {worker.phoneNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-cyan-600 hover:text-cyan-900 mr-3">
                    Contact
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredWorkers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No workers found matching your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShiftWorkers;
