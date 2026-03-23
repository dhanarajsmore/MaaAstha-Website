import React, { useState, useEffect } from "react";

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("active");

  const loadVolunteers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/volunteers/all");
      const json = await res.json();
      if (json.success) setVolunteers(json.data);
    } catch (e) {
      console.error("Failed to load volunteers", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVolunteers();
  }, []);

  const handleResolve = async (id) => {
    if (!window.confirm("Mark this application as resolved?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/volunteers/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Resolved" }),
      });
      if (res.ok) loadVolunteers();
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bhai, pakka delete karna hai? Yeh wapas nahi aayega.")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/volunteers/delete/${id}`, { method: "DELETE" });
      if (res.ok) loadVolunteers();
    } catch (e) {
      alert("Delete failed!");
    }
  };

  const filteredVolunteers = volunteers.filter((v) => 
    viewMode === "active" ? v.status !== "Resolved" : v.status === "Resolved"
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-ngo-dark dark:text-white font-heading">Volunteers</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">Manage incoming help requests</span>
        </div>
        
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode("active")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
              viewMode === "active" ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Active Requests
          </button>
          <button
            onClick={() => setViewMode("resolved")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
              viewMode === "resolved" ? "bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Resolved History
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm border-b dark:border-gray-700">
              <th className="p-4 font-semibold uppercase tracking-wider">Name</th>
              <th className="p-4 font-semibold uppercase tracking-wider">Contact</th>
              <th className="p-4 font-semibold uppercase tracking-wider">How they can help</th>
              <th className="p-4 font-semibold uppercase tracking-wider">Date</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">Loading volunteers...</td></tr>
            ) : filteredVolunteers.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">No {viewMode} applications.</td></tr>
            ) : (
              filteredVolunteers.map((v) => (
                <tr key={v._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{v.name}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{v.phone}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 max-w-xs truncate" title={v.helpText}>{v.helpText}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{new Date(v.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="p-4 flex justify-center items-center gap-2">
                    {v.status !== "Resolved" ? (
                      <button 
                        onClick={() => handleResolve(v._id)}
                        className="text-xs font-bold uppercase bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1.5 rounded-md hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                      >
                        ✅ Resolve
                      </button>
                    ) : (
                      <span className="text-xs font-bold uppercase text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-md">
                        Resolved
                      </span>
                    )}
                    <button onClick={() => handleDelete(v._id)} className="text-xs font-bold bg-red-50 text-red-500 px-3 py-1.5 rounded-md hover:bg-red-500 hover:text-white transition-all shadow-sm">
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

export default Volunteers;