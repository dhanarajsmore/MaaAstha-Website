import React, { useState } from "react";

const RescueRequest = () => {
  const [formData, setFormData] = useState({
    location: "",
    condition: "",
    reporterName: "",
    reporterPhone: "",
    photo: null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("location", formData.location);
      submitData.append("condition", formData.condition);
      submitData.append("reporterName", formData.reporterName);
      submitData.append("reporterPhone", formData.reporterPhone);
      if (formData.photo) {
        // 🔥 FIX: 'photo' ki jagah 'image' kar diya taaki backend ka multer na fate
        submitData.append("image", formData.photo);
      }

      const res = await fetch("http://localhost:5000/api/rescue-requests/add", {
        method: "POST",
        body: submitData,
      });
      const data = await res.json();

      if (data.success) {
        alert("Rescue alert sent successfully! Help is on the way.");
        setFormData({
          location: "",
          condition: "",
          reporterName: "",
          reporterPhone: "",
          photo: null,
        });
        document.getElementById("photo-upload").value = "";
      } else {
        alert(data.message || "Failed to send alert.");
      }
    } catch (error) {
      alert("Server error. Please try again or call the emergency number.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-red-100 text-ngo-red px-4 py-1 rounded-full text-sm font-bold tracking-wider mb-4 animate-pulse">
            🚨 EMERGENCY RESPONSE
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-ngo-dark dark:text-white mb-4">
            Request a Rescue
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Agar aapko sadak par koi beghar, bimar ya mentally challenged insaan
            dikhe jise turant madad ki zaroorat hai, toh ye form bharein.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-ngo-red text-white p-8 rounded-2xl shadow-lg text-center">
              <h2 className="text-2xl font-bold font-heading mb-2">
                Need Urgent Help?
              </h2>
              <p className="text-red-100 mb-6">
                Form bharne ka time nahi hai? Direct call karein:
              </p>
              <div className="bg-white text-ngo-red text-3xl font-mono font-bold py-4 rounded-xl shadow-inner">
                +91 98765 43210
              </div>
              <p className="mt-4 text-sm font-medium">
                Available 24/7 in Navi Mumbai/Kalyan
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="font-bold font-heading text-ngo-dark dark:text-white text-lg mb-4 flex items-center gap-2">
                📋 Rescue Guidelines
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-ngo-green">✓</span> Kripya exact
                  location aur landmark batayein.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ngo-green">✓</span> Agar possible ho,
                  toh team aane tak us insaan ke paas hi rahein.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ngo-green">✓</span> Dur se ek photo
                  zaroor kheenchiye aur upload karein.
                </li>
                <li className="flex items-start gap-2 text-red-500 font-semibold">
                  <span>⚠️</span> Fake requests na dalein, ye kisi ki jaan ka
                  sawal ho sakta hai.
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:w-2/3 bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-xl border-t-4 border-ngo-red transition-colors duration-300">
            <h2 className="text-2xl font-heading font-bold text-ngo-dark dark:text-white mb-6">
              Rescue Details Form
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Exact Location / Landmark{" "}
                  <span className="text-ngo-red">*</span>
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-red focus:border-ngo-red outline-none transition-colors"
                  placeholder="E.g., Outside Kalyan Station Platform 1 ticket counter"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Description of the Person's Condition{" "}
                  <span className="text-ngo-red">*</span>
                </label>
                <textarea
                  required
                  rows="3"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-ngo-green transition-colors resize-none"
                  placeholder="Kapde kaise pehne hain? Chot lagi hai kya? Age kitni lag rahi hai?"
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData({ ...formData, condition: e.target.value })
                  }
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Upload Photo (Optional but Highly Recommended)
                </label>
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 dark:file:bg-gray-600 file:text-ngo-red dark:file:text-red-400 hover:file:bg-red-100 transition-colors"
                  onChange={(e) =>
                    setFormData({ ...formData, photo: e.target.files[0] })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-red focus:border-ngo-red outline-none transition-colors"
                    placeholder="Enter your name"
                    value={formData.reporterName}
                    onChange={(e) =>
                      setFormData({ ...formData, reporterName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Your Phone Number <span className="text-ngo-red">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-ngo-red focus:border-ngo-red outline-none transition-colors"
                    placeholder="So we can contact you"
                    value={formData.reporterPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reporterPhone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ngo-red text-white font-bold text-lg py-4 rounded-lg hover:bg-red-700 transition-colors duration-300 shadow-lg mt-4 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>🚨</span> {loading ? "Sending..." : "Send Rescue Alert"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescueRequest;
