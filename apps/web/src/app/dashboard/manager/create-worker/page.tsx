"use client";
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import UserForm from "@/components/dashboard/UserForm";

const CreateWorkerPage: React.FC = () => {
  const handleSubmit = async (formData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
  }) => {
    console.log("Creating worker:", formData);

    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Worker</h2>
        <p className="text-neutral-600 mb-8">
          Add a new worker to the system. Workers can submit hazard reports and
          access safety documents.
        </p>

        <UserForm userType="worker" onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
};

export default CreateWorkerPage;
