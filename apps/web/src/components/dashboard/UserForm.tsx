import React, { useState } from "react";
import { AUTH_API_URL } from "@/utils/constants";

interface UserFormProps {
  userType: "supervisor" | "worker";
  onSubmit: (formData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
  }) => void;
}

const UserForm: React.FC<UserFormProps> = ({ userType, onSubmit }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const capitalizedUserType =
    userType.charAt(0).toUpperCase() + userType.slice(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = {
        firstName,
        lastName,
        phoneNumber,
        role: userType,
      };

      const response = await fetch(`${AUTH_API_URL}/auth/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user");
      }

      await onSubmit(formData);

      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md border border-neutral-100 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Create New {capitalizedUserType}
      </h2>

      {success && (
        <div className="mb-6 p-4 rounded-md bg-green-50 text-green-700 border border-green-200">
          {capitalizedUserType} created successfully!
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Enter first name"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Enter last name"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Enter phone number"
            required
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-700 text-white px-6 py-3 rounded-md text-base font-medium transition-colors disabled:bg-cyan-300"
          >
            {loading ? "Creating..." : `Create ${capitalizedUserType}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
