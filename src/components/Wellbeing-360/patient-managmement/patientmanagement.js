import React, { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

function PatientManagement() {
  const API_URL = process.env.REACT_APP_FRONTEND_URL;
  const navigate = useNavigate();

  const cards = [
    {
      title: "Patient History",
      bgColor: "bg-blue-50",
      iconBg: "border-blue-400",
      icon: <FaUsers className="text-blue-500 text-2xl" />,
      onClick: () => navigate("/patient-history"),
    },
    {
      title: "Patient Channeling",
      bgColor: "bg-blue-50",
      iconBg: "border-blue-400",
      icon: <TbListDetails className="text-blue-500 text-2xl" />,
      onClick: () => navigate("/Appoinment-history"),
    },
  ];

  return (
    <div className="mx-5 mt-5 font-montserrat">
      <p className="text-[24px] font-bold mb-5">Patient Management</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            className="rounded-lg border shadow-md p-4 flex flex-col cursor-pointer hover:shadow-lg transition"
          >
            <div className={`${card.bgColor} p-5 rounded-lg`}>
              <div
                className={`flex items-center justify-center border-dashed border-2 rounded-full h-16 w-16 mx-auto mb-4 ${card.iconBg}`}
              >
                {card.icon}
              </div>
            </div>
            <h3 className="text-center font-semibold text-lg mb-2">
              {card.title}
            </h3>

            <button className="mt-auto bg-blue-300 text-black rounded-lg px-4 py-2 hover:bg-black hover:text-white">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientManagement;
