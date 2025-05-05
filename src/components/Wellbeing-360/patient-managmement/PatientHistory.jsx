import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import Channell from "./channell";

function PatientHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [viewModalData, setViewModalData] = useState(null);

  const specialties = ["Cardiology", "Dermatology", "Neurology", "General"];

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        "http://localhost:8599/v1/wellbeing360/doctors/appointments"
      );
      const result = await response.json();
      if (result.success) {
        setAppointments(result.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    return (
      (!searchDate || a.appointment_date === searchDate) &&
      (!searchName ||
        a.doctor_name.toLowerCase().includes(searchName.toLowerCase())) &&
      (!specialtyFilter || a.specialization === specialtyFilter)
    );
  });

  return (
    <div className="p-6">
      {/* If viewing a specific appointment */}
      {viewModalData ? (
        <div>
          <div className="mb-4">
            <button
              className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm"
              onClick={() => setViewModalData(null)}
            >
              ← Back to Appointments
            </button>
          </div>
          <Channell
            employeeNo={viewModalData.employeeNo}
            scheduleId={viewModalData.scheduleId}
          />
        </div>
      ) : (
        <>
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
              onClick={fetchAppointments}
            >
              Search
            </button>
          </div>

          {/* Appointments Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Appointment ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Specialization</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-400">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((app) => (
                    <tr
                      key={app.appointment_id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">{app.appointment_id}</td>
                      <td className="px-4 py-2">{app.appointment_date}</td>
                      <td className="px-4 py-2 capitalize">
                        {app.appointment_status}
                      </td>
                      <td className="px-4 py-2">{app.doctor_name}</td>
                      <td className="px-4 py-2">{app.specialization}</td>
                      <td className="px-4 py-2">{app.employee_name}</td>
                      <td className="px-4 py-2">
                        {app.start_time} - {app.end_time}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600"
                          onClick={() =>
                            setViewModalData({
                              employeeNo: app.employee_no,
                              scheduleId: app.schedule_id,
                            })
                          }
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default PatientHistory;
