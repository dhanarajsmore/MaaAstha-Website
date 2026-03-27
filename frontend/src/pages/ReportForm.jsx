import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReportForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const person = location.state;

  const [formData, setFormData] = useState({
    reporterName: "",
    phone: "",
    relation: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  if (!person) {
    return (
      <div className="pt-24 flex justify-center text-gray-500 dark:text-gray-400 font-sans">
        No person selected to report. Please select a profile from the Missing
        Persons page.
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔥 FIX: Yahan se bhi /add hata diya original route ke liye
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          personName: person.name || person.fullName,
        }),
      });

      if (res.ok) {
        alert(
          "Report submitted successfully! The NGO team will contact you shortly.",
        );
        navigate("/");
      } else {
        alert("Failed to submit report. Please check the details.");
      }
    } catch (error) {
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] pt-24 pb-12 font-sans px-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-ngo-dark dark:text-white mb-2">
            Claim Missing Person
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Reporting for:{" "}
            <span className="font-bold text-ngo-green">
              {person.name || person.fullName}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              name="reporterName"
              placeholder="Your Full Name"
              required
              value={formData.reporterName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ngo-green transition-colors"
            />
          </div>
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ngo-green transition-colors"
            />
          </div>
          <div>
            <input
              type="text"
              name="relation"
              placeholder="Relation (Father, Brother, etc.)"
              required
              value={formData.relation}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ngo-green transition-colors"
            />
          </div>
          <div>
            <textarea
              name="message"
              rows="3"
              placeholder="Any additional information..."
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-ngo-green transition-colors resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ngo-green text-white font-bold py-3 px-4 rounded-lg hover:bg-ngo-dark transition duration-300 shadow-md mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
