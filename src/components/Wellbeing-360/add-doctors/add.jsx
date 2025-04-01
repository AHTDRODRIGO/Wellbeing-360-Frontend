import React, { useEffect, useState } from "react";
import { FaStar, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(6);

  const [modalOpen, setModalOpen] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [formData, setFormData] = useState({
    doctor_id: "",
    name: "",
    specialization: "",
    contact_number: "",
    email: "",
    work_location: "",
    availability: "",
    active_status: true,
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
    const endpoint = editDoctor
      ? `${API_BASE}/update-doctor?doctor_id=${editDoctor.doctor_id}`
      : `${API_BASE}/add-doctors`;

    const method = editDoctor ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setModalOpen(false);
      fetchDoctors();
    }
  };

  // Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDoctors.length / rowsPerPage);

  const allSpecializations = [...new Set(doctors.map((d) => d.specialization))];

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between mb-6 gap-2">
        <h2 className="text-2xl font-bold">Doctors Management</h2>
        <div className="flex gap-2">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentDoctors.map((doctor) => (
          <div
            key={doctor.doctor_id}
            className="bg-white rounded-lg shadow p-4 text-center relative"
          >
            <img
              src={`https://api.dicebear.com/7.x/personas/svg?seed=${doctor.name}`}
              alt="doctor"
              className="w-16 h-16 mx-auto rounded-full mb-3"
            />
            <h3 className="font-semibold">{doctor.name}</h3>
            <p className="text-sm text-gray-500">{doctor.specialization}</p>
            <div className="text-green-500 flex justify-center my-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <FaStar key={i} />
                ))}
            </div>
            <p className="text-sm text-gray-500">{doctor.work_location}</p>
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => handleEdit(doctor)}
                className="text-blue-500 hover:underline"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(doctor.doctor_id)}
                className="text-red-500 hover:underline"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[500px] max-w-full">
            <h2 className="text-lg font-bold mb-4">
              {editDoctor ? "Edit Doctor" : "Add Doctor"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {Object.entries(formData).map(([key, value]) => {
                if (key === "active_status") {
                  return (
                    <div key={key}>
                      <label className="text-sm font-medium">Active</label>
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
                      value={value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
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
    </div>
  );
};

export default DoctorManagement;
