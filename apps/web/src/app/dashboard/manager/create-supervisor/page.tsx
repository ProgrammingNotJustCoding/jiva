"use client";
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import UserForm from "@/components/dashboard/UserForm";

const CreateSupervisorPage: React.FC = () => {
  const handleSubmit = async (formData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
  }) => {
    console.log("Creating supervisor:", formData);

    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Create Supervisor
        </h2>
        <p className="text-neutral-600 mb-8">
          Add a new supervisor to the system. Supervisors can manage workers,
          approve reports, and oversee safety operations.
        </p>

        <UserForm userType="supervisor" onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
};

export default CreateSupervisorPage;
