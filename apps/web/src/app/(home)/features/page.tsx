"use client";

import React from "react";
import Image from "next/image";
import {
  FaShieldAlt,
  FaClipboardCheck,
  FaExchangeAlt,
  FaChartLine,
  FaUsersCog,
  FaMobileAlt,
  FaDatabase,
  FaRegCalendarCheck,
} from "react-icons/fa";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const FeaturesPage = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Mine Management Solution
            </h1>
            <p className="text-xl text-gray-600">
              Jiva offers a complete suite of tools designed specifically for
              coal mine operations, helping you maintain safety standards and
              improve operational efficiency.
            </p>
          </div>

          <div className="space-y-24">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 p-6">
                <div className="text-cyan-500 mb-4">
                  <FaShieldAlt size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Safety Management Plan (SMP)
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Create and maintain comprehensive safety management plans that
                  comply with DGMS requirements. Identify potential hazards,
                  evaluate risks, and implement control procedures
                  automatically.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 mt-1">
                      <FaClipboardCheck />
                    </span>
                    <span>
                      Systematic hazard identification and risk assessment tools
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 mt-1">
                      <FaClipboardCheck />
                    </span>
                    <span>
                      Automated documentation and reporting for compliance
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 mt-1">
                      <FaClipboardCheck />
                    </span>
                    <span>
                      Customizable templates for different operational areas
                    </span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 p-6">
                <div className="relative h-80 w-full overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src="/images/safety-management.jpg"
                    alt="Safety Management Plan"
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform hover:scale-105 duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 p-6">
                <div className="text-cyan-500 mb-4">
                  <FaExchangeAlt size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Shift Handover Management
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Streamline shift transitions with digital handover logs.
                  Ensure critical information is properly communicated between
                  supervisors and crews for continuous safe operations.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 mt-1">
                      <FaClipboardCheck />
                    </span>
                    <span>Digital shift logs with custom templates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 mt-1">
                      <FaClipboardCheck />
                    </span>
                    <span>Automated notifications for pending handovers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 mt-1">
                      <FaClipboardCheck />
                    </span>
                    <span>Historical record tracking for accountability</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 p-6">
                <div className="relative h-80 w-full overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src="/images/shift-handover.jpg"
                    alt="Shift Handover"
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform hover:scale-105 duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 p-6">
                <div className="text-cyan-500 mb-4">
                  <FaChartLine size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Performance Monitoring
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Track key performance indicators to optimize mine operations
                  and safety compliance. Generate comprehensive reports for
                  management review and continuous improvement.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 mt-1">
                      <FaClipboardCheck />
                    </span>
                    <span>Real-time safety performance dashboards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 mt-1">
                      <FaClipboardCheck />
                    </span>
                    <span>Trend analysis for hazard recurrence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 mt-1">
                      <FaClipboardCheck />
                    </span>
                    <span>Custom report generation for stakeholders</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 p-6">
                <div className="relative h-80 w-full overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src="/images/performance-monitoring.jpg"
                    alt="Performance Monitoring"
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform hover:scale-105 duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 p-6">
                <div className="text-cyan-500 mb-4">
                  <FaUsersCog size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Team Management & Training
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Manage crew assignments, track certifications, and monitor
                  training requirements. Ensure all personnel are properly
                  qualified for their roles and responsibilities.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 mt-1">
                      <FaClipboardCheck />
                    </span>
                    <span>Certification tracking and expiration alerts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 mt-1">
                      <FaClipboardCheck />
                    </span>
                    <span>Training management and compliance reporting</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-500 mr-2 mt-1">
                      <FaClipboardCheck />
                    </span>
                    <span>Skill matrix and competency assessment tools</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 p-6">
                <div className="relative h-80 w-full overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src="/images/team-management.jpg"
                    alt="Team Management"
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform hover:scale-105 duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="py-12 bg-gray-50 rounded-xl">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Technology Advantages
              </h2>
              <div className="grid md:grid-cols-3 gap-8 px-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-cyan-500 mb-4 flex justify-center">
                    <FaMobileAlt size={36} />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-3">
                    Mobile Accessibility
                  </h3>
                  <p className="text-gray-600 text-center">
                    Access Jiva from any device, anytime, anywhere – even in
                    areas with limited connectivity through our offline-capable
                    mobile app.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-cyan-500 mb-4 flex justify-center">
                    <FaDatabase size={36} />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-3">
                    Secure Data Storage
                  </h3>
                  <p className="text-gray-600 text-center">
                    All your critical operational data is securely stored with
                    regular backups and enterprise-grade encryption for total
                    peace of mind.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-cyan-500 mb-4 flex justify-center">
                    <FaRegCalendarCheck size={36} />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-3">
                    Scheduled Automation
                  </h3>
                  <p className="text-gray-600 text-center">
                    Set up automated workflows, notifications, and reports to
                    ensure nothing falls through the cracks in your safety
                    procedures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FeaturesPage;
