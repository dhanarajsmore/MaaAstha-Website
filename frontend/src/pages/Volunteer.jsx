import React, { useState } from "react";

const Volunteer = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    helpText: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/volunteers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Application submitted successfully! We will contact you soon.");
        setFormData({ name: "", phone: "", helpText: "" });
      } else {
        alert(data.message || "Failed to submit application.");
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
            Join Our Mission
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Register to volunteer at Maa Astha Shelter
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ngo-green transition-colors"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ngo-green transition-colors"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              How can you help?
            </label>
            <textarea
              rows="3"
              placeholder="E.g., I can help teach kids, distribute food, etc."
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-ngo-green transition-colors resize-none"
              required
              value={formData.helpText}
              onChange={(e) => setFormData({ ...formData, helpText: e.target.value })}
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ngo-green text-white font-bold py-3 px-4 rounded-lg hover:bg-ngo-dark transition duration-300 shadow-md mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Volunteer;