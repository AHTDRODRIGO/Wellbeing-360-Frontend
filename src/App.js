/** @format */

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Cookies from "js-cookie";


import "./App.css";
// Import components
import Sidebar from "./components/sidebar/sidebar.jsx";
import Navbar from "./components/Wellbeing-360/navbar/navbar.jsx";
import Login from "./components/Wellbeing-360/login/login.jsx";
import Home from "./components/Wellbeing-360/employee/dashbaord/dashboard.jsx";
import Emp_Dashboard from "./components/Wellbeing-360/emp_management/dashboard/dashboard.jsx";
import Emp_details from "./components/Wellbeing-360/emp_management/view_emp_details/emp_details.jsx";
import Onboard_new from "./components/Wellbeing-360/emp_management/employee_quick_onboard/onboard_new.jsx";
import Emp_Management from "./components/Wellbeing-360/emp_management/emp_management/emp_management.jsx";
import Checkpoint_management from "./components/Wellbeing-360/doctors-managment/add-and-view/checkpoint-management.jsx";
import Client from "./components/Wellbeing-360/add-doctors/add.jsx"; 
import Check_point_by_client from "./components/Wellbeing-360/doctors-managment/add-and-view/check-point-by-client.jsx";
import Checkpoint from "./components/Wellbeing-360/doctors-managment/doctors.jsx";
import Check_point_by_client_02 from "./components/Wellbeing-360/doctors-managment/history/check-point-by-client-02.jsx";
import Checkpoint_history from "./components/Wellbeing-360/doctors-managment/history/check-point-history.jsx";

const AppContent = ({
  isSidebarOpen,
  toggleSidebar,
  showSessionExpiredPopup,
  notifications,
  setNotifications,
  showNotificationPopup,
  setShowNotificationPopup,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSessionExpired = () => {
    if (
      window.confirm(
        "Your session has expired. Would you like to log in again?"
      )
    ) {
      Cookies.remove("yourCookieName"); // Adjust cookie name accordingly
      localStorage.removeItem("sessionStartTime");
      navigate("/login");
    }
  };

  const resetSessionTimer = () => {
    localStorage.setItem("sessionStartTime", new Date().getTime());
  };

  useEffect(() => {
    const checkSession = () => {
      const sessionStartTime = localStorage.getItem("sessionStartTime");
      if (sessionStartTime) {
        const currentTime = new Date().getTime();
        const sessionExpiryTime = parseInt(sessionStartTime) + 30 * 60 * 1000; // 30 minutes
        if (currentTime > sessionExpiryTime) {
          showSessionExpiredPopup();
          handleSessionExpired();
        }
      }
    };

    checkSession();

    // Add event listeners for user activity
    window.addEventListener("mousemove", resetSessionTimer);
    window.addEventListener("keypress", resetSessionTimer);
    window.addEventListener("click", resetSessionTimer);

    return () => {
      // Clean up event listeners
      window.removeEventListener("mousemove", resetSessionTimer);
      window.removeEventListener("keypress", resetSessionTimer);
      window.removeEventListener("click", resetSessionTimer);
    };
  }, [location, showSessionExpiredPopup]);

  const isOnboardNewRoute = location.pathname === "/onboard_new";

  return (
    <div className="App flex">
      {location.pathname !== "/login" && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}
      <div
        className={`flex-grow p-5 transition-all duration-300 ${isSidebarOpen && location.pathname !== "/login" ? "ml-64" : "ml-20"
          }`}
        style={
          isOnboardNewRoute
            ? { position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }
            : {}
        }
      >
        {location.pathname !== "/login" && (
          <Navbar
            notifications={notifications}
            setNotifications={setNotifications}
            showNotificationPopup={showNotificationPopup}
            setShowNotificationPopup={setShowNotificationPopup}
          />
        )}
        <Routes>
        <Route path="/emp-details" element={<Emp_details />} />
        <Route path="/onboard_new" element={<Onboard_new />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/emp-management" element={<Emp_Management />} />
        <Route path="/Appoinment-management" element={<Checkpoint_management/>} />
        <Route path="/Doctors-management" element={<Client/>} />
        <Route path="/check_point_by_client" element={<Check_point_by_client/>} />
        <Route path="/Appoinment" element={<Checkpoint/>} />
        <Route path="/check_point_by_client_02" element={<Check_point_by_client_02/>} />
        <Route path="/Checkpoint-history" element={<Checkpoint_history/>} />
        <Route path="/emp-dashboard" element={<Emp_Dashboard />} />

          
          
          
          
          
          
          
          
          {/* <Route path="/leave-info" element={<Leave />} />
          <Route path="/leave-management" element={<Leave_Management />} />
          <Route path="/leave-request" element={<Leave_Request />} />
          <Route path="/leave-approve" element={<Leave_Approve />} />
          <Route path="/leave-taken" element={<Leave_process_popup />} />
          <Route
            path="/leave-approve-popup"
            element={<Leave_approve_popup />}
          />
          <Route path="/restricted-date" element={<Restricted_Date />} />
          <Route path="/hr-report" element={<HR_Reports />} />
          <Route path="/leave-reports" element={<Reports />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/permission" element={<Permission />} />
          <Route
            path="/history-Login-Details"
            element={<History_login_details />}
          />
          <Route path="/reset-pw" element={<Reset_Pw />} />
          <Route path="/user-profile" element={<User_Profile />} />
          <Route
            path="/create-user-account"
            element={<User_account_creation />}
          />
          <Route path="/leave-balance-report" element={<Leave_Report />} />
          <Route
            path="/time-attendance-dashboard"
            element={<Time_Attendance_Dashboard />}
          />
          <Route path="/time-management" element={<Time_Management />} />
          <Route path="/absence-report" element={<Absence_Report />} />
          <Route
            path="/Checkin-checkout-Report"
            element={<Checkin_checkout_report />}
          />
          <Route path="/Leave-Request-Popup" element={<LeaveRequestPopup />} />
          <Route path="/hr-report-pdf" element={<Hr_Report_Pdf />} />
          <Route
            path="/department-comparison"
            element={<Departmental_Comparison />}
          />
          <Route path="/user-permission" element={<User_Permission />} />
          <Route
            path="/create-user-permission"
            element={<Create_User_Permission />}
          />
          <Route
            path="/edit-user-permission"
            element={<Edit_User_Permission />}
          />
          <Route path="/history-logged" element={<History_Logged />} />
          <Route path="/summary-report" element={<Summary_Report />} />
          <Route
            path="/attendance-history-report"
            element={<Attendance_History_Report />}
          />
          <Route path="/Designation" element={<Deignation />} />
          <Route path="/Supervisor" element={<Supervisor />} />
          <Route path="/service-charge" element={<Service_Charge />} />
          <Route path="/branch" element={<Branch />} />
          <Route path="/add-employee-type" element={<Employee_Type_Add />} />
          <Route path="/salaray-component-management" element={<Salaray_Component_Management />} />
          <Route path="/payroll-navigation" element={<Payroll_Navigation />} />
          <Route path="/payroll-allowance" element={<Payroll_Allowance />} />
          <Route path="/payroll-deduction" element={<Payroll_Deduction />} />
          <Route path="/allowance-component" element={<Allowance_Component />} />
          <Route path="/deduction-component" element={<Deduction_Component />} />
          <Route path="/salary-breakdown" element={<Salary_Breakdown />} />
          <Route path="/service-charge-payroll" element={<Service_Charge_Payroll />} />
          <Route path="/salary-advance" element={<Salary_Advance />} />
          <Route path="/month-end-payroll" element={<Month_End_Payroll />} />
          <Route path="/Generated-payroll" element={<Genarated_Payroll />} />
          <Route path="/create-leave-types" element={<Create_Leave_Types />} />
          <Route path="/leave-allocation" element={<Leave_Allocation />} />
          <Route path="/view-leave-table" element={<View_Leave_Table />} />
          <Route path="/leave-history" element={<Leave_History />} />
          <Route path="/genarated-incentive-payroll" element={<Genarated_Incentive_Payroll />} />
          <Route path="/service-charge-percentage" element={<Service_Charge_Percentage />} />
          <Route path="/assign-roster" element={<Assign_Roster />} />
          <Route path="/loan-management" element={<Loan_Managemnt />} />
          <Route path="/loan-component" element={<Loan_Component />} />
          <Route path="/create-loan" element={<Create_Loan />} />
          <Route path="/job-posting-management" element={<Job_Posting_Management />} />
          <Route path="/collect-job-details" element={<Collect_Job_Details />} /> */}
        </Routes>
      </div>
    </div>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const showSessionExpiredPopup = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000); // Hide popup after 3 seconds
  };
  return (
    <Router>

      <AppContent
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        showSessionExpiredPopup={showSessionExpiredPopup}
        notifications={notifications}
        setNotifications={setNotifications}
        showNotificationPopup={showNotificationPopup}
        setShowNotificationPopup={setShowNotificationPopup}
      />
      {showPopup && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center p-4">
          Your session has expired. Please log in again.
        </div>
      )}
    </Router>
  );
}

export default App;
