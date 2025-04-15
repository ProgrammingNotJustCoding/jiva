import React from "react";
import BentoCard from "./BentoCard";
import { BiBarChart, BiClipboard, BiShield } from "react-icons/bi";
import { FiAlertTriangle, FiBell } from "react-icons/fi";

const Bento: React.FC = () => {
  const features = [
    {
      title: "Effortless Shift Logging & Handovers",
      description:
        "Quickly record shift activities, production numbers, and equipment status. Ensure smooth, digital handovers to the next shift, reducing missed information.",
      icon: <BiClipboard size={24} />,
    },
    {
      title: "Trackable Safety Actions (SMP)",
      description:
        "Digitally manage your mine's Safety Management Plan as required by DGMS. Clearly see assigned safety tasks, track their progress, and ensure deadlines are met.",
      icon: <BiShield size={24} />,
    },
    {
      title: "Instant Hazard & Incident Reporting",
      description:
        "Report safety concerns, near misses, or incidents immediately from your phone or computer. Ensure safety issues are captured and addressed promptly.",
      icon: <FiAlertTriangle size={24} />,
    },
    {
      title: "Timely Notifications & Alerts",
      description:
        "Receive alerts for critical safety information, assigned tasks, or items needing your approval. Stay informed about what needs your attention.",
      icon: <FiBell size={24} />,
    },
    {
      title: "Clear Compliance & Progress Views",
      description:
        "Get easy-to-understand dashboards showing safety task completion and overall compliance status. Quickly see progress and identify potential delays.",
      icon: <BiBarChart size={24} />,
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Jiva Features
          </h2>
          <p className="text-xl text-gray-600">
            Our comprehensive solution helps ensure safety procedures are
            followed, communication is clear, and operations run smoothly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <BentoCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              className={index === 0 ? "md:col-span-2 lg:col-span-1" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Bento;
