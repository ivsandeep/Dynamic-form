// src/components/ProgressBar.js
import React from "react";

const ProgressBar = ({ progress }) => (
  <div className="mt-4 w-full bg-gray-200 rounded">
    <div
      className="bg-green-500 text-xs font-medium text-white text-center p-0.5 leading-none rounded"
      style={{ width: `${progress}%` }}
    >
      {Math.round(progress)}%
    </div>
  </div>
);

export default ProgressBar;
