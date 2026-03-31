import React, { useState, useEffect } from "react";
import { Eye, Handshake, Trash2, Search, RefreshCw, UserMinus, Skull, LogOut } from "lucide-react";

const Records = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("current");
  
  // States for Modals
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [reunionModal, setReunionModal] = useState(null);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [reunionForm, setReunionForm] = useState({
    dateOfLeaving: "",
    receiverName: "",
    receiverRelation: "",
    receiverContact: "",
    receiverIdProof: "",
    receiverAddress: "",
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
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const calculateDays = (arrival, leaving) => {
    if (!arrival) return "N/A";
    const start = new Date(arrival);
    const end = leaving ? new Date(leaving) : new Date();
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

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
      const response = await fetch(
        `http://localhost:5000/api/persons/update/${reunionModal._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "Reunited",
            reunionDetails: reunionForm,
          }),
        },
      );
      if (response.ok) {
        alert("Reunion details logged securely!");
        setReunionModal(null);
        setReunionForm({
          dateOfLeaving: "",
          receiverName: "",
          receiverRelation: "",
          receiverContact: "",
          receiverIdProof: "",
          receiverAddress: "",
        });
        fetchRecords();
      }
    } catch (error) {
      alert("Failed to save reunion details.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bhai, pakka delete karna hai? Data hamesha ke liye chala jayega.")) {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`http://localhost:5000/api/persons/delete/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) fetchRecords();
      } catch (error) {
        alert("Delete failed!");
      }
    }
  };

  const filteredRecords = records.filter((record) => {
    if (viewMode === "current" && record.status !== "Sheltered") return false;
    if (viewMode === "reunited" && record.status !== "Reunited") return false;
    if (viewMode === "selfExited" && record.status !== "Self Exited") return false;
    if (viewMode === "escaped" && record.status !== "Escaped") return false;
    if (viewMode === "dead" && record.status !== "Dead") return false;

    const searchLower = searchTerm.toLowerCase();
    const name = record.fullName || record.name || "";
    const loc = record.address || record.location || "";
    const uid = record.uid || ""; // UID ko bhi search mein include kar liya
    return name.toLowerCase().includes(searchLower) || 
           loc.toLowerCase().includes(searchLower) || 
           uid.toLowerCase().includes(searchLower);
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden font-sans transition-colors duration-300 relative">
      {/* --- HEADER AND TABS --- */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-heading">
              Shelter Records
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage and view resident database securely
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search name, UID, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <button
              onClick={fetchRecords}
              className="p-2.5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg w-fit">
          {["current", "reunited", "selfExited", "escaped", "dead", "all"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${
                viewMode === mode
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {mode === "selfExited" ? "Self Exited" : mode === "current" ? "In Shelter" : mode}
            </button>
          ))}
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs tracking-wider border-b dark:border-slate-800">
              <th className="p-4 font-bold uppercase">Name & UID</th>
              <th className="p-4 font-bold uppercase">Status</th>
              <th className="p-4 font-bold uppercase">Date Added</th>
              <th className="p-4 font-bold uppercase text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {isLoading && records.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-10 text-center text-slate-500 dark:text-slate-400">Loading database...</td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-10 text-center text-slate-500 dark:text-slate-400">No records found.</td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      {record.fullName || record.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {record.uid ? <span className="font-semibold text-indigo-500 mr-2">#{record.uid}</span> : ""}
                      {record.address || record.location}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                      record.status === "Reunited" ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800" :
                      record.status === "Escaped" ? "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800" :
                      record.status === "Dead" ? "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:border-rose-800" :
                      record.status === "Self Exited" ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800" :
                      "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800"
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">
                    {record.arrivalDateTime ? new Date(record.arrivalDateTime).toLocaleDateString("en-IN") : "N/A"}
                  </td>
                  <td className="p-4 flex justify-center gap-2 flex-wrap">
                    
                    {/* View Button */}
                    <button onClick={() => setSelectedPerson(record)} className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:bg-indigo-900/40 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white transition-all shadow-sm">
                      <Eye size={16} />
                    </button>

                    {record.status === "Sheltered" && (
                      <>
                        <button onClick={() => setReunionModal(record)} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:bg-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white transition-all shadow-sm" title="Reunite">
                          <Handshake size={16} />
                        </button>
                        <button onClick={() => handleQuickStatusUpdate(record._id, "Self Exited")} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-900/40 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-sm" title="Self Exit">
                          <LogOut size={16} />
                        </button>
                        <button onClick={() => handleQuickStatusUpdate(record._id, "Escaped")} className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white dark:bg-orange-900/40 dark:text-orange-400 dark:hover:bg-orange-600 dark:hover:text-white transition-all shadow-sm" title="Escaped">
                          <UserMinus size={16} />
                        </button>
                        <button onClick={() => handleQuickStatusUpdate(record._id, "Dead")} className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white dark:bg-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white transition-all shadow-sm" title="Deceased">
                          <Skull size={16} />
                        </button>
                      </>
                    )}

                    {adminRole === "superadmin" && (
                      <button onClick={() => handleDelete(record._id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- REUNION MODAL (POPUP 1) --- */}
      {reunionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-emerald-50 dark:bg-emerald-900/20">
              <h3 className="text-xl font-bold font-heading text-emerald-700 dark:text-emerald-400">
                Reunion Security Form
              </h3>
              <button onClick={() => setReunionModal(null)} className="text-slate-500 hover:text-rose-500 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleReunionSubmit} className="p-6 space-y-4">
              {/* Reunion form content unchanged */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 p-3 rounded-lg text-sm border border-yellow-200 dark:border-yellow-700/50 mb-4">
                <strong>Attention:</strong> Log receiver details carefully. This is a crucial legal & security requirement.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date of Leaving *</label>
                  <input required type="datetime-local" className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none" value={reunionForm.dateOfLeaving} onChange={(e) => setReunionForm({ ...reunionForm, dateOfLeaving: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Receiver Name *</label>
                  <input required type="text" placeholder="Who is taking them?" className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none" value={reunionForm.receiverName} onChange={(e) => setReunionForm({ ...reunionForm, receiverName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Relationship *</label>
                  <input required type="text" placeholder="e.g., Brother, Son, NGO" className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none" value={reunionForm.receiverRelation} onChange={(e) => setReunionForm({ ...reunionForm, receiverRelation: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Receiver Contact No. *</label>
                  <input required type="text" placeholder="Active mobile number" className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none" value={reunionForm.receiverContact} onChange={(e) => setReunionForm({ ...reunionForm, receiverContact: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Receiver Permanent Address *</label>
                  <textarea required rows="2" placeholder="Full residential address" className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none resize-none" value={reunionForm.receiverAddress} onChange={(e) => setReunionForm({ ...reunionForm, receiverAddress: e.target.value })}></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setReunionModal(null)} className="px-5 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg font-medium">Cancel</button>
                <button type="submit" disabled={isUpdating} className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-bold shadow-md disabled:opacity-50">
                  {isUpdating ? "Logging..." : "Confirm Reunion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW DETAILS MODAL (POPUP 2) --- */}
      {selectedPerson && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
              <h3 className="text-xl font-bold font-heading text-indigo-600 dark:text-indigo-400">
                Record Details {selectedPerson.uid ? `(#${selectedPerson.uid})` : ""}
              </h3>
              <button onClick={() => setSelectedPerson(null)} className="text-slate-500 hover:text-rose-500 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                  <div className="w-48 h-48 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
                    {selectedPerson.imageUrl || selectedPerson.image ? (
                      <img
                        src={(selectedPerson.imageUrl || selectedPerson.image).startsWith("http") ? (selectedPerson.imageUrl || selectedPerson.image) : `http://localhost:5000${selectedPerson.imageUrl || selectedPerson.image}`}
                        alt="Profile" className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
                      />
                    ) : null}
                    <span className="text-slate-400 text-sm px-4 text-center block" style={{ display: selectedPerson.imageUrl || selectedPerson.image ? "none" : "block" }}>No Photo</span>
                  </div>
                  <div className="text-center w-full">
                    <span className={`px-4 py-1.5 block rounded-md text-sm font-bold tracking-wide mb-2 ${selectedPerson.status === "Reunited" ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>
                      Status: {selectedPerson.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full block">
                      Days in Shelter: {calculateDays(selectedPerson.arrivalDateTime, selectedPerson.reunionDetails?.dateOfLeaving)}
                    </span>
                  </div>
                </div>
                <div className="w-full md:w-2/3 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">Personal Information</h4>
                    
                    {/* UID is added here in Personal Info Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div><p className="text-slate-500">Unique ID (UID)</p><p className="font-bold text-indigo-600 dark:text-indigo-400">{selectedPerson.uid || "N/A"}</p></div>
                      <div><p className="text-slate-500">Full Name</p><p className="font-semibold text-slate-900 dark:text-white">{selectedPerson.fullName || selectedPerson.name || "N/A"}</p></div>
                      <div><p className="text-slate-500">Age & Gender</p><p className="font-semibold text-slate-900 dark:text-white">{selectedPerson.age || "N/A"} • {selectedPerson.gender || "N/A"}</p></div>
                      <div className="col-span-2"><p className="text-slate-500">Location Found</p><p className="font-semibold text-slate-900 dark:text-white">{selectedPerson.address || selectedPerson.location || "N/A"}</p></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">Admission Details</h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div><p className="text-slate-500">Brought By</p><p className="font-semibold text-slate-900 dark:text-white">{selectedPerson.broughtBy || "N/A"}</p></div>
                      <div><p className="text-slate-500">Arrival Date</p><p className="font-semibold text-slate-900 dark:text-white">{selectedPerson.arrivalDateTime ? new Date(selectedPerson.arrivalDateTime).toLocaleString() : "N/A"}</p></div>
                      <div className="col-span-2"><p className="text-slate-500">Reason</p><p className="font-semibold text-slate-900 dark:text-white">{selectedPerson.reason || "N/A"}</p></div>
                      <div className="col-span-2"><p className="text-slate-500">Condition / Description</p><p className="font-semibold text-slate-900 dark:text-white">{selectedPerson.condition || selectedPerson.description || "N/A"}</p></div>
                    </div>
                  </div>
                  {selectedPerson.status === "Reunited" && selectedPerson.reunionDetails && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                      <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider border-b border-emerald-200 dark:border-emerald-800 pb-2 mb-3">🤝 Reunion Details (Security Log)</h4>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                        <div><p className="text-slate-500">Date of Leaving</p><p className="font-semibold text-slate-900 dark:text-white">{new Date(selectedPerson.reunionDetails.dateOfLeaving).toLocaleString()}</p></div>
                        <div><p className="text-slate-500">Receiver Name</p><p className="font-semibold text-slate-900 dark:text-white">{selectedPerson.reunionDetails.receiverName}</p></div>
                        <div><p className="text-slate-500">Relationship</p><p className="font-semibold text-slate-900 dark:text-white">{selectedPerson.reunionDetails.receiverRelation}</p></div>
                        <div><p className="text-slate-500">Contact No.</p><p className="font-semibold text-slate-900 dark:text-white">{selectedPerson.reunionDetails.receiverContact}</p></div>
                        <div className="col-span-2"><p className="text-slate-500">Permanent Address</p><p className="font-semibold text-slate-900 dark:text-white">{selectedPerson.reunionDetails.receiverAddress}</p></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 text-right">
              <button onClick={() => setSelectedPerson(null)} className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Close Window</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;