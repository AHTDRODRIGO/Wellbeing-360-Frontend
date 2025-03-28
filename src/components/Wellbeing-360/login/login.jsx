import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import LoginImg from "../../../assets/right.jpg";
import Logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://back-81-guards.casknet.dev/v1/81guards/user/userLogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Login Success:", data);
        navigate("/emp-dashboard"); // ✅ Redirect on success
      } else {
        console.error("Login failed:", data.message || "Invalid credentials");
        alert(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login error. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-white">
      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-4">
        <img
          src={Logo}
          alt="Logo"
          className="w-[150px] h-auto object-contain"
        />

        <div className="space-x-8 hidden md:flex text-sm font-medium">
          <button
            onClick={() => setActiveSection("home")}
            className="hover:text-blue-600"
          >
            Home
          </button>
          <button
            onClick={() => setActiveSection("login")}
            className="hover:text-blue-600"
          >
            Admin
          </button>
          <button
            onClick={() => setActiveSection("about")}
            className="hover:text-blue-600"
          >
            About Us
          </button>
          <button
            onClick={() => setActiveSection("contact")}
            className="hover:text-blue-600"
          >
            Contact
          </button>
        </div>

        {/* Mobile icon */}
        <div className="md:hidden flex flex-col gap-[6px] cursor-pointer">
          <span className="w-6 h-[2px] bg-[#3264FA]"></span>
          <span className="w-6 h-[2px] bg-[#3264FA]"></span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex h-[calc(100%-80px)]">
        {/* Left Section */}
        <div className="w-1/2 flex items-center justify-center px-10">
          <AnimatePresence mode="wait">
            {activeSection === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h1 className="text-[64px] font-extrabold text-black leading-none">
                  Wellbeing <span className="text-[#3264FA]">360</span>
                </h1>
                <p className="tracking-widest text-[#3264FA] font-medium uppercase text-sm">
                  Unified Health Management System for Hemas Pharmaceuticals
                </p>
                <button
                  onClick={() => setActiveSection("login")}
                  className="bg-[#3264FA] text-white px-6 py-2 text-sm font-semibold rounded-full shadow-md hover:bg-[#204ecf] transition"
                >
                  Explore Now
                </button>
              </motion.div>
            )}

            {activeSection === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white p-8 rounded-xl "
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6 ">
                  Login to
                </h2>
                <h1 className="text-[64px] font-extrabold text-black leading-none">
                  Wellbeing <span className="text-[#3264FA]">360</span>
                </h1>

                <form onSubmit={handleLogin} className="space-y-5 mt-10">
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-1 font-medium text-sm"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                      placeholder="Enter your username"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-1 font-medium text-sm"
                    >
                      Password
                    </label>
                    <div className="relative mb-5">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="w-full py-3 bg-[#3264FA] text-white rounded-full font-semibold"
                  >
                    Login
                  </button>
                </form>
              </motion.div>
            )}

            {activeSection === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="text-gray-800 text-md max-w-xl"
              >
                <h1 className="text-[64px] font-extrabold text-black leading-none">
                  About Wellbeing <span className="text-[#3264FA]">360</span>
                </h1>
                <p className="tracking-widest text-[#3264FA] font-medium uppercase text-sm">
                  Unified Health Management System for Hemas Pharmaceuticals
                </p>{" "}
                <p>
                  In today’s corporate world, employee wellness is a major
                  focus, but Hemas Pharmaceuticals lacks an integrated system to
                  fully support it. Current tools are either focused on wellness
                  or digital health, but not both. There is no single platform
                  to manage doctor appointments, prescriptions, and medicine
                  purchases together.
                </p>
                <br />
                <p>
                  As a result, employees use disconnected systems, which reduces
                  efficiency and access to care. The lack of real-time data and
                  insights also makes it hard for the company to respond to
                  health needs quickly. A unified digital solution is essential
                  to improve employee health outcomes and help Hemas stand out
                  as a leader in corporate healthcare.
                </p>
              </motion.div>
            )}

            {activeSection === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5 }}
                className="text-gray-800 text-md space-y-4"
              >
                <h1 className="text-[64px] font-extrabold text-black leading-none">
                  Contact Wellbeing <span className="text-[#3264FA]">360</span>
                </h1>{" "}
                <p>
                  Email:{" "}
                  <a
                    href="mailto:tharushirod3@gmail.com"
                    className="text-blue-600 hover:underline"
                  >
                    tharushirod3@gmail.com
                  </a>
                </p>
                <p>
                  Phone:{" "}
                  <a
                    href="tel:+94763060241"
                    className="text-blue-600 hover:underline"
                  >
                    +94 76 306 0241
                  </a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Section: Fixed Image */}
        <div className="flex justify-end w-1/2 h-screen overflow-y-hidden mr-[20%]">
          <img
            src={LoginImg}
            alt="Login"
            className="object-cover w-[70%] h-[100%]"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
