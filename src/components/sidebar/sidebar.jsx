import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import sidebarData from "./sidebar_data";
import { RiLogoutCircleRLine } from "react-icons/ri";
import Logo from "../../../src/assets/logobg.png"
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [expandedMenu, setExpandedMenu] = useState({});
  const [isShaking, setIsShaking] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSubMenu = (name) => {
    setExpandedMenu((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const isSelectedPath = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const renderSubModules = (subModules, parentPath = "") => {
    return (
      <ul className={`ml-4 ${!isOpen && "hidden"}`}>
        {subModules.map((subModule) => {
          const currentPath = `${parentPath}${subModule.url}`;
          const isSelected = isSelectedPath(currentPath);
          return (
            <li
              key={subModule._id}
              className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-300 ease-in-out ${
                isSelected
                  ? "bg-[#e0e7ff] text-[#4f46e5] font-bold"
                  : "text-gray-600 hover:text-[#4f46e5]"
              }`}
            >
              <Link to={currentPath} className="flex items-center gap-2 w-full">
                {subModule.icon && (
                  <span className="text-xl">{subModule.icon}</span>
                )}
                {isOpen && <span>{subModule.name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-white p-4 shadow-xl transition-all duration-300 ease-in-out flex flex-col justify-between ${
        isOpen ? "w-64" : "w-20"
      } ${isShaking ? "animate-shakeX" : ""}`}
      onMouseEnter={() => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        !isOpen && toggleSidebar();
      }}
      onMouseLeave={() => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        isOpen && toggleSidebar();
      }}
    >
      <div className="mb-10 flex items-center gap-3">
        <div className="bg-white text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
        <img
          src={Logo}
          alt="Logo"
          className="w-[150px] h-auto object-contain"
        />        </div>
        {isOpen && (
          <div>
            <h1 className="text-md font-semibold text-gray-900">Wellbeing 360</h1>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {sidebarData.map((module) => {
            const isModuleSelected = isSelectedPath(module.url);
            const hasSubModules =
              module.subModules && module.subModules.length > 0;
            return (
              <li key={module._id}>
                <div
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-300 ease-in-out ${
                    isModuleSelected
                      ? "bg-[#4f46e5] text-white"
                      : "hover:bg-[#f3f4f6] text-gray-700"
                  }`}
                  onClick={() =>
                    hasSubModules
                      ? toggleSubMenu(module._id)
                      : navigate(module.url)
                  }
                >
                  <span className="text-xl">{module.icon}</span>
                  {isOpen && (
                    <span className="ml-3 font-medium">{module.name}</span>
                  )}
                  {isOpen && hasSubModules && (
                    <span className="ml-auto">
                      {expandedMenu[module._id] ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}
                    </span>
                  )}
                </div>
                {expandedMenu[module._id] &&
                  hasSubModules &&
                  renderSubModules(module.subModules, module.url)}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="pt-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 justify-center text-white bg-red-500 py-2 px-4 rounded-lg hover:bg-red-600 w-full"
        >
          <RiLogoutCircleRLine />
          {isOpen && <span className="font-semibold">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
