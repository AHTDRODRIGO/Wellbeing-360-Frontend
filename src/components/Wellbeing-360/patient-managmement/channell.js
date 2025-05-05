import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce"; // Make sure to install lodash: npm install lodash.debounce

const Channell = ({ employeeNo }) => {
  const [data, setData] = useState({
    appointments: [],
    prescriptions: [],
    prescription_items: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    remarks: "",
    items: [
      {
        medicine_id: "",
        medicine_name: "",
        quantity_prescribed: "",
        dosage_instructions: "",
        from_inventory: true,
      },
    ],
  });
  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const fetchMedicalHistory = async () => {
    try {
      const res = await fetch(
        `http://localhost:8599/v1/wellbeing360/doctors/medical-history?employee_no=${employeeNo}`
      );
      const result = await res.json();
      if (result.success && result.data) {
        setData({
          appointments: result.data.appointments || [],
          prescriptions: result.data.prescriptions || [],
          prescription_items: result.data.prescription_items || [],
        });
      }
    } catch (err) {
      console.error("Error fetching medical history:", err);
    } finally {
      setLoading(false);
    }
  };
  const searchInventory = async (name) => {
    if (!name) return setSuggestions([]);
    try {
      const res = await fetch(
        `http://localhost:8599/v1/wellbeing360/inventry/search?name=${name}`
      );
      const result = await res.json();
      if (result.success) setSuggestions(result.data);
    } catch (err) {
      console.error("Inventory search error:", err);
      setSuggestions([]);
    }
  };

  const debouncedSearch = debounce(searchInventory, 300);

  return (
    <div className="flex gap-6 p-6">
      {/* LEFT COLUMN */}
      <div className="w-1/2 space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-3 text-blue-700">Appointments</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : data.appointments.length > 0 ? (
            <ul className="space-y-2">
              {data.appointments.map((a, idx) => (
                <li
                  key={idx}
                  onClick={() => setSelectedAppointment(a)}
                  className="cursor-pointer bg-blue-100 hover:bg-blue-200 p-3 rounded shadow-sm"
                >
                  <p>
                    <b>{a.appointment_date}</b> - {a.doctor_name}
                  </p>
                  <p className="text-sm text-gray-600">{a.specialization}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No appointments.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3 text-purple-700">
            Prescriptions
          </h2>
          {data.prescriptions.length > 0 ? (
            <ul className="space-y-2">
              {data.prescriptions.map((p) => (
                <li
                  key={p.prescription_id}
                  onClick={() => setSelectedPrescription(p)}
                  className="cursor-pointer bg-purple-100 hover:bg-purple-200 p-3 rounded shadow-sm"
                >
                  <p>
                    <b>{p.issued_date}</b> - {p.doctor_name}
                  </p>
                  <p className="text-sm text-gray-600 italic">{p.remarks}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No prescriptions.</p>
          )}
        </div>
        <button
          onClick={() => setShowPrescriptionModal(true)}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Issue Prescription
        </button>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-1/2 space-y-6">
        {selectedAppointment && (
          <div className="bg-blue-50 p-5 rounded shadow relative">
            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-2 right-2 text-sm text-gray-500 hover:text-red-600"
              title="Close"
            >
              ❌
            </button>
            <h3 className="text-lg font-semibold mb-2 text-blue-800">
              Appointment Details
            </h3>
            <p>
              <b>Date:</b> {selectedAppointment.appointment_date}
            </p>
            <p>
              <b>Status:</b> {selectedAppointment.appointment_status}
            </p>
            <p>
              <b>Doctor:</b> {selectedAppointment.doctor_name}
            </p>
            <p>
              <b>Specialty:</b> {selectedAppointment.specialization}
            </p>
            <p>
              <b>Time:</b> {selectedAppointment.start_time} -{" "}
              {selectedAppointment.end_time}
            </p>
          </div>
        )}

        {selectedPrescription && (
          <div className="bg-purple-50 p-5 rounded shadow relative">
            <button
              onClick={() => setSelectedPrescription(null)}
              className="absolute top-2 right-2 text-sm text-gray-500 hover:text-red-600"
              title="Close"
            >
              ❌
            </button>
            <h3 className="text-lg font-semibold mb-2 text-purple-800">
              Prescription Details
            </h3>
            <p>
              <b>Date:</b> {selectedPrescription.issued_date}
            </p>
            <p>
              <b>Doctor:</b> {selectedPrescription.doctor_name}
            </p>
            <p>
              <b>Remarks:</b>{" "}
              <span className="italic">
                {selectedPrescription.remarks || "-"}
              </span>
            </p>
            <hr className="my-3" />
            <p className="font-semibold mb-1">Medicines:</p>
            <ul className="pl-4 list-disc text-sm text-gray-700">
              {data.prescription_items
                .filter(
                  (m) =>
                    m.prescription_id === selectedPrescription.prescription_id
                )
                .map((m, idx) => (
                  <li key={idx}>
                    <b>{m.medicine_name}</b> – {m.quantity_prescribed} pcs –{" "}
                    {m.dosage_instructions}
                    <span
                      className={`ml-2 text-xs font-medium ${
                        m.from_inventory ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {m.from_inventory ? "Inventory" : "Outside"}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}
        {showPrescriptionModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white rounded-lg w-[600px] p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-lg"
              >
                ❌
              </button>

              <h2 className="text-xl font-bold mb-4 text-green-700">
                📝 Issue Prescription
              </h2>

              {/* Remarks */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={prescriptionForm.remarks}
                  onChange={(e) =>
                    setPrescriptionForm({
                      ...prescriptionForm,
                      remarks: e.target.value,
                    })
                  }
                />
              </div>

              {/* Medicine Items */}
              <div className="space-y-4">
                {prescriptionForm.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border rounded p-4 space-y-2 relative"
                  >
                    {prescriptionForm.items.length > 1 && (
                      <button
                        onClick={() => {
                          const newItems = [...prescriptionForm.items];
                          newItems.splice(index, 1);
                          setPrescriptionForm({
                            ...prescriptionForm,
                            items: newItems,
                          });
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                      >
                        ✖
                      </button>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Medicine Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-2 py-1 border rounded"
                          value={item.medicine_name}
                          onChange={async (e) => {
                            const value = e.target.value;
                            const newItems = [...prescriptionForm.items];
                            newItems[index].medicine_name = value;
                            newItems[index].medicine_id = "";
                            newItems[index].from_inventory = false;
                            setPrescriptionForm({
                              ...prescriptionForm,
                              items: newItems,
                            });
                            setSearchTerm(value);
                            debouncedSearch(value);
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              focusedIndex !== null &&
                              suggestions[focusedIndex]
                            ) {
                              const selected = suggestions[focusedIndex];
                              const newItems = [...prescriptionForm.items];
                              newItems[index].medicine_name = selected.name;
                              newItems[index].medicine_id =
                                selected.medicine_id;
                              newItems[index].from_inventory = true;
                              setPrescriptionForm({
                                ...prescriptionForm,
                                items: newItems,
                              });
                              setSuggestions([]);
                              setFocusedIndex(null);
                              e.preventDefault();
                            }
                          }}
                          onFocus={() => {
                            if (searchTerm.trim()) debouncedSearch(searchTerm);
                          }}
                        />
                        {suggestions.length > 0 && (
                          <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow">
                            {suggestions.map((s, idx) => (
                              <li
                                key={s.medicine_id}
                                onClick={() => {
                                  const newItems = [...prescriptionForm.items];
                                  newItems[index].medicine_name = s.name;
                                  newItems[index].medicine_id = s.medicine_id;
                                  newItems[index].from_inventory = true;
                                  setPrescriptionForm({
                                    ...prescriptionForm,
                                    items: newItems,
                                  });
                                  setSuggestions([]);
                                }}
                                className={`px-3 py-1 cursor-pointer hover:bg-gray-200 ${
                                  focusedIndex === idx ? "bg-gray-100" : ""
                                }`}
                                onMouseEnter={() => setFocusedIndex(idx)}
                              >
                                {s.name} – {s.description}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          className="w-full px-2 py-1 border rounded"
                          value={item.quantity_prescribed}
                          onChange={(e) => {
                            const newItems = [...prescriptionForm.items];
                            newItems[index].quantity_prescribed =
                              e.target.value;
                            setPrescriptionForm({
                              ...prescriptionForm,
                              items: newItems,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Dosage Instructions
                      </label>
                      <input
                        type="text"
                        className="w-full px-2 py-1 border rounded"
                        value={item.dosage_instructions}
                        onChange={(e) => {
                          const newItems = [...prescriptionForm.items];
                          newItems[index].dosage_instructions = e.target.value;
                          setPrescriptionForm({
                            ...prescriptionForm,
                            items: newItems,
                          });
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.from_inventory
                        ? "🟢 Selected from Inventory"
                        : "🟡 Manually entered (not in inventory)"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add More */}
              <div className="mt-4 text-right">
                <button
                  onClick={() =>
                    setPrescriptionForm({
                      ...prescriptionForm,
                      items: [
                        ...prescriptionForm.items,
                        {
                          medicine_id: "",
                          medicine_name: "",
                          quantity_prescribed: "",
                          dosage_instructions: "",
                          from_inventory: true,
                        },
                      ],
                    })
                  }
                  className="text-blue-600 hover:underline text-sm"
                >
                  ➕ Add Another Medicine
                </button>
              </div>

              {/* Submit */}
              <div className="mt-6">
                <button
                  onClick={() => {
                    console.log("Prescription payload 👉", prescriptionForm);
                    setShowPrescriptionModal(false);
                    // TODO: Call API here
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                  ✅ Submit Prescription
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Channell;
