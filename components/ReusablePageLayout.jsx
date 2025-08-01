// /components/ReusablePageLayout.jsx

import React from "react";

const ReusablePageLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-16 lg:px-32">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6 border-b pb-3">
          {title}
        </h1>
        <div className="text-gray-700 leading-relaxed space-y-4 text-sm md:text-base">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ReusablePageLayout;