import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const DoctorSchedule = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchDate, setSearchDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [searchName, setSearchName] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [doctorSchedules, setDoctorSchedules] = useState({});
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  useEffect(() => {
    fetchDoctorsByDate(searchDate);
  }, []);

  const fetchDoctorsByDate = async (date) => {
    try {
      const res = await fetch(
        `http://localhost:8599/v1/wellbeing360/doctors/get-doctor-by-date?date=${date}`
      );
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    }
  };

  const fetchDoctorSchedule = async (doctorId) => {
    try {
      const res = await fetch(
        `http://localhost:8599/v1/wellbeing360/doctors/upcoming-schedules?doctor_id=${doctorId}`
      );
      const data = await res.json();
      setDoctorSchedules((prev) => ({
        ...prev,
        [doctorId]: data.schedules || [],
      }));
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
    }
  };

  const fetchEmployeeSuggestions = async (query) => {
    const res = await fetch(
      "http://localhost:8599/v1/wellbeing360/employees/get-all"
    );
    const data = await res.json();
    const filtered = data.employees.filter((emp) =>
      emp.name.toLowerCase().includes(query.toLowerCase())
    );
    setEmployeeSuggestions(filtered);
  };

  const handleAppointment = async () => {
    if (!selectedEmployee) return alert("Please select an employee");

    const res = await fetch(
      "http://localhost:8599/v1/wellbeing360/appointment/book-appointment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_no: selectedEmployee.employee_no,
          doctor_id: selectedDoctorId,
          schedule_id: selectedSchedule.schedule_id,
        }),
      }
    );

    if (res.ok) {
      setSuccessMessage("Appointment successfully created!");
      setShowModal(false);
      setSelectedEmployee(null);
      setEmployeeSearch("");
    } else {
      alert("Failed to book appointment");
    }
  };

  const specialties = [...new Set(doctors.map((doc) => doc.specialization))];
  const filteredDoctors = doctors.filter((doc) => {
    const matchesName = doc.name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesSpecialty = specialtyFilter
      ? doc.specialization === specialtyFilter
      : true;
    return matchesName && matchesSpecialty;
  });

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-2xl font-bold">
          Welcome to tomorrow’s healthcare solution.
        </h1>
        <p className="text-sm">Provide. Protect.</p>
        <div className="bg-white text-black inline-block px-4 py-2 mt-4 rounded-full shadow">
          📅 {format(new Date(), "EEEE, MMMM do, yyyy")} —{" "}
          {format(new Date(), "p")}
        </div>
      </div>

      <div className="bg-white shadow p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border p-2 rounded w-48"
        />
        <input
          type="text"
          placeholder="Search doctor by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border p-2 rounded w-48"
        />
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
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          onClick={() => fetchDoctorsByDate(searchDate)}
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.doctor_id}
            className="bg-white rounded-lg shadow-lg p-4"
          >
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                const alreadySelected = selectedDoctorId === doc.doctor_id;
                setSelectedDoctorId(alreadySelected ? null : doc.doctor_id);
                if (!alreadySelected && !doctorSchedules[doc.doctor_id])
                  fetchDoctorSchedule(doc.doctor_id);
              }}
            >
              <img
                src={`https://api.dicebear.com/7.x/personas/svg?seed=${doc.name}`}
                alt={doc.name}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h3 className="font-bold text-lg">{doc.name}</h3>
                <p className="text-sm text-gray-500">{doc.specialization}</p>
                <p className="text-xs text-gray-400">{doc.work_location}</p>
              </div>
            </div>

            <div className="flex justify-start text-green-600 mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-sm" />
              ))}
            </div>

            <AnimatePresence>
              {selectedDoctorId === doc.doctor_id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <h4 className="font-semibold mb-2">Upcoming Schedules</h4>
                  {doctorSchedules[doc.doctor_id]?.length > 0 ? (
                    <div>
                      {doctorSchedules[doc.doctor_id].map((sched, idx) => (
                        <div
                          key={idx}
                          className="bg-blue-200 rounded-xl p-4 mb-4 shadow-md border-l-8 border-blue-900 relative"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
                              Schedule
                            </span>
                            <span className="bg-blue-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
                              {sched.start_time} – {sched.end_time}
                            </span>
                          </div>
                          <div className="mb-2">
                            <h4 className="text-md font-bold text-gray-800">
                              Date : {sched.date}
                            </h4>
                            <p className="text-xs text-gray-600">
                              Contact Number : Hotline
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-900 text-white text-xs px-3 py-1 rounded-full">
                              Hemas-Thalawathugoda
                            </span>
                            <span className="flex items-center gap-1 text-green-700 font-bold text-sm">
                              <span>🦻</span> {sched.available_slots}
                            </span>
                          </div>
                          <div className="absolute right-4 top-4 flex items-center gap-2 text-blue-800">
                            <button
                              title="Book"
                              onClick={() => {
                                setSelectedSchedule(sched);
                                setShowModal(true);
                              }}
                              className="bg-white border border-gray-300 text-xs px-2 py-1 rounded-full hover:bg-gray-100"
                            >
                              Make an Appointment
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No schedules available.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Modal for Appointment */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[450px] max-w-full">
            <h2 className="text-lg font-bold mb-4">Make Appointment</h2>
            <input
              type="text"
              value={employeeSearch}
              onChange={(e) => {
                setEmployeeSearch(e.target.value);
                fetchEmployeeSuggestions(e.target.value);
                setSelectedEmployee(null);
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-purple-500"
              placeholder="Type employee name"
            />
            {employeeSuggestions.length > 0 && !selectedEmployee && (
              <ul className="mt-2 border rounded bg-white max-h-40 overflow-y-auto">
                {employeeSuggestions.map((emp, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setEmployeeSearch(emp.name);
                      setSelectedEmployee(emp);
                      setEmployeeSuggestions([]);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {emp.name} - {emp.employee_no}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAppointment}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {successMessage && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-green-600 text-white px-6 py-4 rounded shadow-lg">
            <p>{successMessage}</p>
            <button
              onClick={() => setSuccessMessage("")}
              className="ml-4 text-sm underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;
