import React, { useState, useEffect } from "react";
import { UserSearch, Trash2, PlusCircle, Calendar, MapPin } from "lucide-react";

const MissingReports = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const loadCases = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/missing-persons/all");
      const json = await res.json();
      if (json.success) setCases(json.data);
    } catch (e) {
      console.error("Failed to load missing persons", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this case?")) return;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("adminToken");
      const dataToSend = new FormData();

      dataToSend.append("name", formData.name);
      dataToSend.append("age", formData.age);
      dataToSend.append("gender", formData.gender);

      // 🔥 FIX: Backend 'missingSince' expect kar raha tha, hum lastSeenDate bhej rahe the!
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
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-heading flex items-center gap-2">
            <UserSearch size={24} /> Publish Missing Claims
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400 mt-1 block">
            Add or remove missing person records directly to the public website.
          </span>
        </div>
        <span className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-bold border border-indigo-100 dark:border-indigo-800/50">
          Total Cases: {cases.length}
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 h-fit">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Post New Case
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
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
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Active Missing Cases
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
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
                      alt={person.name}
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
                      {person.name}, {person.age}
                    </h4>
                    <div className="space-y-1.5 mb-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin size={12} /> {person.location}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar size={12} />{" "}
                        {new Date(person.lastSeenDate).toLocaleDateString(
                          "en-IN",
                        )}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
                      {person.description}
                    </p>

                    <button
                      onClick={() => handleDelete(person._id)}
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
    </div>
  );
};

export default MissingReports;
