import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

// Dummy Doctor Data
const dummyDoctors = [
  {
    doctor_id: "DOC001",
    name: "Methmi Jayawardhana",
    specialization: "Gastroenterology",
    hospital: "Dubai London Clinic",
    availability: "Mon–Fri 9AM–5PM",
    image: "https://i.pravatar.cc/100?img=12",
  },
  {
    doctor_id: "DOC002",
    name: "Thilei Jaya",
    specialization: "Cardiology",
    hospital: "Dubai London Clinic",
    availability: "Tue–Sat 10AM–6PM",
    image: "https://i.pravatar.cc/100?img=16",
  },
  {
    doctor_id: "DOC003",
    name: "Nethun Ranasinghe",
    specialization: "Neurology",
    hospital: "Dubai London Clinic",
    availability: "Mon–Thu 8AM–2PM",
    image: "https://i.pravatar.cc/100?img=20",
  },
];

// Dummy Schedule Slots
const dummyTimeSlots = [
  "9:00 – 10:00 AM",
  "10:00 – 11:00 AM",
  "11:00 – 12:00 PM",
  "1:00 – 2:00 PM",
  "2:00 – 3:00 PM",
  "3:00 – 4:00 PM",
];

const DoctorSchedule = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchDate, setSearchDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");

  const specialties = [
    ...new Set(dummyDoctors.map((doc) => doc.specialization)),
  ];

  const filteredDoctors = dummyDoctors.filter((doc) => {
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

      {/* Filters Below Header */}
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
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Search
        </button>
      </div>

      {/* Doctor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.doctor_id}
            className="bg-white rounded-lg shadow-lg p-4"
          >
            {/* Doctor Card */}
            <div
              className="flex items-center cursor-pointer"
              onClick={() =>
                setSelectedDoctor(
                  selectedDoctor?.doctor_id === doc.doctor_id ? null : doc
                )
              }
            >
              <img
                src={doc.image}
                alt={doc.name}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h3 className="font-bold text-lg">{doc.name}</h3>
                <p className="text-sm text-gray-500">{doc.specialization}</p>
                <p className="text-xs text-gray-400">{doc.hospital}</p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex justify-start text-green-600 mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-sm" />
              ))}
            </div>

            {/* Schedule */}
            <AnimatePresence>
              {selectedDoctor?.doctor_id === doc.doctor_id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <h4 className="font-semibold mb-2">Today's Appointments</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {dummyTimeSlots.map((slot, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg p-3 text-center text-sm border ${
                          idx % 3 === 0
                            ? "bg-orange-100 text-orange-800"
                            : idx % 2 === 0
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {slot}
                        <div className="mt-1 text-xs">
                          {idx % 2 === 0 ? "Available" : "Confirmed"}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorSchedule;
