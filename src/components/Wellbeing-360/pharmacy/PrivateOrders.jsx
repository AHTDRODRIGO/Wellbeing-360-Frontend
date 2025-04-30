import React, { useState } from "react";

const PrivateOrders = () => {
  const [employeeNo, setEmployeeNo] = useState("");
  const [employeeData, setEmployeeData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!employeeNo.trim()) return;

    setLoading(true);
    setError("");
    setEmployeeData(null);
    setOrders([]);

    try {
      const response = await fetch(
        `http://localhost:8599/v1/wellbeing360/oder/orders-by-employee?employee_no=${employeeNo}`
      );
      const result = await response.json();

      if (result.success) {
        setEmployeeData(result.data.employee);
        setOrders(result.data.orders);
      } else {
        setError(result.message || "No data found.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };
  const exportToCSV = () => {
    if (!orders.length) return;

    const headers = [
      "Order ID",
      "Pharmacy Type",
      "Delivery Type",
      "Status",
      "Placed Date",
      "Notes",
      "Items",
    ];

    const rows = orders.map((order) => {
      const itemDetails = order.items
        .map((item) => `${item.medicine_name} × ${item.quantity_requested}`)
        .join(" | ");
      return [
        order.order_id,
        order.pharmacy_type,
        order.delivery_type,
        order.order_status,
        order.placed_date?.slice(0, 10),
        order.notes || "",
        itemDetails,
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((val) => `"${val}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `employee_orders_${employeeNo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      {/* Search Section */}
      <div className="mb-6 flex gap-2 items-center">
        <input
          type="text"
          placeholder="Enter Employee No"
          value={employeeNo}
          onChange={(e) => setEmployeeNo(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-64 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Get Data
        </button>
      </div>

      {/* Loading & Error */}
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Result */}
      {employeeData && (
        <div className="mt-4">
          {/* Employee Info */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Employee Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium w-32">Name:</span>
                <span className="text-gray-900 font-semibold">
                  {employeeData.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium w-32">NIC:</span>
                <span className="text-gray-900 font-semibold">
                  {employeeData.nic}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium w-32">Designation:</span>
                <span className="text-gray-900 font-semibold">
                  {employeeData.designation}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium w-32">Department:</span>
                <span className="text-gray-900 font-semibold">
                  {employeeData.department}
                </span>
              </div>
            </div>
          </div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
            >
              Export as CSV
            </button>
          </div>

          {/* Orders Table */}
          <h3 className="text-lg font-bold mb-2">Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Order ID</th>
                  <th className="p-2 border">Pharmacy Type</th>
                  <th className="p-2 border">Delivery Type</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Placed Date</th>
                  <th className="p-2 border">Notes</th>
                  <th className="p-2 border">Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id} className="border-t">
                    <td className="p-2 border">{order.order_id}</td>
                    <td className="p-2 border">{order.pharmacy_type}</td>
                    <td className="p-2 border">{order.delivery_type}</td>
                    <td className="p-2 border">{order.order_status}</td>
                    <td className="p-2 border">
                      {order.placed_date?.slice(0, 10)}
                    </td>
                    <td className="p-2 border">{order.notes || "—"}</td>
                    <td className="p-2 border">
                      <ul className="list-disc pl-4">
                        {order.items.map((item) => (
                          <li key={item.item_id}>
                            {item.medicine_name} × {item.quantity_requested}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateOrders;
