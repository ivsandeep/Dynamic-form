import React, { useState } from "react";
import { mockApi } from "../api/mockApi";

const DynamicForm = () => {
  const [formType, setFormType] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState({});
  const [errors, setErrors] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [feedbackType, setFeedbackType] = useState("success");
  const [editingIndex, setEditingIndex] = useState(null);

  // Calculate form progress
  const calculateProgress = () => {
    const requiredFields = formFields.filter((field) => field.required);
    const completedFields = requiredFields.filter(
      (field) => formData[field.name] && formData[field.name].trim() !== ""
    );
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  // Fetch form structure
  const handleFormTypeChange = async (e) => {
    const selectedType = e.target.value;
    setFormType(selectedType);
    setFormData({});
    setErrors({});
    setFeedbackMessage(null);

    if (selectedType) {
      try {
        const response = await mockApi(selectedType);
        setFormFields(response.fields);
      } catch (error) {
        setFeedbackMessage("Failed to load form structure.");
        setFeedbackType("error");
      }
    } else {
      setFormFields([]);
    }
  };

  // Handle input change
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field when user starts typing
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    formFields.forEach((field) => {
      const value = formData[field.name];
      if (field.required && (!value || value.trim() === "")) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (field.type === "number" && value && isNaN(Number(value))) {
        newErrors[field.name] = `${field.label} must be a valid number`;
      }
      if (field.type === "date" && value) {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          newErrors[field.name] = `${field.label} must be a valid date`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedData = { ...submittedData };
      const formDataCopy = { ...formData };

      // Save form data separately for each form type
      if (updatedData[formType]) {
        updatedData[formType].push(formDataCopy);
      } else {
        updatedData[formType] = [formDataCopy];
      }

      setSubmittedData(updatedData);
      setFeedbackMessage(editingIndex !== null ? "Changes saved successfully!" : "Form submitted successfully!");
      setFeedbackType("success");
      setFormData({});
      setEditingIndex(null);
    } else {
      setFeedbackMessage("Please fix the errors and try again.");
      setFeedbackType("error");
    }

    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Handle edit
  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(submittedData[formType][index]);
  };

  // Handle delete
  const handleDelete = (index) => {
    const updatedData = { ...submittedData };
    updatedData[formType].splice(index, 1);
    setSubmittedData(updatedData);
    setFeedbackMessage("Entry deleted successfully!");
    setFeedbackType("success");
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-screen-md bg-white shadow-md rounded-md p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Dynamic Form</h2>

        {/* Feedback Message */}
        {feedbackMessage && (
          <div
            className={`mb-4 p-3 rounded ${feedbackType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {feedbackMessage}
          </div>
        )}

        {/* Progress Bar */}
        {formFields.length > 0 && (
          <div className="mb-4">
            <div className="relative h-4 bg-gray-300 rounded">
              <div
                className="absolute top-0 left-0 h-4 bg-green-500 rounded"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Progress: {calculateProgress()}%
            </p>
          </div>
        )}

        {/* Dropdown for form type */}
        <select
          value={formType}
          onChange={handleFormTypeChange}
          className="border border-gray-300 p-2 rounded mb-4 w-full"
        >
          <option value="">Select Form Type</option>
          <option value="userInfo">User Information</option>
          <option value="addressInfo">Address Information</option>
          <option value="paymentInfo">Payment Information</option>
        </select>

        {/* Dynamic form fields */}
        {formFields.length > 0 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map((field) => (
              <div key={field.name}>
                <label className="block font-medium mb-1">{field.label}:</label>
                {field.type === "dropdown" ? (
                  <select
                    value={formData[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full"
                  >
                    <option value="">Select</option>
                    {field.options.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                )}
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {editingIndex !== null ? "Save Changes" : "Submit"}
            </button>
          </form>
        )}
      </div>

      {/* Table for submitted data */}
      {Object.keys(submittedData).length > 0 && (
        <div className="w-full max-w-screen-md mt-6 bg-white shadow-md rounded-md p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Submitted Data</h2>
          {submittedData[formType] && submittedData[formType].length > 0 ? (
            <table className="table-auto w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr>
                  {formFields.map((field) => (
                    <th key={field.name} className="border border-gray-300 px-4 py-2">
                      {field.label}
                    </th>
                  ))}
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submittedData[formType].map((data, index) => (
                  <tr key={index}>
                    {formFields.map((field) => (
                      <td key={field.name} className="border border-gray-300 px-4 py-2">
                        {data[field.name]}
                      </td>
                    ))}
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="text-blue-500 hover:underline mr-2"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No data submitted yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
