import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-16 h-16 border-b-2 rounded-full animate-spin sm:h-24 sm:w-24 lg:h-32 lg:w-32 border-primary"></div>
    </div>
  );
};

export default LoadingSpinner;
