import React, { useState, useEffect } from "react";

const EmployeeEdit = ({ employeeNo, onClose }) => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8599/v1/wellbeing360/employees/employee?employee_no=${employeeNo}`
        );
        const result = await response.json();

        if (response.ok && result?.employee) {
          setEmployeeData(result.employee);
        } else {
          throw new Error("Employee data not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch employee data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeNo]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? parseInt(value)
          : name === "active_status"
          ? value === "true"
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8599/v1/wellbeing360/employees/employee?employee_no=${employeeNo}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeData),
        }
      );

      if (response.ok) {
        setPopupMessage("Employee updated successfully!");
        setPopupType("success");
      } else {
        setPopupMessage("Failed to update employee.");
        setPopupType("error");
      }
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        if (popupType === "success") onClose();
      }, 2500);
    } catch (err) {
      console.error(err);
      setPopupMessage("Error updating employee.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-md w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="text-red-500 text-center">
            {error}
            <button
              onClick={() => window.location.reload()}
              className="ml-2 bg-gray-500 text-white px-3 py-1 rounded"
            >
              Retry
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Fields */}
            {[
              "name",
              "nic",
              "date_of_birth",
              "contact_number",
              "weight",
              "height",
              "address",
              "employee_type",
              "department",
              "designation",
              "work_location",
            ].map((field) => (
              <div key={field}>
                <label className="text-sm text-gray-700 capitalize">
                  {field.replace(/_/g, " ")}
                </label>
                <input
                  type={
                    ["date_of_birth"].includes(field)
                      ? "date"
                      : field === "weight" || field === "height"
                      ? "number"
                      : "text"
                  }
                  name={field}
                  value={employeeData[field] || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            ))}

            {/* Active Status */}
            <div>
              <label className="text-sm text-gray-700">Active Status</label>
              <select
                name="active_status"
                value={employeeData.active_status ? "true" : "false"}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="col-span-full flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </form>
        )}

        {/* Popup */}
        {showPopup && (
          <div
            className="fixed top-6 right-6 z-50 bg-white border-l-4 px-4 py-3 rounded shadow-lg w-80
            flex items-start gap-3 animate-fadeIn border-green-500"
          >
            <span
              className={`text-lg font-semibold ${
                popupType === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {popupType === "success" ? "Success" : "Error"}
            </span>
            <p className="text-sm text-gray-700 flex-1">{popupMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeEdit;
