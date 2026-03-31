import React, { useState, useEffect } from "react";
import {
  UserSearch,
  Trash2,
  PlusCircle,
  Calendar,
  MapPin,
  ClipboardList,
  Megaphone,
} from "lucide-react";

const MissingReports = () => {
  const [activeTab, setActiveTab] = useState("claims");

  const [claims, setClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(true);

  const [cases, setCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const adminRole = localStorage.getItem("adminRole");

  const initialForm = {
    name: "",
    age: "",
    gender: "",
    lastSeenDate: "",
    location: "",
    description: "",
    image: null,
  };
  const [formData, setFormData] = useState(initialForm);

  const loadClaims = async () => {
    setLoadingClaims(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/reports/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setClaims(json.data);
    } catch (e) {
      console.error("Failed to load claims", e);
    } finally {
      setLoadingClaims(false);
    }
  };

  const loadCases = async () => {
    setLoadingCases(true);
    try {
      const res = await fetch("http://localhost:5000/api/missing-persons/all");
      const json = await res.json();
      if (json.success) setCases(json.data);
    } catch (e) {
      console.error("Failed to load missing persons", e);
    } finally {
      setLoadingCases(false);
    }
  };

  useEffect(() => {
    loadClaims();
    loadCases();
  }, []);

  const handleDeleteClaim = async (id) => {
    if (!window.confirm("Delete this public claim permanently?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:5000/api/reports/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) loadClaims();
    } catch (e) {
      alert("Failed to delete claim");
    }
  };

  const handleDeleteCase = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this missing person case?",
      )
    )
      return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:5000/api/missing-persons/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) loadCases();
    } catch (e) {
      alert("Failed to delete case");
    }
  };

  const handlePublishSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("adminToken");
      const dataToSend = new FormData();

      dataToSend.append("name", formData.name);
      dataToSend.append("age", formData.age);
      dataToSend.append("gender", formData.gender);
      dataToSend.append("missingSince", formData.lastSeenDate);
      dataToSend.append("location", formData.location);
      dataToSend.append("description", formData.description);

      if (formData.image) {
        dataToSend.append("image", formData.image);
      }

      const response = await fetch(
        "http://localhost:5000/api/missing-persons/add",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: dataToSend,
        },
      );

      const data = await response.json();

      if (data.success) {
        alert("Missing Person case published successfully!");
        setFormData(initialForm);
        document.getElementById("missing-photo-upload").value = "";
        loadCases();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Server connection failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300 font-sans">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-heading flex items-center gap-2">
            <UserSearch size={24} /> Missing Persons Portal
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400 mt-1 block">
            Manage public claims and publish new missing cases.
          </span>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab("claims")}
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === "claims" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <ClipboardList size={16} /> Public Claims
          </button>
          <button
            onClick={() => setActiveTab("publish")}
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === "publish" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <Megaphone size={16} /> Publish & Manage Cases
          </button>
        </div>
      </div>

      {activeTab === "claims" && (
        <div className="overflow-x-auto min-h-[400px] px-2 pb-4 -mx-2">
          <table className="w-full text-left border-separate border-spacing-y-4 min-w-[900px]">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                <th className="px-5 py-2">Target Person</th>
                <th className="px-5 py-2">Claimant Details</th>
                <th className="px-5 py-2">Relationship</th>
                <th className="px-5 py-2 w-1/4">Message / Info</th>
                <th className="px-5 py-2">Date</th>
                {adminRole === "superadmin" && (
                  <th className="px-5 py-2 text-center w-32">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loadingClaims ? (
                <tr>
                  <td
                    colSpan={adminRole === "superadmin" ? 6 : 5}
                    className="p-10 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700"
                  >
                    Loading claims...
                  </td>
                </tr>
              ) : claims.length === 0 ? (
                <tr>
                  <td
                    colSpan={adminRole === "superadmin" ? 6 : 5}
                    className="p-10 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700"
                  >
                    No public claims found.
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr
                    key={claim._id}
                    className="group hover:-translate-y-0.5 transition-transform duration-300"
                  >
                    <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all font-bold text-indigo-600 dark:text-indigo-400 text-sm align-top">
                      {claim.personName}
                    </td>
                    <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all align-top">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {claim.reporterName}
                      </div>
                      <div className="text-xs font-mono text-slate-500 mt-1">
                        {claim.phone}
                      </div>
                    </td>
                    <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all text-slate-700 dark:text-slate-300 text-sm font-bold align-top">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                        {claim.relation}
                      </span>
                    </td>
                    <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all text-slate-600 dark:text-slate-400 text-sm align-top">
                      {claim.message || (
                        <span className="italic opacity-50">
                          No extra message
                        </span>
                      )}
                    </td>
                    <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all text-[11px] text-slate-500 font-medium align-top">
                      {new Date(claim.createdAt).toLocaleString("en-IN")}
                    </td>
                    {adminRole === "superadmin" && (
                      <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all align-top">
                        <button
                          onClick={() => handleDeleteClaim(claim._id)}
                          className="w-full flex items-center justify-center gap-1.5 text-xs font-bold uppercase px-3 py-2 rounded-lg transition-all shadow-sm bg-slate-100 text-slate-600 border border-slate-200 hover:bg-rose-600 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-rose-600 dark:hover:text-white transition-colors"
                        >
                          <Trash2 size={15} strokeWidth={2.5} /> Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "publish" && (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 h-fit">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Post New Case
            </h3>
            <form onSubmit={handlePublishSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. 45"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Gender *
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Last Seen Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.lastSeenDate}
                  onChange={(e) =>
                    setFormData({ ...formData, lastSeenDate: e.target.value })
                  }
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Last Seen Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Kalyan Station"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description / Clothes worn *
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Identifying marks, clothing..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Photo *
                </label>
                <input
                  type="file"
                  required
                  id="missing-photo-upload"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-900/30 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/50 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <PlusCircle size={18} />{" "}
                {isSubmitting ? "Publishing..." : "Publish Case"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Active Missing Cases
              </h3>
              <span className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-800/50">
                {cases.length} Published
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loadingCases ? (
                <div className="col-span-full p-6 text-center text-slate-500">
                  Loading cases...
                </div>
              ) : cases.length === 0 ? (
                <div className="col-span-full p-6 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  No active missing cases found.
                </div>
              ) : (
                cases.map((person) => (
                  <div
                    key={person._id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col"
                  >
                    <div className="h-48 bg-slate-200 dark:bg-slate-800 relative">
                      <img
                        src={
                          person.imageUrl?.startsWith("http")
                            ? person.imageUrl
                            : `http://localhost:5000${person.imageUrl}`
                        }
                        alt={person.fullName || person.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x400?text=No+Image";
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded shadow animate-pulse">
                        MISSING
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">
                        {person.fullName || person.name}, {person.age}
                      </h4>
                      <div className="space-y-1.5 mb-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin size={12} /> {person.location}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Calendar size={12} />{" "}
                          {person.missingSince
                            ? new Date(person.missingSince).toLocaleDateString(
                                "en-IN",
                              )
                            : "N/A"}
                        </p>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
                        {person.description}
                      </p>

                      <button
                        onClick={() => handleDeleteCase(person._id)}
                        className="w-full flex justify-center items-center gap-2 text-rose-500 hover:text-white dark:text-rose-400 font-bold text-sm bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-600 dark:hover:bg-rose-600 border border-rose-100 dark:border-rose-800/50 hover:border-transparent py-2 rounded-lg transition-colors mt-auto"
                      >
                        <Trash2 size={16} /> Mark as Found / Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissingReports;
