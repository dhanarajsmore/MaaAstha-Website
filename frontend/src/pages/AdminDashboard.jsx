import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value, subtitle, colorClass }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium font-sans">
      {title}
    </h3>
    <p className={`text-3xl font-bold mt-2 font-heading ${colorClass}`}>
      {value}
    </p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-sans">
      {subtitle}
    </p>
  </div>
);

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalSheltered: 0,
    reunited: 0,
    medicalNeeds: 0,
    recentlyAdded: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/persons/stats");
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Stats fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div>
        <h1 className="text-2xl font-bold text-ngo-dark dark:text-white font-heading transition-colors duration-300">
          Shelter Overview
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-sans transition-colors duration-300">
          Current status and recent activities at Maa Astha.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sheltered"
          value={isLoading ? "..." : stats.totalSheltered}
          subtitle="Currently in shelter"
          colorClass="text-ngo-green dark:text-green-400"
        />
        <StatCard
          title="Recently Added"
          value={isLoading ? "..." : stats.recentlyAdded}
          subtitle="Last 7 days"
          colorClass="text-ngo-light dark:text-green-300"
        />
        <StatCard
          title="Reunited"
          value={isLoading ? "..." : stats.reunited}
          subtitle="With family"
          colorClass="text-ngo-dark dark:text-white"
        />
        <StatCard
          title="Medical Needs"
          value={isLoading ? "..." : stats.medicalNeeds}
          subtitle="Requires attention"
          colorClass="text-ngo-red dark:text-red-400"
        />
      </div>
    </div>
  );
};

const AddPerson = () => {
  const initialForm = {
    fullName: "",
    age: "",
    gender: "Select",
    mobileNo: "",
    address: "",
    idDocument: "",
    arrivalDateTime: "",
    broughtBy: "",
    reason: "",
    condition: "",
    image: null,
  };
  const [formData, setFormData] = useState(initialForm);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/persons/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Record saved successfully in Database!");
        setFormData(initialForm);
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      console.error("Error saving record:", error);
      alert("⚠️ Could not connect to the backend server!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-ngo-dark dark:text-white font-heading">
          Digital Attendance Register
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          NMMC Urban Homeless Shelter (Maa Astha NGO)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 font-sans">
        {/* SECTION 1: Personal Details */}
        <h3 className="text-sm font-bold text-ngo-green dark:text-green-400 uppercase tracking-wider mb-2">
          1. Personal Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name (बेघर लाभार्थीचे नाव) *
            </label>
            <input
              type="text"
              required
              placeholder="Enter full name"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-ngo-green outline-none transition-colors"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Age (वय) *
            </label>
            <input
              type="number"
              required
              placeholder="Age"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-ngo-green outline-none transition-colors"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender (लिंग) *
            </label>
            <select
              required
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-green outline-none transition-colors"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="Select" disabled>
                Select
              </option>
              <option value="Male">Male (पुरुष)</option>
              <option value="Female">Female (स्त्री)</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* SECTION 2: Contact & ID */}
        <h3 className="text-sm font-bold text-ngo-green dark:text-green-400 uppercase tracking-wider mb-2 mt-6">
          2. Contact & Identity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address / Found At (पत्ता) *
            </label>
            <input
              type="text"
              required
              placeholder="Last known address or location found"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-ngo-green outline-none transition-colors"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mobile No. (मोबाईल क्र.)
            </label>
            <input
              type="tel"
              placeholder="If available"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-ngo-green outline-none transition-colors"
              value={formData.mobileNo}
              onChange={(e) =>
                setFormData({ ...formData, mobileNo: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ID Document No. (आधार/मतदान/पॅन कार्ड)
            </label>
            <input
              type="text"
              placeholder="Enter Aadhar, Voter ID, or PAN number if available"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-ngo-green outline-none transition-colors"
              value={formData.idDocument}
              onChange={(e) =>
                setFormData({ ...formData, idDocument: e.target.value })
              }
            />
          </div>
        </div>

        {/* SECTION 3: Admission Details */}
        <h3 className="text-sm font-bold text-ngo-green dark:text-green-400 uppercase tracking-wider mb-2 mt-6">
          3. Admission Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Arrival Date & Time (येण्याची वेळ) *
            </label>
            <input
              type="datetime-local"
              required
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-green outline-none transition-colors"
              value={formData.arrivalDateTime}
              onChange={(e) =>
                setFormData({ ...formData, arrivalDateTime: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Brought By / Source (कुठून आले) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Sanpada Police, Self, NGO Team"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-ngo-green outline-none transition-colors"
              value={formData.broughtBy}
              onChange={(e) =>
                setFormData({ ...formData, broughtBy: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reason for Coming (येण्याचे कारण) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Homeless, Missing, Ill"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-ngo-green outline-none transition-colors"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Photo (फोटो)
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-green outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 dark:file:bg-gray-600 file:text-ngo-green dark:file:text-green-400 hover:file:bg-green-100 transition-colors"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Physical Condition / Remarks
            </label>
            <textarea
              rows="2"
              placeholder="Any medical needs or specific condition..."
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-ngo-green outline-none transition-colors resize-none"
              value={formData.condition}
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value })
              }
            ></textarea>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setFormData(initialForm)}
            className="w-full sm:w-auto px-6 py-2.5 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-2.5 text-white bg-ngo-green hover:bg-ngo-dark rounded-lg transition-colors shadow-md font-bold flex items-center justify-center gap-2"
          >
            <span>💾</span> Save Record
          </button>
        </div>
      </form>
    </div>
  );
};

const Records = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/persons/all");
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

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === "Sheltered" ? "Reunited" : "Sheltered";
    try {
      const response = await fetch(
        `http://localhost:5000/api/persons/update/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (response.ok) fetchRecords();
    } catch (error) {
      alert("Update failed!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bhai, pakka delete karna hai?")) {
      try {
        await fetch(`http://localhost:5000/api/persons/delete/${id}`, {
          method: "DELETE",
        });
        fetchRecords();
      } catch (error) {
        alert("Delete failed!");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden font-sans transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center transition-colors duration-300">
        <h2 className="text-xl font-bold text-ngo-dark dark:text-white font-heading transition-colors duration-300">
          Shelter Records
        </h2>
        <button
          onClick={fetchRecords}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 active:scale-95"
        >
          <span className={isLoading ? "animate-spin" : ""}>🔄</span>
          {isLoading ? "Fetching..." : "Refresh"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm border-b dark:border-gray-700 transition-colors duration-300">
              <th className="p-4 font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider">
                Status
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 transition-colors duration-300">
            {isLoading && records.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="p-10 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300"
                >
                  Loading database...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="p-10 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record._id}
                  className="hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors duration-300"
                >
                  <td className="p-4 font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">
                    {record.fullName}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-colors duration-300 ${
                        record.status === "Reunited"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-3">
                    <button
                      onClick={() =>
                        handleStatusUpdate(record._id, record.status)
                      }
                      className="text-xs font-bold uppercase bg-ngo-green/10 text-ngo-green dark:text-green-400 px-3 py-1.5 rounded-md hover:bg-ngo-green hover:text-white transition-all duration-300 shadow-sm"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(record._id)}
                      className="text-xs font-bold uppercase bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 px-3 py-1.5 rounded-md hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
                    >
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

// ==========================================
// 💰 DONATIONS COMPONENT
// ==========================================
const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDonations = async () => {
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
    loadDonations();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-ngo-dark dark:text-white font-heading">
          Donations
        </h2>
        <span className="text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full">
          {donations.length} Records
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm border-b dark:border-gray-700">
              <th className="p-4 font-semibold uppercase tracking-wider">
                Donor Info
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider">
                Amount
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider">
                Payment Mode
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider">
                Ref ID
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center text-gray-500 dark:text-gray-400"
                >
                  Loading donations...
                </td>
              </tr>
            ) : donations.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No donations yet.
                </td>
              </tr>
            ) : (
              donations.map((d) => (
                <tr
                  key={d._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {d.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {d.phone} | {d.email || "No Email"}
                    </div>
                    {d.message && (
                      <div className="text-xs text-blue-500 mt-1 italic">
                        "{d.message}"
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-bold text-green-600 dark:text-green-400">
                    ₹{d.amount}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {d.paymentMode}
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                    {d.referenceId || "N/A"}
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                    {new Date(d.createdAt).toLocaleDateString("en-IN")}
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

// ==========================================
// 🤝 VOLUNTEERS COMPONENT
// ==========================================
const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVolunteers = async () => {
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
    loadVolunteers();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-ngo-dark dark:text-white font-heading">
          Volunteers
        </h2>
        <span className="text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full">
          {volunteers.length} Applications
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm border-b dark:border-gray-700">
              <th className="p-4 font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider">
                Phone
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider">
                How they can help
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider">
                Date Applied
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-8 text-center text-gray-500 dark:text-gray-400"
                >
                  Loading volunteers...
                </td>
              </tr>
            ) : volunteers.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No applications yet.
                </td>
              </tr>
            ) : (
              volunteers.map((v) => (
                <tr
                  key={v._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-800 dark:text-gray-200">
                    {v.name}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {v.phone}
                  </td>
                  <td
                    className="p-4 text-gray-600 dark:text-gray-400 max-w-xs truncate"
                    title={v.helpText}
                  >
                    {v.helpText}
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                    {new Date(v.createdAt).toLocaleDateString("en-IN")}
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

// ==========================================
// 🚨 RESCUE REQUESTS COMPONENT
// ==========================================
const RescueRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/rescue-requests/all",
        );
        const json = await res.json();
        if (json.success) setRequests(json.data);
      } catch (e) {
        console.error("Failed to load rescues", e);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-500 font-heading">
          Emergency Rescue Alerts
        </h2>
        <span className="text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full animate-pulse">
          {requests.length} Alerts
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm border-b dark:border-gray-700">
              <th className="p-4 font-semibold uppercase tracking-wider">
                Location
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider">
                Condition
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider">
                Reporter Details
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider text-center">
                Photo
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center text-gray-500 dark:text-gray-400"
                >
                  Loading alerts...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No active alerts.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr
                  key={r._id}
                  className="hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-800 dark:text-gray-200">
                    {r.location}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {r.condition}
                  </td>
                  <td className="p-4">
                    <div className="text-gray-800 dark:text-gray-200">
                      {r.reporterName || "Anonymous"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {r.reporterPhone}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {r.photoUrl ? (
                      <a
                        href={`http://localhost:5000${r.photoUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium underline text-sm"
                      >
                        View Image
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">No Photo</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                    {new Date(r.createdAt).toLocaleString("en-IN")}
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
// --- MAIN DASHBOARD LAYOUT ---

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "add", label: "Add Person", icon: "➕" },
    { id: "records", label: "View Records", icon: "📁" },
    { id: "donations", label: "Donations", icon: "💰" },
    { id: "volunteers", label: "Volunteers", icon: "🤝" },
    { id: "rescues", label: "Rescue Alerts", icon: "🚨" },
  ];

  const handleLogout = () => {
    navigate("/admin");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "add":
        return <AddPerson />;
      case "records":
        return <Records />;
      case "donations":
        return <Donations />;
      case "volunteers":
        return <Volunteers />;
      case "rescues":
        return <RescueRequests />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300 overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed md:relative z-50 w-64 h-full bg-white dark:bg-gray-800 shadow-2xl md:shadow-lg flex flex-col border-r border-transparent dark:border-gray-700 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-ngo-dark dark:text-white font-heading">
              Maa Astha
            </h2>
            <p className="text-xs text-ngo-green dark:text-green-400 mt-1 font-semibold tracking-wide">
              ADMIN PORTAL
            </p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-ngo-red focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? "bg-green-50 dark:bg-gray-700 text-ngo-green dark:text-green-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 p-4 flex justify-between items-center transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 className="font-semibold text-gray-700 dark:text-white capitalize font-heading text-xl">
              {activeTab.replace("-", " ")}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
              title="Toggle Theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-50 dark:bg-red-900/30 text-ngo-red dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium shadow-sm border border-red-100 dark:border-red-900/50 text-sm sm:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
