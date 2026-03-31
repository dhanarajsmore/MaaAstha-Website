import React, { useState, useEffect } from "react";
import { Eye, Handshake, Trash2, Search, RefreshCw, UserMinus, Skull, LogOut } from "lucide-react";

const Records = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("current");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [reunionModal, setReunionModal] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [reunionForm, setReunionForm] = useState({
    dateOfLeaving: "", receiverName: "", receiverRelation: "", 
    receiverContact: "", receiverIdProof: "", receiverAddress: "",
  });

  const adminRole = localStorage.getItem("adminRole");

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/persons/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setRecords(data.data);
    } catch (error) { console.error("Fetch error:", error); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleQuickStatusUpdate = async (personId, newStatus) => {
    if (!window.confirm(`Update status to "${newStatus}"?`)) return;
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/persons/update/${personId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) { fetchRecords(); alert(`Status: ${newStatus}`); }
    } catch (error) { alert("Failed to update."); }
    finally { setIsUpdating(false); }
  };

  const handleReunionSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/persons/update/${reunionModal._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "Reunited", reunionDetails: reunionForm }),
      });
      if (response.ok) { setReunionModal(null); fetchRecords(); alert("Reunion logged!"); }
    } catch (error) { alert("Error saving details."); }
    finally { setIsUpdating(false); }
  };

  const filteredRecords = records.filter((record) => {
    if (viewMode === "current" && record.status !== "Sheltered") return false;
    if (viewMode === "reunited" && record.status !== "Reunited") return false;
    if (viewMode === "selfExited" && record.status !== "Self Exited") return false;
    if (viewMode === "escaped" && record.status !== "Escaped") return false;
    if (viewMode === "dead" && record.status !== "Dead") return false;

    const searchLower = searchTerm.toLowerCase();
    return (record.fullName || "").toLowerCase().includes(searchLower) || (record.address || "").toLowerCase().includes(searchLower);
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Shelter Records</h2>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border rounded-lg dark:text-white outline-none" />
            <button onClick={fetchRecords} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border hover:bg-slate-100 dark:text-white"><RefreshCw size={16} className={isLoading ? "animate-spin" : ""} /></button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg w-fit">
          {["current", "reunited", "selfExited", "escaped", "dead", "all"].map((mode) => (
            <button key={mode} onClick={() => setViewMode(mode)} className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${viewMode === mode ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-500"}`}>
              {mode === "selfExited" ? "Self Exited" : mode === "current" ? "In Shelter" : mode}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase text-slate-500 font-bold border-b dark:border-slate-800">
            <tr><th className="p-4">Name</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th></tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-800/50 text-sm">
            {filteredRecords.map((record) => (
              <tr key={record._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-medium dark:text-white">{record.fullName || record.name}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase border ${
                    record.status === "Reunited" ? "bg-emerald-100 text-emerald-700" :
                    record.status === "Escaped" ? "bg-orange-100 text-orange-700" :
                    record.status === "Dead" ? "bg-rose-100 text-rose-700" :
                    record.status === "Self Exited" ? "bg-blue-100 text-blue-700" : "bg-indigo-100 text-indigo-700"
                  }`}>{record.status}</span>
                </td>
                <td className="p-4 flex justify-center gap-1.5">
                   <button onClick={() => setSelectedPerson(record)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white"><Eye size={14} /></button>
                   {record.status === "Sheltered" && (
                    <>
                      <button onClick={() => setReunionModal(record)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white" title="Reunite"><Handshake size={14} /></button>
                      <button onClick={() => handleQuickStatusUpdate(record._id, "Self Exited")} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white" title="Self Exit"><LogOut size={14} /></button>
                      <button onClick={() => handleQuickStatusUpdate(record._id, "Escaped")} className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white" title="Escaped"><UserMinus size={14} /></button>
                      <button onClick={() => handleQuickStatusUpdate(record._id, "Dead")} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white" title="Dead"><Skull size={14} /></button>
                    </>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* (Keep the existing Modal codes for Reunion and selectedPerson from your original file) */}
    </div>
  );
};

export default Records;