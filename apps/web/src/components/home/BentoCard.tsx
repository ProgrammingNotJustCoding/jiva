import React from "react";

type BentoCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
};

const BentoCard: React.FC<BentoCardProps> = ({
  title,
  description,
  icon,
  className = "",
}) => {
  return (
    <div
      className={`bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${className}`}
    >
      {icon && <div className="mb-4 text-cyan-500">{icon}</div>}
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default BentoCard;
