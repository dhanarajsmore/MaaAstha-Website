import React, { useState, useEffect } from "react";

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("pending");

  const loadDonations = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/donations/all");
      const json = await res.json();
      if (json.success) setDonations(json.data);
    } catch (e) {
      console.error("Failed to load donations", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this as ${newStatus}?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/donations/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) loadDonations();
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bhai, pakka delete karna hai? Yeh wapas nahi aayega.")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/donations/delete/${id}`, { method: "DELETE" });
      if (res.ok) loadDonations();
    } catch (e) {
      alert("Delete failed!");
    }
  };

  const filteredDonations = donations.filter((d) => {
    const currentStatus = d.status || "Pending";
    if (viewMode === "pending") return currentStatus === "Pending";
    return currentStatus !== "Pending";
  });

  const totalVerifiedAmount = donations
    .filter((d) => d.status === "Verified")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-ngo-dark dark:text-white font-heading">Donations</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">Verify UTRs against your bank app</span>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg border border-green-100 dark:border-green-800/30 text-right">
            <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">Total Verified Funds</p>
            <p className="text-xl font-bold text-green-700 dark:text-green-300">₹{totalVerifiedAmount.toLocaleString("en-IN")}</p>
          </div>

          <div className="flex gap-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg w-fit">
            <button
              onClick={() => setViewMode("pending")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                viewMode === "pending" ? "bg-white dark:bg-gray-600 text-yellow-600 dark:text-yellow-400 shadow-sm" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Pending Verification
            </button>
            <button
              onClick={() => setViewMode("history")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                viewMode === "history" ? "bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Verified / Rejected
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm border-b dark:border-gray-700">
              <th className="p-4 font-semibold uppercase tracking-wider">Donor Info</th>
              <th className="p-4 font-semibold uppercase tracking-wider">Amount</th>
              <th className="p-4 font-semibold uppercase tracking-wider">Ref / UTR ID</th>
              <th className="p-4 font-semibold uppercase tracking-wider">Date</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">Loading donations...</td></tr>
            ) : filteredDonations.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">No {viewMode} donations.</td></tr>
            ) : (
              filteredDonations.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-800 dark:text-gray-200">{d.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{d.phone} | {d.email || "No Email"}</div>
                  </td>
                  <td className="p-4 font-bold text-green-600 dark:text-green-400">₹{d.amount}</td>
                  <td className="p-4">
                    <span className="font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">{d.referenceId || "N/A"}</span>
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{new Date(d.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="p-4 flex justify-center items-center gap-2">
                    {viewMode === "pending" ? (
                      <>
                        <button onClick={() => handleUpdateStatus(d._id, "Verified")} className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-500 hover:text-white transition-all shadow-sm">
                          ✅ Verify
                        </button>
                        <button onClick={() => handleUpdateStatus(d._id, "Rejected")} className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-md hover:bg-yellow-500 hover:text-white transition-all shadow-sm">
                          ❌ Reject
                        </button>
                      </>
                    ) : (
                      <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-md ${d.status === "Verified" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                        {d.status}
                      </span>
                    )}
                    <button onClick={() => handleDelete(d._id)} className="text-xs font-bold bg-red-50 text-red-500 px-3 py-1.5 rounded-md hover:bg-red-500 hover:text-white transition-all shadow-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Donations;