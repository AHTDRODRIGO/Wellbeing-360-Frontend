import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { format, parseISO, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calender.css";

const AppointmentManage = () => {
  const [searchDate, setSearchDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [searchName, setSearchName] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [doctorSchedules, setDoctorSchedules] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEmployeePopup, setShowEmployeePopup] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeAppointments, setEmployeeAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [doctorList, setDoctorList] = useState([]);

  useEffect(() => {
    fetchDoctorsByDate(searchDate);
  }, [searchDate]);

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
  const handleCancelAppointment = async (appointmentId) => {
    try {
      const res = await fetch(
        `http://localhost:8599/v1/wellbeing360/appointment/update-appointments`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointment_id: appointmentId,
            appointment_status: "cancelled",
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        // Refresh the employee appointments
        fetchAppointmentsByEmployee();
      } else {
        alert("Failed to cancel the appointment.");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const fetchDoctorSchedule = async (doctorId) => {
    setDoctorSchedules((prev) => ({
      ...prev,
      [doctorId]: [
        {
          date: searchDate,
          start_time: "10:00:00",
          end_time: "22:00:00",
          available_slots: 3,
        },
      ],
    }));
  };

  const fetchDoctorAppointments = async (doctorId) => {
    try {
      const res = await fetch(
        `http://localhost:8599/v1/wellbeing360/appointment/get-appointments-by-doctor?doctor_id=${doctorId}&appointment_date=${searchDate}`
      );
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };

  const fetchAppointmentsByEmployee = async () => {
    try {
      const res = await fetch(
        `http://localhost:8599/v1/wellbeing360/appointment/get-all-book-appointments?employee_no=${employeeSearch}`
      );
      const data = await res.json();
      const appointments = data.appointments || [];
      setEmployeeAppointments(appointments);

      const apptDates = [
        ...new Set(appointments.map((a) => a.appointment_date)),
      ];
      setHighlightedDates(apptDates.map((d) => parseISO(d)));

      const doctors = [
        ...new Map(
          appointments.map((item) => [
            item.doctor_name,
            { name: item.doctor_name, specialization: item.specialization },
          ])
        ).values(),
      ];
      setDoctorList(doctors);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const appointmentsForDate = employeeAppointments.filter((appt) =>
    isSameDay(parseISO(appt.appointment_date), selectedDate)
  );

  const getTileClassName = ({ date, view }) => {
    if (view === "month") {
      const match = highlightedDates.find((d) => isSameDay(d, date));
      return match ? "bg-blue-200 rounded-full font-semibold" : null;
    }
    return null;
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
      {/* Header */}
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
      {/* Filters */}
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
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          onClick={() => setShowEmployeePopup(true)}
        >
          Get Employee's Appointments
        </button>
      </div>
      {/* Doctor Cards */}
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
                if (!alreadySelected) {
                  fetchDoctorSchedule(doc.doctor_id);
                  fetchDoctorAppointments(doc.doctor_id);
                }
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
                  <h4 className="font-semibold mt-4 mb-2">Appointments</h4>
                  {appointments.length > 0 ? (
                    <div className="space-y-3">
                      {appointments.map((appt) => {
                        let cardClasses = "p-4 rounded-lg shadow-sm border ";
                        if (appt.appointment_status === "completed") {
                          cardClasses += "bg-green-100 border-green-400";
                        } else if (appt.appointment_status === "confirmed") {
                          cardClasses += "bg-yellow-100 border-yellow-400";
                        } else {
                          cardClasses += "bg-blue-50 border-blue-300";
                        }

                        return (
                          <div
                            key={appt.appointment_id}
                            className={cardClasses}
                          >
                            <div className="text-sm text-gray-700 font-semibold">
                              {appt.employee_name} ({appt.employee_no})
                            </div>
                            <div className="text-xs text-gray-500 mb-1">
                              Contact: {appt.contact_number}
                            </div>
                            <div className="text-sm">
                              📅 {appt.appointment_date} | ⏰ {appt.start_time}{" "}
                              - {appt.end_time}
                            </div>
                            <div className="text-xs mt-1 font-medium uppercase text-right">
                              <span
                                className={
                                  appt.appointment_status === "completed"
                                    ? "text-green-700"
                                    : appt.appointment_status === "confirmed"
                                    ? "text-yellow-700"
                                    : "text-blue-700"
                                }
                              >
                                {appt.appointment_status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No appointments available.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      {/* Popup Modal */}
      {showEmployeePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-7xl h-[90%] flex flex-col relative">
            <button
              onClick={() => setShowEmployeePopup(false)}
              className="absolute top-4 right-4 text-gray-600 text-2xl hover:text-black"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4">
              📅 Employee Appointment Calendar
            </h2>

            <div className="flex flex-1 overflow-hidden">
              {/* Left Panel */}
              <div className="w-1/3 border-r pr-6 overflow-y-auto">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Enter Employee No (e.g., E454545)"
                    value={employeeSearch}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && fetchAppointmentsByEmployee()
                    }
                    className="border border-gray-300 px-4 py-2 rounded-md w-full"
                  />
                  <button
                    onClick={fetchAppointmentsByEmployee}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                  >
                    Search
                  </button>
                </div>

                <div className="p-4 rounded-xl shadow bg-white">
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileClassName={getTileClassName}
                    tileContent={({ date, view }) =>
                      view === "month" &&
                      highlightedDates.find((d) => isSameDay(d, date)) ? (
                        <div className="flex justify-center mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        </div>
                      ) : null
                    }
                  />
                </div>

                <h3 className="mt-6 font-semibold text-gray-800 text-lg">
                  Doctors
                </h3>
                <ul className="text-sm mt-4 space-y-3">
                  {doctorList.map((doc, i) => {
                    // Optional: Assign colors based on index or specialization
                    const colorList = [
                      "bg-green-500",
                      "bg-blue-500",
                      "bg-purple-500",
                      "bg-red-500",
                    ];
                    const color = colorList[i % colorList.length]; // rotate through colors

                    return (
                      <li key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded-sm ${color} inline-block`}
                          ></span>
                          <span className="text-gray-700 font-medium">
                            {doc.name}
                          </span>
                          <span className="text-gray-400 text-xs">
                            ({doc.specialization})
                          </span>
                        </div>
                        <span className="text-gray-500 text-sm">⏱️ 3h00</span>{" "}
                        {/* Optional stat */}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Right Panel */}
              <div className="w-2/3 pl-6 overflow-y-auto border-l">
                <h3 className="text-lg font-semibold mb-2">
                  Appointments for {format(selectedDate, "PPP")}
                </h3>

                {appointmentsForDate.length === 0 ? (
                  <p className="text-gray-500">
                    No appointments for this date.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {appointmentsForDate.map((appt, idx) => {
                      let bgColor = "bg-blue-100 border-blue-300 text-blue-900";
                      if (appt.appointment_status === "completed")
                        bgColor =
                          "bg-green-100 border-green-300 text-green-800";
                      else if (appt.appointment_status === "confirmed")
                        bgColor =
                          "bg-yellow-100 border-yellow-300 text-yellow-800";

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border shadow-sm ${bgColor}`}
                        >
                          <div className="font-bold text-md">
                            {appt.doctor_name}
                          </div>
                          <div className="text-sm italic">
                            {appt.specialization}
                          </div>
                          <div className="text-sm mt-1">
                            ⏰ {appt.start_time} – {appt.end_time}
                          </div>
                          <div className="uppercase text-xs font-semibold mt-1">
                            {appt.appointment_status}
                          </div>

                          {appt.appointment_status === "confirmed" && (
                            <button
                              onClick={() => {
                                setConfirmCancelId(appt.appointment_id);
                                setShowConfirmModal(true);
                              }}
                              className="mt-3 bg-red-500 text-white text-xs px-4 py-1 rounded hover:bg-red-600 transition"
                            >
                              Cancel Appointment
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative">
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Cancel Appointment?
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                No, Go Back
              </button>
              <button
                onClick={() => {
                  handleCancelAppointment(confirmCancelId);
                  setShowConfirmModal(false);
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManage;
