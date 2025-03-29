import React, { useState, useEffect } from "react";
import moment from "moment";
import { LuUsers2 } from "react-icons/lu";
import { GrUserExpert } from "react-icons/gr";
import { FiUserX } from "react-icons/fi";
import "animate.css";
import SalaryOverview from "./salaray_detail"; // Ensure this import is correct
import Calendar from "./calendar";
import Attendance_Chart from "./attendance_chart";
import { RiErrorWarningLine } from "react-icons/ri";

const Dashboard = () => {
  const [data, setData] = useState({
    totalWorkforce: 0,
    presentWorkforce: 0,
    absentWorkforce: 0,
    lateArrivals: 0,
    inLeave: 0,
  });

  const API_URL = process.env.REACT_APP_FRONTEND_URL;

  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]); // State for birthdays
  const [salaryData, setSalaryData] = useState({
    total: "0",
    percentageChange: "0.00%",
  }); // State for salary data
  const [attendanceHistory, setAttendanceHistory] = useState([]); // New State
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          "http://localhost:8599/v1/wellbeing360/appointment/get-all-appointments"
        );
        const result = await response.json();
        if (result && Array.isArray(result.appointments)) {
          setAppointments(result.appointments);
        } else {
          console.error("Invalid appointments format", result);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      try {
        const response = await fetch(
          `https://back-81-guards.casknet.dev/v1/hris/employees/getAttendanceStatsForLastFiveDays`
        );
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const formattedData = result.data.map((day) => ({
            day: moment(day.date).format("ddd"), // Convert date to short day name (Mon, Tue, etc.)
            present: day.presentWorkforce,
            absent: day.absentWorkforce,
          }));
          setAttendanceHistory(formattedData);
        } else {
          console.error(
            "Error fetching attendance stats:",
            result.error || result
          );
        }
      } catch (error) {
        console.error("Error fetching attendance history:", error);
      }
    };

    fetchAttendanceHistory();
  }, [API_URL]);

  // Callback function to receive salary data from SalaryOverview
  const handleSalaryDataFetched = (data) => {
    setSalaryData({
      total: data.total,
      percentageChange: data.percentageChange,
    });
  };

  // Fetch birthday data
  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const response = await fetch(
          `https://back-81-guards.casknet.dev/v1/hris/employees/get-birthdays`
        );
        const result = await response.json();

        if (Array.isArray(result)) {
          // Transform the API data to match the required structure
          const formattedBirthdays = result.map((employee) => ({
            name: employee.employee_calling_name,
            date: employee.birthday,
          }));
          setUpcomingBirthdays(formattedBirthdays);
        } else {
          console.error(
            "Error fetching birthdays: Response is not an array",
            result
          );
        }
      } catch (error) {
        console.error("Error fetching birthdays:", error);
      }
    };

    fetchBirthdays();
  }, [API_URL]);

  // Fetch attendance stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = moment().format("YYYY-MM-DD");

        const response = await fetch(
          `https://back-81-guards.casknet.dev/v1/hris/employees/getAttendanceStats`
        );
        const result = await response.json();

        if (result.success) {
          const { totalWorkforce, presentWorkforce, inLeave } = result.data;

          // Calculate absent workforce
          const absentWorkforce = totalWorkforce - presentWorkforce - inLeave;

          setData((prevData) => ({
            ...prevData,
            totalWorkforce,
            presentWorkforce,
            absentWorkforce,
            inLeave,
          }));
        } else {
          console.error(
            "Error fetching attendance stats:",
            result.error || result
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [API_URL]);

  const currentDate = moment().format("MMMM Do YYYY");
  const [currentTime, setCurrentTime] = useState(moment().format("h:mm:ss a"));
  const [activeTab, setActiveTab] = useState("leaves");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format("h:mm:ss a"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const upcomingRetirements = [
    { name: "Mark Johnson", date: "Feb 10, 2025" },
    { name: "Linda Davis", date: "Feb 15, 2025" },
  ];

  const [pendingLeaves, setPendingLeaves] = useState([]);

  useEffect(() => {
    const fetchPendingLeaves = async () => {
      try {
        const response = await fetch(
          `https://back-81-guards.casknet.dev/v1/hris/leave/getleaveapprove1`
        );
        const result = await response.json();

        if (Array.isArray(result)) {
          setPendingLeaves(result); // Store fetched pending leave requests
        } else {
          console.error(
            "Error fetching pending leaves: Response is not an array",
            result
          );
        }
      } catch (error) {
        console.error("Error fetching pending leaves:", error);
      }
    };

    fetchPendingLeaves();
  }, [API_URL]);

  return (
    <div className="mx-10">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[30px] font-semibold">
            Dashboard - Health Management Overview
          </p>
        </div>
      </div>

      <div>
        <p className="text-[25px] font-bold ml-3">Recent Registered Patients</p>
      </div>

      <div className="grid grid-rows-2 grid-flow-col gap-4 mt-[-50px]">
        {/* Patient Stats & Chart */}
        <div className="col-span-2 shadow-lg p-3 rounded-lg">
          <div className="grid grid-cols-3 gap-6 items-center">
            <div className="col-span-2">
              <p className="text-[30px] font-bold">125 Patients</p>
              <p
                className={`p-2 rounded-lg w-[100px] mt-2 text-center ${
                  parseFloat(salaryData.percentageChange) >= 0
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {salaryData.percentageChange}
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Patient registrations in the last month
              </p>
            </div>

            {/* Chart Section */}
            <div className="col-span-1 mr-[80px]">
              <SalaryOverview onDataFetched={handleSalaryDataFetched} />
            </div>
          </div>
        </div>

        <div className="row-span-1 col-span-2">
          <div className="shadow-lg rounded-lg p-3">
            <p className="text-[18px] font-semibold">Healthcare Statistics</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex gap-3 items-center">
                <div className="text-4xl rounded-full p-2 bg-purple-100 text-purple-600">
                  <LuUsers2 />
                </div>
                <div>
                  <div className="text-2xl font-semibold">
                    {data.totalWorkforce}
                  </div>
                  <div className="text-sm text-gray-500">Total Staff</div>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="text-4xl rounded-full p-2 bg-green-100 text-green-600">
                  <GrUserExpert />
                </div>
                <div>
                  <div className="text-2xl font-semibold">
                    {data.presentWorkforce}
                  </div>
                  <div className="text-sm text-gray-500">Doctors Available</div>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="text-4xl rounded-full p-2 bg-red-100 text-red-600">
                  <FiUserX />
                </div>
                <div>
                  <div className="text-2xl font-semibold">
                    {data.absentWorkforce}
                  </div>
                  <div className="text-sm text-gray-500">Doctors On Leave</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="row-span-2">
          <div className="shadow-lg p-3 rounded-lg w-[540px]">
            <p className="text-[20px] font-bold">
              <Calendar />
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-[-100px]">
        {/* Attendance Chart */}
        <div className="shadow-lg p-2 rounded-lg col-span-2">
          <Attendance_Chart attendanceData={attendanceHistory} />
        </div>

        {/* Tabs: Appointments, Retirements, Birthdays */}
        <div className="shadow-lg p-4 rounded-lg bg-white">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 ${
                activeTab === "leaves"
                  ? "border-b-2 border-blue-500 font-bold text-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("leaves")}
            >
              Appointments
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "retirements"
                  ? "border-b-2 border-blue-500 font-bold text-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("retirements")}
            >
              Retirements
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "birthdays"
                  ? "border-b-2 border-blue-500 font-bold text-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("birthdays")}
            >
              Birthdays
            </button>
          </div>

          <div>
            {activeTab === "leaves" &&
              (appointments.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 mt-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.appointment_id}
                      className="border rounded-lg p-3  bg-white hover:shadow-md transition duration-300"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {/* Left Side */}
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-blue-600">
                            {appointment.employee_name}
                          </p>
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Doctor:</span>{" "}
                            {appointment.doctor_name}
                          </p>
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Specialization:</span>{" "}
                            {appointment.specialization}
                          </p>
                        </div>

                        {/* Right Side */}
                        <div className="text-right space-y-1">
                          <span
                            className={`text-xs px-2 py-[2px] rounded-full font-semibold 
                ${
                  appointment.appointment_status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
                          >
                            {appointment.appointment_status}
                          </span>
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Date:</span>{" "}
                            {appointment.appointment_date}
                          </p>
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Time:</span>{" "}
                            {appointment.start_time} - {appointment.end_time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 ">
                </p>
              ))}

            {activeTab === "leaves" && (
              <ul>
                {pendingLeaves.length > 0 ? (
                  pendingLeaves.map((leave, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between border-b py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full text-white font-bold bg-blue-300">
                          {leave.employee_fullname
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {leave.employee_fullname}
                          </p>
                          <p className="text-xs text-gray-500">
                            {leave.employee_no}
                          </p>
                        </div>
                      </div>
                      <span className="text-gray-400">
                        <div className="bg-orange-100 text-orange-500 rounded-full p-1">
                          <RiErrorWarningLine />
                        </div>
                      </span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No scheduled appointments.
                  </p>
                )}
              </ul>
            )}

            {activeTab === "retirements" && (
              <ul>
                {upcomingRetirements.map((retirement, index) => (
                  <li key={index} className="border-b py-2">
                    <p className="text-sm font-semibold">{retirement.name}</p>
                    <p className="text-xs text-gray-500">{retirement.date}</p>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "birthdays" && (
              <ul>
                {upcomingBirthdays.length > 0 ? (
                  upcomingBirthdays.map((birthday, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between border-b py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full text-white font-bold bg-blue-300">
                          {birthday.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {birthday.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {birthday.date}
                          </p>
                        </div>
                      </div>
                      <span className="text-gray-400">
                        <div className="bg-orange-100 text-orange-500 rounded-full p-1">
                          <RiErrorWarningLine />
                        </div>
                      </span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No upcoming birthdays.
                  </p>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
