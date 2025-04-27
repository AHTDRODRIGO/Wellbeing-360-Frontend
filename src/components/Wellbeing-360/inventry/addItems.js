import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import pharmacistImage from "../../../assets/top-view-medical-supplies-composition.jpg";

function AddItem() {
  const navigate = useNavigate();

  const [medicineData, setMedicineData] = useState({
    name: "",
    description: "",
    unit_type: "",
    unit_price: "",
    dosage_frequency: "",
    quantity_available: "",
    availability_status: true,
    created_by: "",
  });

  const [errors, setErrors] = useState({});
  const [showPopupMessage, setShowPopupMessage] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");

  // Unit type options
  const unitTypeOptions = ["pill", "bottle", "syrup", "capsule", "injection"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMedicineData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const formErrors = {};
    for (const key in medicineData) {
      if (medicineData[key] === "" || medicineData[key] === null) {
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
        `http://localhost:8599/v1/wellbeing360/inventry/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(medicineData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setPopupMessage(`Medicine added successfully!`);
        setPopupType("success");
        setShowPopupMessage(true);
        setTimeout(() => {
          setShowPopupMessage(false);
          navigate("/inventory-view-items");
        }, 2500);
      } else {
        throw new Error(result.message || "Failed to add medicine");
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
      {/* Left Panel with Image */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-400 flex flex-col items-center justify-center p-6 text-white">
        <h2 className="text-3xl font-bold mt-4 mb-2">Inventory System</h2>
        <p className="text-sm text-center max-w-xs mb-6">
          Manage and add new medicine items easily with Wellbeing360.
        </p>
        {/* <img
          src={pharmacistImage}
          alt="Pharmacist working"
          className="w-[70%] rounded-lg shadow-lg object-contain"
        /> */}
      </div>

      {/* Right Panel (Form) */}
      <div className="bg-white p-4 md:p-12 overflow-y-auto max-h-screen">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Add New Medicine
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 pb-10">
            {Object.entries(medicineData).map(([key, value]) => (
              <div key={key}>
                <label className="block text-gray-600 mb-1 capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                {key === "availability_status" ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name={key}
                      checked={value}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                    <span>Available</span>
                  </div>
                ) : key === "unit_type" ? (
                  <select
                    name="unit_type"
                    value={value}
                    onChange={handleChange}
                    className="w-full border-b border-blue-300 focus:outline-none focus:border-blue-600 p-2 bg-white"
                  >
                    <option value="">Select Unit Type</option>
                    {unitTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={
                      key === "unit_price" || key === "quantity_available"
                        ? "number"
                        : "text"
                    }
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

      {/* Toast Popup */}
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
}

export default AddItem;
