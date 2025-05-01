import React, { useEffect, useState } from "react";

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const fetchStats = async () => {
    if (!date) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8599/v1/wellbeing360/oder/get-statistics?date=${date}`
      );
      const data = await res.json();
      if (data.success) {
        const d = data.data;

        // Clean the API response to expected frontend structure
        setStats({
          orders_per_day:
            d.orders_per_day?.reduce(
              (sum, entry) => sum + Number(entry.total_orders || 0),
              0
            ) || "-",
          top_inventory_item: {
            name: d.top_inventory_item?.medicine_name || "-",
          },
          total_income:
            d.income_per_day
              ?.reduce((sum, entry) => sum + Number(entry.income || 0), 0)
              .toFixed(2) || "-",
          top_out_of_stock_item: {
            name: d.most_out_of_stock_item?.medicine_name || "-",
          },
          inventory_count: d.inventory_count || "-",
          total_prescriptions: d.total_prescriptions || "-",
          payment_success_count: d.payment_success_count || "-",
          recent_orders: d.orders_per_day || [],
        });
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(); // fetch on load or date change
  }, [date]);

  return (
    <div className="p-6 font-sans min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">📊 Statistics</h2>
        <div className="flex gap-2">
          <input
            type="date"
            className="border border-gray-300 rounded px-4 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Card */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                We only deliver results.
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Real-time stats from the last 5 days.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.orders_per_day}
                  </p>
                  <p className="text-sm text-gray-600">Orders Per Day</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.top_inventory_item?.name}
                  </p>
                  <p className="text-sm text-gray-600">Top Item</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    £{stats.total_income}
                  </p>
                  <p className="text-sm text-gray-600">Daily Income</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.top_out_of_stock_item?.name}
                  </p>
                  <p className="text-sm text-gray-600">Out of Stock</p>
                </div>
              </div>
            </div>

            {/* Bottom Card */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                Let’s build something great.
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Combining Inventory, Payments, and Prescriptions
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-indigo-600">
                    {stats.orders_per_day}
                  </p>
                  <p className="text-sm text-gray-600">Order Count</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-indigo-600">
                    {stats.inventory_count}
                  </p>
                  <p className="text-sm text-gray-600">Inventory Items</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-indigo-600">
                    {stats.total_prescriptions}
                  </p>
                  <p className="text-sm text-gray-600">Prescriptions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-indigo-600">
                    {stats.payment_success_count}
                  </p>
                  <p className="text-sm text-gray-600">Successful Payments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              📅 Orders in the Last 5 Days
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              {stats.recent_orders.map((entry, idx) => (
                <div key={idx} className="bg-gray-100 rounded-lg py-3">
                  <p className="text-lg font-bold text-blue-600">
                    {entry.total_orders}
                  </p>
                  <p className="text-sm text-gray-600">{entry.day}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No data loaded. Please select a date.</p>
      )}
    </div>
  );
};

export default Statistics;
