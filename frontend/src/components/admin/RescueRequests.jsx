import React, { useState, useEffect } from "react";

const RescueRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("active");

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/rescue-requests/all");
      const json = await res.json();
      if (json.success) setRequests(json.data);
    } catch (e) {
      console.error("Failed to load rescues", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    if (!window.confirm(`Mark this alert as ${newStatus}?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/rescue-requests/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) loadRequests();
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bhai, pakka delete karna hai? Yeh wapas nahi aayega.")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/rescue-requests/delete/${id}`, { method: "DELETE" });
      if (res.ok) loadRequests();
    } catch (e) {
      alert("Delete failed!");
    }
  };

  const filteredRequests = requests.filter((r) => {
    const isResolved = r.status === "Rescued" || r.status === "Invalid";
    return viewMode === "active" ? !isResolved : isResolved;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-red-600 dark:text-red-500 font-heading">Emergency Alerts</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">Prioritize and manage rescues</span>
        </div>

        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode("active")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
              viewMode === "active" ? "bg-white dark:bg-gray-600 text-red-600 dark:text-red-400 shadow-sm" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Active Alerts
          </button>
          <button
            onClick={() => setViewMode("resolved")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
              viewMode === "resolved" ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 shadow-sm" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Past Alerts
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm border-b dark:border-gray-700">
              <th className="p-4 font-semibold uppercase tracking-wider">Location</th>
              <th className="p-4 font-semibold uppercase tracking-wider">Condition</th>
              <th className="p-4 font-semibold uppercase tracking-wider">Reporter</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-center">Photo</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">Loading alerts...</td></tr>
            ) : filteredRequests.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">No {viewMode} alerts.</td></tr>
            ) : (
              filteredRequests.map((r) => (
                <tr key={r._id} className="hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
                  <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{r.location}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{r.condition}</td>
                  <td className="p-4">
                    <div className="text-gray-800 dark:text-gray-200">{r.reporterName || "Anonymous"}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{r.reporterPhone}</div>
                  </td>
                  <td className="p-4 text-center">
                    {r.photoUrl ? (
                      <a href={`http://localhost:5000${r.photoUrl}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 font-medium underline text-sm">View</a>
                    ) : <span className="text-gray-400 text-sm">N/A</span>}
                  </td>
                  <td className="p-4 flex justify-center items-center gap-2">
                    {viewMode === "active" ? (
                      <>
                        {r.status !== "In Progress" && (
                          <button onClick={() => handleUpdateStatus(r._id, "In Progress")} className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-md hover:bg-yellow-500 hover:text-white transition-all shadow-sm">
                            ⏳ Progress
                          </button>
                        )}
                        <button onClick={() => handleUpdateStatus(r._id, "Rescued")} className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-500 hover:text-white transition-all shadow-sm">
                          ✅ Rescued
                        </button>
                        <button onClick={() => handleUpdateStatus(r._id, "Invalid")} className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-500 hover:text-white transition-all shadow-sm">
                          ❌ Invalid
                        </button>
                      </>
                    ) : (
                      <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-md ${r.status === "Rescued" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"}`}>
                        {r.status}
                      </span>
                    )}
                    <button onClick={() => handleDelete(r._id)} className="text-xs font-bold bg-red-50 text-red-500 px-3 py-1.5 rounded-md hover:bg-red-500 hover:text-white transition-all shadow-sm">
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

export default RescueRequests;