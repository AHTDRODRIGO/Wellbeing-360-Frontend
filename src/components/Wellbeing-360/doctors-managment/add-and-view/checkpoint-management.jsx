import React, { useState } from "react";
import { FaStar, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { format } from "date-fns";

const API = "http://localhost:8599/v1/wellbeing360/doctors";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const rowsPerPage = 8;
  const totalPages = Math.ceil(filteredDoctors.length / rowsPerPage);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const fetchDoctorsByDate = async () => {
    if (!searchDate) {
      alert("Please select a date first.");
      return;
    }

    try {
      const res = await fetch(`${API}/get-doctor-by-date?date=${searchDate}`);
      const data = await res.json();
      const doctors = data.doctors || [];

      setDoctors(doctors);
      setFilteredDoctors(doctors);
      setCurrentPage(1);

      // Extract unique specialties for dropdown
      const uniqueSpecs = [...new Set(doctors.map((d) => d.specialization))];
      setSpecialties(uniqueSpecs);
      setSpecialtyFilter(""); // Reset filter
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const filterDoctors = () => {
    let filtered = [...doctors];

    if (specialtyFilter) {
      filtered = filtered.filter(
        (doc) => doc.specialization === specialtyFilter
      );
    }

    if (searchName) {
      filtered = filtered.filter((doc) =>
        doc.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      const res = await fetch(`${API}/delete-doctor?doctor_id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const updated = filteredDoctors.filter((doc) => doc.doctor_id !== id);
        setDoctors(updated);
        setFilteredDoctors(updated);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl text-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-2">
          Welcome to tomorrow’s healthcare solution.
        </h1>
        <p className="text-sm">Provide. Protect.</p>
        <div className="flex justify-between items-center mt-4">
          <p className="bg-white text-black rounded-full px-4 py-2 shadow">
            📅 {format(new Date(), "EEEE, MMMM do, yyyy")} —{" "}
            {format(new Date(), "p")}
          </p>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus className="inline mr-2" /> Add Doctor
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white mt-6 p-4 rounded-lg shadow-md flex flex-wrap gap-4 items-center">
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border p-2 rounded w-48"
        />
        <button
          onClick={fetchDoctorsByDate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search by Date
        </button>

        {doctors.length > 0 && (
          <>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="border p-2 rounded w-48"
            >
              <option value="">All Specialties</option>
              {specialties.map((spec, idx) => (
                <option key={idx} value={spec}>
                  {spec}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="border p-2 rounded w-48"
            />
            <button
              onClick={filterDoctors}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              Filter
            </button>
          </>
        )}
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {paginatedDoctors.map((doc) => (
          <div
            key={doc.doctor_id}
            className="bg-white shadow rounded-lg p-4 text-center"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 mb-3" />
            <h3 className="font-bold">{doc.name}</h3>
            <p className="text-sm text-gray-500">{doc.specialization}</p>
            <div className="flex justify-center text-green-600 mt-2">
              {[...Array(5)].map((_, idx) => (
                <FaStar key={idx} className="text-sm" />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">{doc.availability}</p>
            <div className="flex justify-center gap-2 mt-3">
              <button
                className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
                onClick={() => alert("Edit doctor logic")}
              >
                <FaEdit />
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
                onClick={() => handleDelete(doc.doctor_id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredDoctors.length > rowsPerPage && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            className="px-3 py-1 border rounded"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 border rounded ${
                currentPage === idx + 1 ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add Doctor</h2>
            <p className="text-gray-600 mb-4">
              You can implement your form here.
            </p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => setShowAddModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
