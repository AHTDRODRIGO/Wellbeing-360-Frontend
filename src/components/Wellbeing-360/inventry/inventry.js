import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";

const Inventory = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Add Item to Inventory",
      bgColor: "bg-blue-50",
      iconBg: "border-blue-400",
      icon: <FaUsers className="text-blue-500 text-2xl" />,
      onClick: () => navigate("/inventory-add-items"), // Update your route here
    },
    {
      title: "Inventory Management",
      bgColor: "bg-blue-50",
      iconBg: "border-blue-400",
      icon: <TbListDetails className="text-blue-500 text-2xl" />,
      onClick: () => navigate("/inventory-view-items"), // Update your route here
    },
  ];

  return (
    <div className="mx-5 mt-5 font-montserrat">
      <div>
        <p className="text-[24px] font-bold mb-5">Inventory Management</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="rounded-lg border shadow-md p-3 flex flex-col cursor-pointer hover:shadow-lg transition duration-300"
            onClick={card.onClick}
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
};

export default Inventory;
