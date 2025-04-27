import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDollarSign } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import { format } from "date-fns";

function ViewItems() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total_products: 0,
    total_stock: 0,
    total_stock_value: 0,
    unavailable_items: [],
    unavailable_count: 0,
  });
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);

  useEffect(() => {
    fetchMedicines();
    fetchStatistics();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch(
        "http://localhost:8599/v1/wellbeing360/inventry/all"
      );
      const result = await response.json();
      if (result.success) {
        setMedicines(result.data);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(
        "http://localhost:8599/v1/wellbeing360/inventry/statistics"
      );
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchMedicines();
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8599/v1/wellbeing360/inventry/search?name=${searchTerm}`
      );
      const result = await response.json();
      if (result.success) {
        setMedicines(result.data);
      }
    } catch (error) {
      console.error("Error searching medicines:", error);
    }
  };

  const getPerformance = (stock) => {
    if (stock >= 700) return "Excellent";
    if (stock >= 300) return "Good";
    return "Bad";
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen font-montserrat">
      {/* Top Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-gray-400 text-sm">Total Products</h2>
          <p className="text-3xl font-bold">{stats.total_products} Products</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-gray-400 text-sm">Total Stock</h2>
          <p className="text-3xl font-bold">{stats.total_stock} Items</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <h2 className="text-gray-400 text-sm">Total Stock Value</h2>
          <p className="text-3xl font-bold text-green-500">
            ${stats.total_stock_value}
          </p>
        </div>
        <div
          className="p-6 bg-white rounded-xl shadow-md text-center cursor-pointer hover:bg-gray-50 transition"
          onClick={() => setShowUnavailableModal(true)}
        >
          <h2 className="text-gray-400 text-sm">Unavailable Items</h2>
          <p className="text-3xl font-bold text-red-500">
            {stats.unavailable_count}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex justify-end">
        <input
          type="text"
          placeholder="Search medicine by name..."
          className="border border-gray-300 rounded-l-lg p-2 focus:outline-none w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg"
        >
          Search
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        {medicines.map((item, index) => (
          <motion.div
            key={item.medicine_id}
            className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-6 mb-6 last:border-none last:pb-0 last:mb-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Left: Product Image + Details */}
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-blue-100 flex items-center justify-center rounded-full mt-2">
                <MdOutlineInventory2 className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.description}</p>
                <p className="text-gray-400 text-xs mt-1">
                  Dosage: {item.dosage_frequency}
                </p>
                <p className="text-gray-400 text-xs">
                  Added on: {format(new Date(item.createdAt), "PPP")}
                </p>
              </div>
            </div>

            {/* Center: Performance + Stock + Price */}
            <div className="flex flex-wrap justify-between md:gap-10 gap-6 mt-4 md:mt-0">
              <div className="text-center">
                <p className="text-sm text-gray-400">Performance</p>
                <p
                  className={`font-semibold ${
                    getPerformance(item.quantity_available) === "Excellent"
                      ? "text-green-500"
                      : getPerformance(item.quantity_available) === "Good"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {getPerformance(item.quantity_available)}
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-400">Stock</p>
                <p className="font-bold">{item.quantity_available}</p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-400">Product Price</p>
                <div className="flex items-center justify-center gap-1 font-bold">
                  <FaDollarSign className="text-green-500" />
                  {parseFloat(item.unit_price).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Right: Availability */}
            <div className="text-right mt-4 md:mt-0">
              <span
                className={`text-sm font-bold ${
                  item.availability_status ? "text-green-500" : "text-red-500"
                }`}
              >
                {item.availability_status ? "Available" : "Out of Stock"}
              </span>
              <p className="text-gray-400 text-xs">{item.unit_type}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Unavailable Items Modal */}
      <AnimatePresence>
        {showUnavailableModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
              <button
                className="absolute top-2 right-4 text-gray-400 hover:text-black"
                onClick={() => setShowUnavailableModal(false)}
              >
                ✖
              </button>
              <h2 className="text-xl font-bold mb-4">Unavailable Medicines</h2>
              {stats.unavailable_items.length > 0 ? (
                <ul className="space-y-2">
                  {stats.unavailable_items.map((item) => (
                    <li
                      key={item.medicine_id}
                      className="border p-2 rounded-md"
                    >
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        Stock: {item.quantity_available}
                      </div>
                      <div className="text-sm text-gray-500">
                        Unit Price: ${parseFloat(item.unit_price).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No unavailable medicines.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ViewItems;
