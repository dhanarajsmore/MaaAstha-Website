import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Ban,
  Trash2,
  TrendingUp,
  IndianRupee,
} from "lucide-react";

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("pending");

  const adminRole = localStorage.getItem("adminRole");

  const loadDonations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/donations/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    if (!window.confirm(`Mark this transaction as ${newStatus}?`)) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:5000/api/donations/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (res.ok) loadDonations();
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record permanently?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:5000/api/donations/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      if (res.ok) {
        loadDonations();
      } else {
        alert(data.message || "Delete failed!");
      }
    } catch (e) {
      alert("Delete failed!");
    }
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const thisMonthTotal = donations
    .filter(
      (d) =>
        d.status === "Verified" &&
        new Date(d.createdAt).getMonth() === currentMonth &&
        new Date(d.createdAt).getFullYear() === currentYear,
    )
    .reduce((sum, d) => sum + d.amount, 0);

  const annualTotal = donations
    .filter(
      (d) =>
        d.status === "Verified" &&
        new Date(d.createdAt).getFullYear() === currentYear,
    )
    .reduce((sum, d) => sum + d.amount, 0);

  const filteredDonations = donations.filter((d) =>
    viewMode === "pending" ? d.status === "Pending" : d.status !== "Pending",
  );

  return (
    <div className="font-sans space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0BB68C] rounded-2xl p-6 relative overflow-hidden shadow-md">
          <div className="relative z-10">
            <h3 className="text-white/90 text-xs font-bold uppercase tracking-wider mb-1">
              This Month's Collection
            </h3>
            <p className="text-white text-4xl font-extrabold font-heading">
              ₹{(Number(thisMonthTotal) || 0).toLocaleString("en-IN")}
            </p>
          </div>
          <TrendingUp
            className="absolute -bottom-4 -right-2 text-white/20 w-32 h-32"
            strokeWidth={3}
          />
        </div>

        <div className="bg-[#466BFF] rounded-2xl p-6 relative overflow-hidden shadow-md">
          <div className="relative z-10">
            <h3 className="text-white/90 text-xs font-bold uppercase tracking-wider mb-1">
              Annual Total ({currentYear})
            </h3>
            <p className="text-white text-4xl font-extrabold font-heading">
              ₹{(Number(annualTotal) || 0).toLocaleString("en-IN")}
            </p>
          </div>
          <IndianRupee
            className="absolute -bottom-6 -right-4 text-white/20 w-36 h-36"
            strokeWidth={3}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              Donation Records
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400 mt-1 block">
              Track and verify all incoming contributions.
            </span>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode("pending")}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === "pending" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
              Pending
            </button>
            <button
              onClick={() => setViewMode("history")}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === "history" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
              All History
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px] px-2 pb-4 -mx-2">
          <table className="w-full text-left border-separate border-spacing-y-4 min-w-[900px]">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                <th className="px-5 py-2">Donor Details</th>
                <th className="px-5 py-2">Amount</th>
                <th className="px-5 py-2">Transaction Info</th>
                <th className="px-5 py-2">Status</th>
                {adminRole === "superadmin" && (
                  <th className="px-5 py-2 text-center w-40">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={adminRole === "superadmin" ? 5 : 4}
                    className="p-10 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700"
                  >
                    Loading records...
                  </td>
                </tr>
              ) : filteredDonations.length === 0 ? (
                <tr>
                  <td
                    colSpan={adminRole === "superadmin" ? 5 : 4}
                    className="p-10 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700"
                  >
                    No donations found.
                  </td>
                </tr>
              ) : (
                filteredDonations.map((d) => (
                  <tr
                    key={d._id}
                    className="group hover:-translate-y-0.5 transition-transform duration-300"
                  >
                    <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all align-top">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {d.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 font-mono">
                        {d.phone}
                      </div>
                    </td>
                    <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all align-top font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                      ₹{(Number(d.amount) || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all align-top">
                      <div className="font-mono text-slate-800 dark:text-slate-300 text-sm tracking-wide bg-slate-100 dark:bg-slate-800 inline-block px-2 py-1 rounded">
                        {d.transactionId}
                      </div>
                      <div className="text-xs font-semibold text-slate-500 mt-1.5 uppercase tracking-wider">
                        {d.modeOfPayment}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {new Date(d.createdAt).toLocaleString("en-IN")}
                      </div>
                    </td>
                    <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all align-top">
                      <span
                        className={`text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-md border ${d.status === "Verified" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" : d.status === "Invalid" ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20" : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"}`}
                      >
                        {d.status}
                      </span>
                    </td>
                    {adminRole === "superadmin" && (
                      <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all align-top">
                        <div className="flex flex-col gap-2">
                          {viewMode === "pending" ? (
                            <>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(d._id, "Verified")
                                }
                                className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase px-3 py-2 rounded-lg transition-all shadow-sm bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-600 hover:text-white dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900 dark:hover:bg-emerald-600 dark:hover:text-white transition-colors"
                              >
                                <CheckCircle size={15} strokeWidth={2.5} />{" "}
                                Verify
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(d._id, "Invalid")
                                }
                                className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase px-3 py-2 rounded-lg transition-all shadow-sm bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-600 hover:text-white dark:bg-rose-950 dark:text-rose-400 dark:border-rose-900 dark:hover:bg-rose-600 dark:hover:text-white transition-colors"
                              >
                                <Ban size={15} strokeWidth={2.5} /> Invalid
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleDelete(d._id)}
                              className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase px-3 py-2 rounded-lg transition-all shadow-sm bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-600 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-600 dark:hover:text-white transition-colors"
                            >
                              <Trash2 size={15} strokeWidth={2.5} /> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Donations;
