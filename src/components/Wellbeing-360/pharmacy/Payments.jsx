import React, { useEffect, useState } from "react";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8599/v1/wellbeing360/oder/payments-all"
      );
      const result = await response.json();
      if (result.success) {
        setPayments(result.data);
        setFilteredPayments(result.data);
      } else {
        setError(result.message || "Failed to load payments.");
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [searchTerm, activeStatus, payments]);

  const filterPayments = () => {
    let result = [...payments];

    if (searchTerm) {
      result = result.filter((p) =>
        p.employee_no.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeStatus !== "All") {
      result = result.filter(
        (p) => p.payment_status.toLowerCase() === activeStatus.toLowerCase()
      );
    }

    setFilteredPayments(result);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      {/* Search */}
      <div className="mb-4 flex justify-between flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search by Employee No"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-64 focus:outline-none"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {["All", "Paid", "Pending", "Failed"].map((status) => (
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

      {/* Error & Loading */}
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className=" text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2">Payment ID</th>
              <th className="px-4 py-2">Employee No</th>
              <th className="px-4 py-2">Employee Name</th>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Method</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr
                key={payment.payment_id}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2">{payment.payment_id}</td>
                <td className="px-4 py-2">{payment.employee_no}</td>
                <td className="px-4 py-2">{payment.employee_name}</td>
                <td className="px-4 py-2">{payment.order_id}</td>
                <td className="px-4 py-2 font-medium text-gray-800">
                  £{parseFloat(payment.amount).toFixed(2)}
                </td>
                <td className="px-4 py-2 capitalize">
                  {payment.payment_method}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      payment.payment_status === "paid"
                        ? "bg-green-100 text-green-700"
                        : payment.payment_status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {payment.payment_status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(payment.payment_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
