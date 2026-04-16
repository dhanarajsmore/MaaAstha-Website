import React, { useState } from "react";

const Volunteer = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    idType: "",
    idNumber: "",
    profession: "",
    phone: "",
    email: "",
    address: "",
    helpText: "",
    availability: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("https://maaastha-website-bb9c.onrender.com/api/volunteers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert(
          "Application submitted successfully! / अर्ज यशस्वीरित्या सादर केला!",
        );
        setFormData({
          name: "",
          gender: "",
          age: "",
          idType: "",
          idNumber: "",
          profession: "",
          phone: "",
          email: "",
          address: "",
          helpText: "",
          availability: "",
        });
      }
    } catch (error) {
      alert("Something went wrong. / काहीतरी चुकीचे घडले.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      {/* Background Soft Blurs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 dark:bg-indigo-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            Join as a Volunteer
          </h1>
          <p className="text-indigo-600 font-bold text-xl mb-4 italic">
            स्वयंसेवक म्हणून सहभागी व्हा
          </p>
          <div className="w-24 h-1.5 bg-indigo-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Your time and skills can change someone's life forever.
            <br />
            <span className="text-sm italic block mt-1 font-medium">
              (तुमचा वेळ आणि कौशल्ये कोणाचे तरी आयुष्य कायमचे बदलू शकतात.)
            </span>
          </p>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-800 transition-all">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name / पूर्ण नाव *
                </label>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Gender / लिंग *
                </label>
                <select
                  required
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="">Select Gender / लिंग निवडा</option>
                  <option value="Male">Male / पुरुष</option>
                  <option value="Female">Female / स्त्री</option>
                  <option value="Other">Other / इतर</option>
                </select>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Age / वय *
                </label>
                <input
                  required
                  name="age"
                  type="number"
                  placeholder="Your age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* ID Type */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ID Type / ओळखपत्राचा प्रकार *
                </label>
                <select
                  required
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="">Select ID / निवडा</option>
                  <option value="Aadhar Card">Aadhar Card / आधार कार्ड</option>
                  <option value="Pan Card">Pan Card / पॅन कार्ड</option>
                  <option value="Voter ID">Voter ID / मतदान कार्ड</option>
                  <option value="Other">Other / इतर</option>
                </select>
              </div>
            </div>

            {/* Profession & Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Profession / व्यवसाय *
                </label>
                <input
                  required
                  name="profession"
                  type="text"
                  placeholder="e.g. Student, Doctor, Teacher"
                  value={formData.profession}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number / फोन नंबर *
                </label>
                <input
                  required
                  name="phone"
                  type="tel"
                  placeholder="10 digit number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Help Text */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                How can you help? / आपण कशी मदत करू शकता? *
              </label>
              <textarea
                required
                name="helpText"
                rows="3"
                placeholder="e.g. Rescue operations, medical help, teaching..."
                value={formData.helpText}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-200 dark:shadow-none disabled:opacity-50 text-lg"
            >
              {isSubmitting
                ? "Submitting... / अर्ज पाठवत आहे..."
                : "Submit Application / अर्ज सादर करा"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
