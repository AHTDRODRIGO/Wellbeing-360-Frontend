import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import LoginImg from "../../../assets/right.jpg";
import Logo from "../../../assets/logo.png";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleExplore = () => setShowLogin(true);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = (e) => {
    e.preventDefault();
    // handle login logic here
  };

  return (
    <div className="h-screen w-[100%] overflow-hidden bg-white">
      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-4 ">
        {/* Logo */}
        <img
          src={Logo}
          alt="Logo"
          className="w-[150px] h-auto object-contain"
        />

        {/* Desktop links */}
        <div className="space-x-8 hidden md:flex text-sm font-medium">
          <a href="#" className="hover:text-blue-600">
            Home
          </a>
          <a href="#" className="hover:text-blue-600">
            Admin
          </a>
          <a href="#" className="hover:text-blue-600">
            About Us
          </a>
          <a href="#" className="hover:text-blue-600">
            Contact
          </a>
        </div>

        {/* Mobile blue double-line icon (always visible on small screens) */}
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
            {!showLogin ? (
              <motion.div
                key="intro"
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
                  onClick={handleExplore}
                  className="bg-[#3264FA] text-white px-6 py-2 text-sm font-semibold rounded-full shadow-md hover:bg-[#204ecf] transition"
                >
                  Explore Now
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white p-8 rounded-xl "
              >
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                  Login
                </h2>
                <form onSubmit={handleLogin} className="space-y-5">
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
                    type="submit"
                    className="w-full py-3 bg-[#3264FA] text-white rounded-full mt-5 font-semibold"
                  >
                    Login
                  </button>
                </form>
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
