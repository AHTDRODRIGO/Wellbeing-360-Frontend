import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const EmpOnboard = () => {
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState({
    employee_no: "",
    name: "",
    nic: "",
    date_of_birth: "",
    contact_number: "",
    weight: "",
    height: "",
    address: "",
    employee_type: "",
    department: "",
    designation: "",
    work_location: "",
    active_status: true,
  });

  const [errors, setErrors] = useState({});
  const [showPopupMessage, setShowPopupMessage] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const formErrors = {};
    for (const key in employeeData) {
      if (!employeeData[key] && employeeData[key] !== false) {
        formErrors[key] = "Required";
      }
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(
        `http://localhost:8599/v1/wellbeing360/employees/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setPopupMessage("Employee added successfully!");
        setPopupType("success");
        setShowPopupMessage(true);
        setTimeout(() => {
          setShowPopupMessage(false);
          navigate("/emp-details");
        }, 2500);
      } else {
        throw new Error(result.message || "Failed to add employee");
      }
    } catch (err) {
      setPopupMessage(err.message || "Server error");
      setPopupType("error");
      setShowPopupMessage(true);
      setTimeout(() => setShowPopupMessage(false), 3000);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100 overflow-hidden">
      {/* Left Panel */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-400 flex flex-col items-center justify-center p-10 text-white">
        <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mb-4">
          <span className="text-blue-600 text-3xl">🚀</span>
        </div>
        <h2 className="text-2xl font-bold">Welcome to Wellbeing 360</h2>
        <p className="mt-2 text-sm text-center max-w-xs">
          A unified platform for health records, appointments, and more.
        </p>
      </div>

      {/* Right Panel */}
      <div className="bg-white p-4 md:p-12 overflow-y-auto max-h-screen">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Employee Onboarding
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 pb-10">
            {Object.entries(employeeData).map(([key, value]) => (
              <div key={key}>
                <label className="block text-gray-600 mb-1 capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                {key === "active_status" ? (
                  <input
                    type="checkbox"
                    name={key}
                    checked={value}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                ) : (
                  <input
                    type={key === "date_of_birth" ? "date" : "text"}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    placeholder={`Enter ${key.replace(/_/g, " ")}`}
                    className="w-full border-b border-blue-300 focus:outline-none focus:border-blue-600 p-2 placeholder-gray-400"
                  />
                )}
                {errors[key] && (
                  <p className="text-sm text-red-500 mt-1">{errors[key]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg w-full transition font-semibold mt-4"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {showPopupMessage && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 text-white ${
              popupType === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <FaCheckCircle className="text-xl" />
            <span>{popupMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmpOnboard;
