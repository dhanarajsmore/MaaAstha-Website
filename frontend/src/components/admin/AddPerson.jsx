import React, { useState } from "react";

const AddPerson = () => {
  const initialForm = {
    uid: "", 
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          dataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch("https://maaastha-website-bb9c.onrender.com/api/persons/add", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: dataToSend,
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Record saved successfully! " + (formData.uid ? `(UID: ${formData.uid})` : ""));
        setFormData(initialForm);
        document.getElementById("photo-upload").value = "";
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      alert("⚠️ Backend connection error!");
    } finally {
      setIsSubmitting(false);
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
        <h3 className="text-sm font-bold text-ngo-green dark:text-green-400 uppercase tracking-wider mb-2">
          1. Personal Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          
          <div>
            <label className="block text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              Unique ID (UID)
            </label>
            <input
              type="text"
              placeholder="e.g. MA-2024-001"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border-2 border-indigo-100 dark:border-indigo-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.uid}
              onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name (बेघर लाभार्थीचे नाव) *
            </label>
            <input
              type="text"
              required
              placeholder="Enter full name"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-green outline-none"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age (वय) *</label>
            <input
              type="number"
              required
              placeholder="Age"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-green outline-none"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender (लिंग) *</label>
            <select
              required
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-green outline-none"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option value="Select" disabled>Select</option>
              <option value="Male">Male (पुरुष)</option>
              <option value="Female">Female (स्त्री)</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <h3 className="text-sm font-bold text-ngo-green dark:text-green-400 uppercase tracking-wider mb-2 mt-6">
          2. Contact & Identity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address / Found At (पत्ता) *</label>
            <input
              type="text"
              required
              placeholder="Last known address"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-green outline-none"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile No. (मोबाईल क्र.)</label>
            <input
              type="tel"
              placeholder="If available"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-green outline-none"
              value={formData.mobileNo}
              onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID Document No.</label>
            <input
              type="text"
              placeholder="Aadhar, Voter ID, PAN"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-green outline-none"
              value={formData.idDocument}
              onChange={(e) => setFormData({ ...formData, idDocument: e.target.value })}
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-ngo-green dark:text-green-400 uppercase tracking-wider mb-2 mt-6">
          3. Admission Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Arrival Date & Time *</label>
            <input
              type="datetime-local"
              required
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-green outline-none"
              value={formData.arrivalDateTime}
              onChange={(e) => setFormData({ ...formData, arrivalDateTime: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brought By *</label>
            <input
              type="text"
              required
              placeholder="e.g., Police, NGO Team"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-green outline-none"
              value={formData.broughtBy}
              onChange={(e) => setFormData({ ...formData, broughtBy: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Coming *</label>
            <input
              type="text"
              required
              placeholder="e.g., Homeless, Missing"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-green outline-none"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Photo</label>
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              className="w-full px-4 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-green outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:bg-green-50 file:text-ngo-green hover:file:bg-green-100 transition-colors"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Physical Condition / Remarks</label>
            <textarea
              rows="2"
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-green outline-none resize-none"
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setFormData(initialForm)}
            className="px-6 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 text-white bg-ngo-green hover:bg-ngo-dark rounded-lg shadow-md font-bold disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "💾 Save Record"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPerson;