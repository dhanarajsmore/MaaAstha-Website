import React, { useState, useEffect } from "react";
import {
  Eye,
  Handshake,
  Trash2,
  Search,
  RefreshCw,
  UserMinus,
  HeartPulse,
  LogOut,
} from "lucide-react";

const Records = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("current");

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [reunionModal, setReunionModal] = useState(null);
  const [funeralModal, setFuneralModal] = useState(null);
  const [exitModal, setExitModal] = useState(null);

  const [isUpdating, setIsUpdating] = useState(false);

  const [reunionForm, setReunionForm] = useState({
    dateOfLeaving: "",
    receiverName: "",
    receiverRelation: "",
    receiverContact: "",
    receiverIdProof: "",
    receiverAddress: "",
  });

  const [funeralForm, setFuneralForm] = useState({
    dateOfDeath: "",
    causeOfDeath: "",
    funeralDoneBy: "",
    notes: "",
  });

  const [exitForm, setExitForm] = useState({
    dateOfLeaving: "",
    remarks: "",
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

  const calculateDays = (arrival, leaveDate) => {
    if (!arrival) return "N/A";
    const start = new Date(arrival);
    const end = leaveDate ? new Date(leaveDate) : new Date();
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getLeaveDateForCalculation = (record) => {
    if (record.status === "Reunited")
      return record.reunionDetails?.dateOfLeaving;
    if (record.status === "Dead") return record.funeralDetails?.dateOfDeath;
    if (record.status === "Escaped" || record.status === "Self Exited")
      return record.exitDetails?.dateOfLeaving;
    return null;
  };

  const handleQuickStatusUpdate = async (
    personId,
    newStatus,
    extraDetails = {},
  ) => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:5000/api/persons/update/${personId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus, ...extraDetails }),
        },
      );
      if (response.ok) {
        fetchRecords();
        alert(`Status updated to: ${newStatus}`);
      }
    } catch (error) {
      alert("Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
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
        alert("Reunion details & ID logged securely!");
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
      alert("Failed to save details.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFuneralSubmit = async (e) => {
    e.preventDefault();
    await handleQuickStatusUpdate(funeralModal._id, "Dead", {
      funeralDetails: funeralForm,
    });
    setFuneralModal(null);
    setFuneralForm({
      dateOfDeath: "",
      causeOfDeath: "",
      funeralDoneBy: "",
      notes: "",
    });
  };

  const handleExitSubmit = async (e) => {
    e.preventDefault();
    const statusType = exitModal.type;
    await handleQuickStatusUpdate(exitModal.record._id, statusType, {
      exitDetails: exitForm,
    });
    setExitModal(null);
    setExitForm({ dateOfLeaving: "", remarks: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanent delete? Data will be lost.")) {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(
          `http://localhost:5000/api/persons/delete/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) fetchRecords();
      } catch (error) {
        alert("Delete failed!");
      }
    }
  };

  const filteredRecords = records.filter((record) => {
    if (viewMode === "current" && record.status !== "Sheltered") return false;
    if (viewMode === "reunited" && record.status !== "Reunited") return false;
    if (viewMode === "selfExited" && record.status !== "Self Exited")
      return false;
    if (viewMode === "escaped" && record.status !== "Escaped") return false;
    if (viewMode === "dead" && record.status !== "Dead") return false;

    const searchLower = searchTerm.toLowerCase();
    return (
      (record.fullName || record.name || "")
        .toLowerCase()
        .includes(searchLower) ||
      (record.address || record.location || "")
        .toLowerCase()
        .includes(searchLower) ||
      (record.uid || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden font-sans transition-colors duration-300 relative">
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
              className="p-2.5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg w-fit">
          {["current", "reunited", "selfExited", "escaped", "dead", "all"].map(
            (mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${viewMode === mode ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
              >
                {mode === "selfExited"
                  ? "Self Exited"
                  : mode === "current"
                    ? "In Shelter"
                    : mode}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px] px-2 pb-4 -mx-2">
        <table className="w-full text-left border-separate border-spacing-y-4 min-w-[1000px]">
          <thead>
            <tr className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
              <th className="px-5 py-2">Name & UID</th>
              <th className="px-5 py-2">Status</th>
              <th className="px-5 py-2">Date Added</th>
              <th className="px-5 py-2 text-center w-56">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && records.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-10 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                  Loading database...
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-10 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr
                  key={record._id}
                  className="group hover:-translate-y-0.5 transition-transform duration-300"
                >
                  <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all align-top">
                    <div className="font-bold text-slate-900 dark:text-white text-base">
                      {record.fullName || record.name}
                    </div>
                    <div className="text-xs font-medium text-slate-500 mt-1.5">
                      {record.uid ? (
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-2 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                          #{record.uid}
                        </span>
                      ) : (
                        ""
                      )}
                      {record.address || record.location}
                    </div>
                  </td>
                  <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all align-top">
                    <span
                      className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                        record.status === "Reunited"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50"
                          : record.status === "Escaped"
                            ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50"
                            : record.status === "Dead"
                              ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50"
                              : record.status === "Self Exited"
                                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50"
                                : "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/50"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all text-slate-600 dark:text-slate-400 text-sm font-medium align-top">
                    {record.arrivalDateTime
                      ? new Date(record.arrivalDateTime).toLocaleDateString(
                          "en-IN",
                        )
                      : "N/A"}
                  </td>
                  <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all align-top">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedPerson(record)}
                        className="w-full flex items-center justify-start gap-2 px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-600 hover:text-white dark:bg-indigo-900/40 dark:text-indigo-400 dark:border-indigo-800/50 dark:hover:bg-indigo-600 dark:hover:text-white transition-all text-xs font-bold"
                      >
                        <Eye size={14} /> View Details
                      </button>

                      {record.status === "Sheltered" && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setReunionModal(record)}
                            className="flex items-center justify-start gap-1.5 px-2 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-600 hover:text-white dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50 dark:hover:bg-emerald-600 dark:hover:text-white transition-all text-[11px] font-bold"
                            title="Log Reunion"
                          >
                            <Handshake size={12} /> Reunite
                          </button>
                          <button
                            onClick={() =>
                              setExitModal({ record, type: "Self Exited" })
                            }
                            className="flex items-center justify-start gap-1.5 px-2 py-1.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50 dark:hover:bg-blue-600 dark:hover:text-white transition-all text-[11px] font-bold"
                          >
                            <LogOut size={12} /> Self Exit
                          </button>
                          <button
                            onClick={() =>
                              setExitModal({ record, type: "Escaped" })
                            }
                            className="flex items-center justify-start gap-1.5 px-2 py-1.5 rounded-md bg-orange-50 text-orange-700 border border-orange-100 hover:bg-orange-600 hover:text-white dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50 dark:hover:bg-orange-600 dark:hover:text-white transition-all text-[11px] font-bold"
                          >
                            <UserMinus size={12} /> Escaped
                          </button>
                          <button
                            onClick={() => setFuneralModal(record)}
                            className="flex items-center justify-start gap-1.5 px-2 py-1.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-600 hover:text-white dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50 dark:hover:bg-rose-600 dark:hover:text-white transition-all text-[11px] font-bold"
                          >
                            <HeartPulse size={12} /> Deceased
                          </button>
                        </div>
                      )}

                      {adminRole === "superadmin" && (
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="w-full flex items-center justify-center gap-2 mt-1 px-3 py-1.5 rounded-md bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 dark:hover:bg-red-600 dark:hover:text-white transition-all text-xs font-bold opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} /> Delete Record
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* EXIT / ESCAPE MODAL */}
      {exitModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800">
            <div
              className={`p-5 border-b dark:border-slate-800 flex justify-between items-center ${exitModal.type === "Escaped" ? "bg-orange-50 dark:bg-orange-900/20" : "bg-blue-50 dark:bg-blue-900/20"}`}
            >
              <h3
                className={`text-xl font-bold ${exitModal.type === "Escaped" ? "text-orange-700 dark:text-orange-400" : "text-blue-700 dark:text-blue-400"}`}
              >
                Log Details: {exitModal.type}
              </h3>
              <button
                onClick={() => setExitModal(null)}
                className="text-slate-500 hover:text-rose-500 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleExitSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Date & Time *
                </label>
                <input
                  required
                  type="datetime-local"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  value={exitForm.dateOfLeaving}
                  onChange={(e) =>
                    setExitForm({ ...exitForm, dateOfLeaving: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Remarks / Location Hint
                </label>
                <textarea
                  rows="3"
                  placeholder="Any additional information..."
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none resize-none focus:ring-2 focus:ring-indigo-500"
                  value={exitForm.remarks}
                  onChange={(e) =>
                    setExitForm({ ...exitForm, remarks: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setExitModal(null)}
                  className="px-5 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`px-5 py-2 text-white rounded-lg font-bold shadow-md disabled:opacity-50 ${exitModal.type === "Escaped" ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {isUpdating ? "Saving..." : `Confirm ${exitModal.type}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FUNERAL MODAL */}
      {funeralModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-5 border-b dark:border-slate-800 flex justify-between items-center bg-rose-50 dark:bg-rose-900/20">
              <h3 className="text-xl font-bold text-rose-700 dark:text-rose-400">
                Log Funeral Details
              </h3>
              <button
                onClick={() => setFuneralModal(null)}
                className="text-slate-500 hover:text-rose-500 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleFuneralSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Date of Demise *
                </label>
                <input
                  required
                  type="date"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
                  value={funeralForm.dateOfDeath}
                  onChange={(e) =>
                    setFuneralForm({
                      ...funeralForm,
                      dateOfDeath: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Cause of Death
                </label>
                <input
                  type="text"
                  placeholder="e.g., Natural, Illness"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
                  value={funeralForm.causeOfDeath}
                  onChange={(e) =>
                    setFuneralForm({
                      ...funeralForm,
                      causeOfDeath: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Funeral Done By
                </label>
                <input
                  type="text"
                  placeholder="NGO / NMMC / Relatives"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
                  value={funeralForm.funeralDoneBy}
                  onChange={(e) =>
                    setFuneralForm({
                      ...funeralForm,
                      funeralDoneBy: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows="2"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none resize-none focus:ring-2 focus:ring-rose-500"
                  value={funeralForm.notes}
                  onChange={(e) =>
                    setFuneralForm({ ...funeralForm, notes: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setFuneralModal(null)}
                  className="px-5 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-md disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Mark Deceased"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REUNION MODAL */}
      {reunionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-emerald-50 dark:bg-emerald-900/20">
              <h3 className="text-xl font-bold font-heading text-emerald-700 dark:text-emerald-400">
                Reunion Security Form
              </h3>
              <button
                onClick={() => setReunionModal(null)}
                className="text-slate-500 hover:text-rose-500 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleReunionSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Date of Leaving *
                  </label>
                  <input
                    required
                    type="datetime-local"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    value={reunionForm.dateOfLeaving}
                    onChange={(e) =>
                      setReunionForm({
                        ...reunionForm,
                        dateOfLeaving: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Receiver Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Who is taking them?"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    value={reunionForm.receiverName}
                    onChange={(e) =>
                      setReunionForm({
                        ...reunionForm,
                        receiverName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Relationship *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g., Brother, Son, NGO"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    value={reunionForm.receiverRelation}
                    onChange={(e) =>
                      setReunionForm({
                        ...reunionForm,
                        receiverRelation: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Receiver Contact No. *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Active mobile number"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    value={reunionForm.receiverContact}
                    onChange={(e) =>
                      setReunionForm({
                        ...reunionForm,
                        receiverContact: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Receiver ID Proof (Aadhaar/PAN) *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Enter ID Document Number"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    value={reunionForm.receiverIdProof}
                    onChange={(e) =>
                      setReunionForm({
                        ...reunionForm,
                        receiverIdProof: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Receiver Permanent Address *
                  </label>
                  <textarea
                    required
                    rows="2"
                    placeholder="Full residential address"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none resize-none focus:ring-2 focus:ring-emerald-500"
                    value={reunionForm.receiverAddress}
                    onChange={(e) =>
                      setReunionForm({
                        ...reunionForm,
                        receiverAddress: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setReunionModal(null)}
                  className="px-5 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md disabled:opacity-50"
                >
                  {isUpdating ? "Logging..." : "Confirm Reunion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {selectedPerson && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
              <h3 className="text-xl font-bold font-heading text-indigo-600 dark:text-indigo-400">
                Record Details{" "}
                {selectedPerson.uid ? `(#${selectedPerson.uid})` : ""}
              </h3>
              <button
                onClick={() => setSelectedPerson(null)}
                className="text-slate-500 hover:text-rose-500 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                  <div className="w-48 h-48 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
                    {selectedPerson.imageUrl || selectedPerson.image ? (
                      <img
                        src={
                          (
                            selectedPerson.imageUrl || selectedPerson.image
                          ).startsWith("http")
                            ? selectedPerson.imageUrl || selectedPerson.image
                            : `http://localhost:5000${selectedPerson.imageUrl || selectedPerson.image}`
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                    ) : null}
                    <span
                      className="text-slate-400 text-sm px-4 text-center block"
                      style={{
                        display:
                          selectedPerson.imageUrl || selectedPerson.image
                            ? "none"
                            : "block",
                      }}
                    >
                      No Photo
                    </span>
                  </div>
                  <div className="text-center w-full">
                    <span
                      className={`px-4 py-1.5 block rounded-md text-sm font-bold tracking-wide mb-2 ${selectedPerson.status === "Reunited" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"}`}
                    >
                      Status: {selectedPerson.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full block">
                      Days in Shelter:{" "}
                      {calculateDays(
                        selectedPerson.arrivalDateTime,
                        getLeaveDateForCalculation(selectedPerson),
                      )}
                    </span>
                  </div>
                </div>
                <div className="w-full md:w-2/3 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">
                          Unique ID
                        </p>
                        <p className="font-bold text-indigo-600 dark:text-indigo-400">
                          {selectedPerson.uid || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">
                          Full Name
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {selectedPerson.fullName ||
                            selectedPerson.name ||
                            "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">
                          Age & Gender
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {selectedPerson.age || "N/A"} •{" "}
                          {selectedPerson.gender || "N/A"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-slate-500 dark:text-slate-400">
                          Location Found
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {selectedPerson.address ||
                            selectedPerson.location ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                      Admission Details
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">
                          Brought By
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {selectedPerson.broughtBy || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400">
                          Arrival Date
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {selectedPerson.arrivalDateTime
                            ? new Date(
                                selectedPerson.arrivalDateTime,
                              ).toLocaleString("en-IN")
                            : "N/A"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-slate-500 dark:text-slate-400">
                          Reason
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {selectedPerson.reason || "N/A"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-slate-500 dark:text-slate-400">
                          Condition / Description
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {selectedPerson.condition ||
                            selectedPerson.description ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedPerson.status === "Reunited" &&
                    selectedPerson.reunionDetails && (
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                        <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider border-b border-emerald-200 dark:border-emerald-800/50 pb-2 mb-3">
                          🤝 Reunion Details
                        </h4>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">
                              Date
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {new Date(
                                selectedPerson.reunionDetails.dateOfLeaving,
                              ).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">
                              Receiver Name
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {selectedPerson.reunionDetails.receiverName}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">
                              Relation
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {selectedPerson.reunionDetails.receiverRelation}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">
                              ID Proof No.
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {selectedPerson.reunionDetails.receiverIdProof ||
                                "N/A"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-slate-500 dark:text-slate-400">
                              Address
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {selectedPerson.reunionDetails.receiverAddress ||
                                "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {selectedPerson.status === "Dead" &&
                    selectedPerson.funeralDetails && (
                      <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800/50">
                        <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider border-b border-rose-200 dark:border-rose-800/50 pb-2 mb-3">
                          ⚰️ Funeral Details
                        </h4>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">
                              Date of Death
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {new Date(
                                selectedPerson.funeralDetails.dateOfDeath,
                              ).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">
                              Cause
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {selectedPerson.funeralDetails.causeOfDeath ||
                                "N/A"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-slate-500 dark:text-slate-400">
                              Funeral Done By
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {selectedPerson.funeralDetails.funeralDoneBy ||
                                "N/A"}
                            </p>
                          </div>
                          {selectedPerson.funeralDetails.notes && (
                            <div className="col-span-2">
                              <p className="text-slate-500 dark:text-slate-400">
                                Notes
                              </p>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {selectedPerson.funeralDetails.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  {(selectedPerson.status === "Escaped" ||
                    selectedPerson.status === "Self Exited") &&
                    selectedPerson.exitDetails && (
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-300 dark:border-slate-600 pb-2 mb-3">
                          🚪 Exit Details
                        </h4>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">
                              Date of Leaving
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {new Date(
                                selectedPerson.exitDetails.dateOfLeaving,
                              ).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-slate-500 dark:text-slate-400">
                              Remarks
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {selectedPerson.exitDetails.remarks ||
                                "No remarks provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                onClick={() => setSelectedPerson(null)}
                className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
