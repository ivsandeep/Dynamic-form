// src/components/FormField.js
import React from "react";

const FormField = ({ field, value, onChange, error }) => {
  const { name, type, label, options } = field;

  return (
    <div>
      <label className="block font-medium mb-1">{label}:</label>
      {type === "dropdown" ? (
        <select
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
        >
          <option value="">Select</option>
          {options.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
