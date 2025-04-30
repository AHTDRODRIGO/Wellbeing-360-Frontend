import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFilePrescription,
  FaCloudUploadAlt,
  FaComments,
  FaMoneyCheckAlt,
  FaChartBar,
  FaBuilding,
} from "react-icons/fa";
import PrivateOrders from "./PrivateOrders";
import Payments from "./Payments";



function Pharmacy() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeView, setActiveView] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);
  const renderActiveView = () => {
    switch (activeView) {
      case "PrivateOrders":
        return <PrivateOrders />;
      // case "NHSUploaded":
      //   return <NHSUploaded />;
      // case "Messages":
      //   return <Messages />;
      case "Payments":
        return <Payments />;
      // case "Statistics":
      //   return <Statistics />;
      // case "Organization":
      //   return <Organization />;
      default:
        return null;
    }
  };
  
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:8599/v1/wellbeing360/oder/all"
      );
      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost:8599/v1/wellbeing360/oder/by-oder-id?order_id=${orderId}`
      );
      const result = await response.json();
      if (result.success) {
        setSelectedOrder(result.data);
        setShowOrderModal(true);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const stepStatus = (status) => {
    switch (status.toLowerCase()) {
      case "placed":
        return 0;
      case "processing":
        return 1;
      case "completed":
        return 2;
      case "delivered":
        return 3;
      case "ready_to_pickup":
        return 4;
      default:
        return 0;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.employee_no
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      activeStatus === "All" ||
      order.order_status.toLowerCase() ===
        activeStatus.toLowerCase().replaceAll(" ", "_");
    return matchesSearch && matchesStatus;
  });

  const handleUpdateOrder = async (order) => {
    try {
      let nextStatus = "";
      let body = {};

      if (order.order_status === "completed") {
        nextStatus = "delivered";
        body = { status: nextStatus };
      } else if (order.order_status === "delivered") {
        nextStatus = "ready_to_pickup";
        body = { status: nextStatus };
      } else if (order.order_status === "placed") {
        nextStatus = "processing";
        body = { status: nextStatus };
      } else if (order.order_status === "processing") {
        nextStatus = "completed";
        body = { status: nextStatus, payment_method: "online" };
      } else {
        alert("No further updates available.");
        return;
      }

      const response = await fetch(
        `http://localhost:8599/v1/wellbeing360/oder/update-order-status/${order.order_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert(`Order successfully updated to ${nextStatus}`);
        fetchOrders();
        setShowOrderModal(false);
      } else {
        alert("Failed to update order status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("An error occurred.");
    }
  };



  return (
    <div className="p-6 bg-gray-100 min-h-screen font-montserrat">
      {/* Header Icons */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        {[
          {
            icon: <FaFilePrescription />,
            title: "Private Orders",
            component: "PrivateOrders",
          },
          {
            icon: <FaCloudUploadAlt />,
            title: "NHS Uploaded",
            component: "NHSUploaded",
          },
          { icon: <FaComments />, title: "Messages", component: "Messages" },
          {
            icon: <FaMoneyCheckAlt />,
            title: "Payments",
            component: "Payments",
          },
          {
            icon: <FaChartBar />,
            title: "Statistics",
            component: "Statistics",
          },
          {
            icon: <FaBuilding />,
            title: "Organization",
            component: "Organization",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={() => setActiveView(item.component)}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center hover:bg-gray-50 transition cursor-pointer"
          >
            <div className="text-3xl text-blue-600 mb-2">{item.icon}</div>
            <p className="text-sm text-gray-600">{item.title}</p>
          </div>
        ))}
      </div>

      {/* View Switch */}
      {activeView ? (
        <div>
          <div className="mb-4">
            <button
              className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 text-sm"
              onClick={() => setActiveView(null)}
            >
              ← Back to Orders
            </button>
          </div>
          {renderActiveView()}
        </div>
      ) : (
        <>
          {/* Status Filter */}
          <div className="flex gap-4 mb-6 overflow-x-auto">
            {[
              "All",
              "Placed",
              "Processing",
              "Completed",
              "Delivered",
              "Ready to Pickup",
            ].map((status) => (
              <div
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`px-4 py-2 rounded-full shadow-md text-sm cursor-pointer ${
                  activeStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                }`}
              >
                {status}
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="mb-6 flex justify-end">
            <input
              type="text"
              placeholder="Search by Employee No..."
              className="border border-gray-300 rounded-l-lg p-2 w-64 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg"
              onClick={fetchOrders}
            >
              Search
            </button>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50 text-gray-600 text-left text-sm">
                <tr>
                  <th className="p-4">Customer Info</th>
                  <th className="p-4">Order Info</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Timeline</th>
                  <th className="p-4">Total Cost</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => (
                  <tr
                    key={idx}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      {order.employee_no}
                      <div className="text-xs text-gray-400">Employee</div>
                    </td>
                    <td className="p-4">{order.order_id}</td>
                    <td className="p-4">
                      {order.items?.[0]?.medicine_id || "No Items"}
                    </td>
                    <td className="p-4">
                      Assigned to Pharmacy
                      <div className="text-xs text-gray-400">
                        {order.placed_date?.slice(0, 10)}
                      </div>
                    </td>
                    <td className="p-4 font-bold">
                      £{parseFloat(order.total_price || 0).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => fetchOrderDetails(order.order_id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-400">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Order Modal */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-lg p-8 w-[900px] max-w-3xl shadow-xl relative">
              <button
                className="absolute top-3 right-4 text-gray-400 hover:text-black text-2xl"
                onClick={() => setShowOrderModal(false)}
              >
                ✖
              </button>
              <h2 className="text-2xl font-bold mb-6 text-center">
                Order #{selectedOrder.order_id}
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6 text-gray-700">
                <div>
                  <b>Employee No:</b> {selectedOrder.employee_no}
                </div>
                <div>
                  <b>Pharmacy Type:</b> {selectedOrder.pharmacy_type}
                </div>
                <div>
                  <b>Delivery Type:</b> {selectedOrder.delivery_type}
                </div>
                <div>
                  <b>Order Status:</b> {selectedOrder.order_status}
                </div>
                <div className="col-span-2">
                  <b>Notes:</b> {selectedOrder.notes}
                </div>
              </div>

              {/* Stepper */}
              <div className="flex items-center justify-between mb-10 relative">
                {[
                  "Placed",
                  "Processing",
                  "Completed",
                  "Delivered",
                  "Ready to pickup",
                ].map((step, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center relative w-1/5"
                  >
                    {index !== 0 && (
                      <div
                        className={`absolute top-5 -left-1/2 w-full h-1 ${
                          stepStatus(selectedOrder.order_status) >= index
                            ? "bg-purple-500"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                        stepStatus(selectedOrder.order_status) >= index
                          ? "bg-purple-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {stepStatus(selectedOrder.order_status) >= index
                        ? "✓"
                        : ""}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-center">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              {/* Items */}
              <h3 className="text-lg font-bold mb-3">Ordered Medicines:</h3>
              <ul className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
                {selectedOrder.items.map((item) => (
                  <li
                    key={item.item_id}
                    className="border rounded-md p-3 bg-gray-50"
                  >
                    <div className="font-semibold">
                      {item.medicine_name || "Outdoor Medicine"}
                    </div>
                    <div className="text-sm">
                      Quantity: {item.quantity_requested}
                    </div>
                    <div className="text-xs text-gray-400">
                      Source:{" "}
                      {item.from_inventory ? "Inventory" : "Outdoor Pharmacy"}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Update Button */}
              <div className="text-center">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold text-lg"
                  onClick={() => handleUpdateOrder(selectedOrder)}
                >
                  {selectedOrder.order_status === "completed"
                    ? "Update Order to Delivered"
                    : selectedOrder.order_status === "delivered"
                    ? "Update Order to Ready to Pickup"
                    : "Update Order Status"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Pharmacy;
