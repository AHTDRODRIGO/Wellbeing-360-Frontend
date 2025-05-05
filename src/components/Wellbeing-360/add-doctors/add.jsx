import React, { useEffect, useState } from "react";
import { FaStar, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(6);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [schedules, setSchedules] = useState([
    { date: "", start_time: "", end_time: "", max_patients: "" },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [expandedSchedule, setExpandedSchedule] = useState(0); // default open first block
  const [errors, setErrors] = useState({});
  const [showPopupMessage, setShowPopupMessage] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    contact_number: "",
    email: "",
    work_location: "",
    availability: "",
  });

  const API_BASE = "http://localhost:8599/v1/wellbeing360/doctors";

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    let filtered = doctors;
    if (searchTerm) {
      filtered = filtered.filter((d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (specialization) {
      filtered = filtered.filter((d) => d.specialization === specialization);
    }
    setFilteredDoctors(filtered);
    setCurrentPage(1);
  }, [searchTerm, specialization, doctors]);

  const fetchDoctors = async () => {
    const res = await fetch(`${API_BASE}/get-doctors`);
    const data = await res.json();
    setDoctors(data.doctors || []);
  };

  const handleEdit = (doctor) => {
    setEditDoctor(doctor);
    setFormData(doctor);
    setModalOpen(true);
  };

  const handleDelete = async (doctor_id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      await fetch(`${API_BASE}/delete-doctor?doctor_id=${doctor_id}`, {
        method: "DELETE",
      });
      fetchDoctors();
    }
  };

  const handleAddDoctor = () => {
    setFormData({
      doctor_id: "",
      name: "",
      specialization: "",
      contact_number: "",
      email: "",
      work_location: "",
      availability: "",
      active_status: true,
    });
    setEditDoctor(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData };
    if (!editDoctor) delete payload.doctor_id;

    const endpoint = editDoctor
      ? `${API_BASE}/update-doctor?doctor_id=${editDoctor.doctor_id}`
      : `${API_BASE}/add-doctors`;

    const method = editDoctor ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setModalOpen(false);
        setPopupMessage(
          editDoctor
            ? `Doctor "${formData.name}" updated successfully!`
            : `Doctor "${formData.name}" added successfully!`
        );
        setPopupType("success");
        setShowPopupMessage(true);
        fetchDoctors();

        // Optional: hide after delay
        setTimeout(() => setShowPopupMessage(false), 3000);
      } else {
        setPopupMessage(result.error || "Something went wrong.");
        setPopupType("error");
        setShowPopupMessage(true);
        setTimeout(() => setShowPopupMessage(false), 3000);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setPopupMessage("Server error. Please try again later.");
      setPopupType("error");
      setShowPopupMessage(true);
      setTimeout(() => setShowPopupMessage(false), 3000);
    }
  };

  // Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDoctors.length / rowsPerPage);

  const allSpecializations = [...new Set(doctors.map((d) => d.specialization))];
  const updateSchedule = (index, field, value) => {
    setSchedules((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  const formattedSchedules = schedules.map((sch) => ({
    date: `${sch.year}-${String(sch.month).padStart(2, "0")}-${String(
      sch.day
    ).padStart(2, "0")}`,
    start_time: sch.start_time,
    end_time: sch.end_time,
    max_patients: Number(sch.max_patients),
  }));
  const submitSchedule = async () => {
    try {
      const formatted = schedules.map((sch) => ({
        date: `${sch.year}-${String(sch.month).padStart(2, "0")}-${String(
          sch.day
        ).padStart(2, "0")}`,
        start_time: sch.start_time,
        end_time: sch.end_time,
        max_patients: Number(sch.max_patients),
      }));

      const res = await fetch(`${API_BASE}/add-doctor-schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: selectedDoctorId,
          schedules: formatted,
        }),
      });

      if (res.ok) {
        setPopupType("success");
        setPopupMessage("Schedule submitted successfully!");
        setShowPopup(true);
        setScheduleModalOpen(false);
      } else {
        setPopupType("error");
        setPopupMessage("Something went wrong while submitting!");
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error submitting schedule:", error);
      alert("Something went wrong while submitting.");
    }
  };
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="p-6">
      {/* Header + Filters */}
      <div className="flex flex-wrap justify-between mb-6 gap-2">
        <h2 className="text-2xl font-bold">Doctors Management</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search by name"
            className="border p-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Specializations</option>
            {allSpecializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddDoctor}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-1"
          >
            <FaPlus /> Add Doctor
          </button>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentDoctors.map((doctor) => (
          <div
            key={doctor.doctor_id}
            className="bg-white rounded-2xl shadow-lg p-6 relative transition-transform hover:scale-[1.02] duration-300"
          >
            {/* Top Right Buttons */}
            <div className="absolute top-4 right-4 flex gap-3 text-lg">
              <button
                onClick={() => handleEdit(doctor)}
                className="text-blue-500 hover:text-blue-700"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(doctor.doctor_id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-4">
              <img
                src={`https://api.dicebear.com/7.x/personas/svg?seed=${doctor.name}`}
                alt="doctor"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">
                  {doctor.name}
                </h3>
                <p className="text-sm text-gray-500">{doctor.specialization}</p>
                <p className="text-sm text-gray-400">{doctor.work_location}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex justify-start items-center gap-1 text-green-500 mt-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <FaStar key={i} />
                ))}
            </div>

            {/* Schedule Button */}
            <button
              onClick={() => {
                setSelectedDoctorId(doctor.doctor_id);
                setSchedules([
                  { date: "", start_time: "", end_time: "", max_patients: "" },
                ]);
                setScheduleModalOpen(true);
              }}
              className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-xl transition duration-300"
            >
              Schedule Appointment
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === idx + 1 ? "bg-green-300" : ""
            }`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
      {scheduleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-gray-50 p-6 rounded shadow-lg w-[650px] max-w-full space-y-4 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Schedule Appointments
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSchedule();
              }}
              className="space-y-4"
            >
              {schedules.map((sch, idx) => {
                const isOpen = expandedSchedule === idx;
                const displayDate =
                  sch.day && sch.month && sch.year
                    ? `${sch.year}-${String(sch.month).padStart(
                        2,
                        "0"
                      )}-${String(sch.day).padStart(2, "0")}`
                    : "No date selected";

                return (
                  <div
                    key={idx}
                    className="border bg-white rounded-md shadow-sm"
                  >
                    {/* Header */}
                    <div
                      className="flex justify-between items-center px-4 py-2 cursor-pointer"
                      onClick={() => setExpandedSchedule(isOpen ? null : idx)}
                    >
                      <h3 className="font-medium text-gray-700">
                        Schedule Day {String(idx + 1).padStart(2, "0")}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">
                          {displayDate} | {sch.start_time || "--:--"} -{" "}
                          {sch.end_time || "--:--"}
                        </p>
                        {schedules.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSchedules((prev) =>
                                prev.filter((_, i) => i !== idx)
                              );
                            }}
                            className="text-red-500 hover:text-red-700 text-xl"
                            title="Remove schedule"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Section */}
                    {isOpen && (
                      <div className="px-4 pb-4 space-y-4">
                        {/* Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Date
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <select
                              value={sch.day || ""}
                              onChange={(e) =>
                                updateSchedule(idx, "day", e.target.value)
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-purple-500"
                              required
                            >
                              <option value="">Day</option>
                              {[...Array(31)].map((_, i) => (
                                <option key={i} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>
                            <select
                              value={sch.month || ""}
                              onChange={(e) =>
                                updateSchedule(idx, "month", e.target.value)
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-purple-500"
                              required
                            >
                              <option value="">Month</option>
                              {[
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December",
                              ].map((month, i) => (
                                <option key={i} value={i + 1}>
                                  {month}
                                </option>
                              ))}
                            </select>
                            <select
                              value={sch.year || ""}
                              onChange={(e) =>
                                updateSchedule(idx, "year", e.target.value)
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-purple-500"
                              required
                            >
                              <option value="">Year</option>
                              {Array.from(
                                { length: 5 },
                                (_, i) => 2025 + i
                              ).map((y) => (
                                <option key={y} value={y}>
                                  {y}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Time */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time & End Time
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="time"
                              value={sch.start_time || ""}
                              onChange={(e) =>
                                updateSchedule(
                                  idx,
                                  "start_time",
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-purple-500"
                              required
                            />
                            <input
                              type="time"
                              value={sch.end_time || ""}
                              onChange={(e) =>
                                updateSchedule(idx, "end_time", e.target.value)
                              }
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-purple-500"
                              required
                            />
                          </div>
                        </div>

                        {/* Max Patients */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Patients
                          </label>
                          <input
                            type="number"
                            value={sch.max_patients || ""}
                            onChange={(e) =>
                              updateSchedule(
                                idx,
                                "max_patients",
                                e.target.value
                              )
                            }
                            placeholder="Enter max patients"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-purple-500"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add More */}
              <button
                type="button"
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded text-sm"
                onClick={() =>
                  setSchedules((prev) => [
                    ...prev,
                    {
                      day: "",
                      month: "",
                      year: "",
                      start_time: "",
                      end_time: "",
                      max_patients: "",
                    },
                  ])
                }
              >
                + Add More
              </button>

              {/* Submit / Cancel */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Submit Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div
            className={`p-6 rounded-lg shadow-lg text-white ${
              popupType === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <h3 className="text-lg font-semibold">{popupMessage}</h3>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-white text-sm text-gray-800 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[500px] max-w-full">
            <h2 className="text-lg font-bold mb-4">
              {editDoctor ? "Edit Doctor" : "Add Doctor"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {Object.entries(formData).map(([key, value]) => {
                // Skip doctor_id (auto-generated)
                if (key === "doctor_id") return null;

                // Active Status only in Edit mode
                if (key === "active_status" && !editDoctor) return null;

                if (key === "active_status") {
                  return (
                    <div key={key}>
                      <label className="text-sm font-medium">
                        Active Status
                      </label>
                      <select
                        name="active_status"
                        value={value ? "true" : "false"}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            active_status: e.target.value === "true",
                          }))
                        }
                        className="border p-2 rounded w-full"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  );
                }

                return (
                  <div key={key}>
                    <label className="text-sm font-medium capitalize">
                      {key.replace(/_/g, " ")}
                    </label>
                    <input
                      type="text"
                      name={key}
                      value={value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      required
                      className="border p-2 rounded w-full"
                    />
                  </div>
                );
              })}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  {editDoctor ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

export default DoctorManagement;
