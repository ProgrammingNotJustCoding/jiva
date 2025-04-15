"use client";
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { FaFileAlt, FaCloudUploadAlt, FaDownload, FaEye } from "react-icons/fa";

const mockDocuments = [
  {
    id: 101,
    title: "Emergency Response Protocol",
    version: "2.2",
    isActive: true,
    date: "2022-12-05",
    size: "2.3MB",
  },
  {
    id: 102,
    title: "Mine Ventilation Standards",
    version: "1.6",
    isActive: false,
    date: "2022-11-15",
    size: "3.0MB",
  },
  {
    id: 103,
    title: "Hazardous Materials Handling",
    version: "2.9",
    isActive: false,
    date: "2022-10-08",
    size: "1.7MB",
  },
];

type Tab = "current" | "archived" | "submit";

const SMPDocumentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("current");
  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentDocuments = mockDocuments.filter((doc) => doc.isActive);
  const archivedDocuments = mockDocuments.filter((doc) => !doc.isActive);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("version", version);
      if (file) formData.append("document", file);

      console.log("Submitting SMP document:", {
        title,
        version,
        fileName: file?.name,
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setTitle("");
      setVersion("");
      setFile(null);
      setSuccess(true);
    } catch (err) {
      setError("Failed to upload document. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Safety Management Plan Documents
          </h2>
        </div>

        <div className="mb-8 border-b border-neutral-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("current")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "current"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              Current Documents
            </button>
            <button
              onClick={() => setActiveTab("archived")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "archived"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              Archived Documents
            </button>
            <button
              onClick={() => setActiveTab("submit")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "submit"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              Submit New Document
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-neutral-100 p-6">
          {activeTab === "current" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Current SMP Documents
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50 rounded-tl-md">
                        Document Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50">
                        Version
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50">
                        Size
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50 rounded-tr-md">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-100">
                    {currentDocuments.map((doc) => (
                      <tr
                        key={doc.id}
                        className="hover:bg-neutral-50 transition-colors bg-cyan-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaFileAlt className="text-cyan-500 mr-3" />
                            <span className="font-medium text-neutral-700">
                              {doc.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                          {doc.version}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                          {doc.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                          {doc.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-3">
                            <button
                              className="text-cyan-600 hover:text-cyan-800"
                              title="View document"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="text-cyan-600 hover:text-cyan-800"
                              title="Download document"
                            >
                              <FaDownload />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "archived" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Archived SMP Documents
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50 rounded-tl-md">
                        Document Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50">
                        Version
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50">
                        Size
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider bg-neutral-50 rounded-tr-md">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-100">
                    {archivedDocuments.map((doc) => (
                      <tr
                        key={doc.id}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaFileAlt className="text-neutral-400 mr-3" />
                            <span className="font-medium text-neutral-700">
                              {doc.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                          {doc.version}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                          {doc.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                          {doc.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-3">
                            <button
                              className="text-cyan-600 hover:text-cyan-800"
                              title="View document"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="text-cyan-600 hover:text-cyan-800"
                              title="Download document"
                            >
                              <FaDownload />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "submit" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Submit New SMP Document
              </h3>

              {success && (
                <div className="mb-6 p-4 rounded-md bg-green-50 text-green-700 border border-green-200">
                  Document uploaded successfully!
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="max-w-3xl">
                <div className="mb-6">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Document Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter document title"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="version"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Version Number
                  </label>
                  <input
                    type="text"
                    id="version"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="e.g., 1.0"
                    required
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md hover:border-cyan-500 transition-colors">
                    <div className="space-y-1 text-center">
                      <div className="flex flex-col items-center">
                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-neutral-400" />
                        <div className="flex text-sm text-neutral-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-cyan-600 hover:text-cyan-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setFile(e.target.files[0]);
                                }
                              }}
                              required
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-neutral-500">
                          PDF, Word, or Excel up to 10MB
                        </p>
                      </div>
                      {file && (
                        <div className="mt-3 text-center sm:mt-5">
                          <div className="text-sm font-medium text-neutral-900">
                            Selected file: {file.name}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-cyan-500 hover:bg-cyan-700 text-white px-6 py-3 rounded-md text-base font-medium transition-colors disabled:bg-cyan-300"
                  >
                    {loading ? "Uploading..." : "Upload Document"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SMPDocumentsPage;
