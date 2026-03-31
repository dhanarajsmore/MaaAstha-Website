import React, { useState } from "react";
import {
  MapPin,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Phone,
  User,
  Info,
} from "lucide-react";

const RescueRequest = () => {
  const [formData, setFormData] = useState({
    manualLocation: "",
    gpsLocation: "",
    gpsUrl: "",
    condition: "",
    reporterName: "",
    reporterPhone: "",
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("idle");

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert(
        "Your browser does not support GPS. Please type the location manually.",
      );
      return;
    }

    setGpsStatus("fetching");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;

        setFormData((prev) => ({
          ...prev,
          gpsLocation: `GPS Pin: ${mapLink}`,
          gpsUrl: mapLink, // Save raw link
        }));
        setGpsStatus("success");
      },
      (error) => {
        alert(
          "Failed to get location. Please enable GPS permissions or type the location manually.",
        );
        setGpsStatus("idle");
      },
    );
  };

  const removeGps = () => {
    setFormData((prev) => ({ ...prev, gpsLocation: "" }));
    setGpsStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.manualLocation.trim() && !formData.gpsLocation) {
      alert(
        "Please provide either a manual location description or attach your GPS location.",
      );
      return;
    }

    setLoading(true);
    try {
      let finalLocation = "";
      if (formData.manualLocation && formData.gpsLocation) {
        finalLocation = `${formData.gpsLocation}\nLandmark/Details: ${formData.manualLocation}`;
      } else if (formData.gpsLocation) {
        finalLocation = formData.gpsLocation;
      } else {
        finalLocation = formData.manualLocation;
      }

      const submitData = new FormData();
      submitData.append("location", finalLocation);
      submitData.append("condition", formData.condition);
      submitData.append("reporterName", formData.reporterName);
      submitData.append("reporterPhone", formData.reporterPhone);
      if (formData.photo) {
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
          manualLocation: "",
          gpsLocation: "",
          condition: "",
          reporterName: "",
          reporterPhone: "",
          photo: null,
        });
        setGpsStatus("idle");
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
    <div className="pt-24 pb-20 px-4 font-sans bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider mb-6 shadow-sm border border-rose-200">
            <AlertTriangle size={16} /> EMERGENCY RESPONSE
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Request a Rescue
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            If you see a homeless, injured, or mentally challenged person on the
            streets who needs immediate assistance, please fill out this form.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-rose-600 text-white p-8 rounded-3xl shadow-xl shadow-rose-900/20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-20">
                <Phone size={100} />
              </div>
              <h2 className="text-2xl font-black mb-2 relative z-10">
                Need Urgent Help?
              </h2>
              <p className="text-rose-100 mb-6 relative z-10">
                No time to fill the form? Call us directly:
              </p>
              <div className="bg-white text-rose-600 text-3xl font-mono font-black py-4 rounded-2xl shadow-inner relative z-10">
                +91 98765 43210
              </div>
              <p className="mt-4 text-sm font-medium relative z-10 text-rose-100">
                Available 24/7 in Navi Mumbai
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
                <Info className="text-indigo-500" /> Rescue Guidelines
              </h3>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-0.5">
                    <CheckCircle2 size={16} />
                  </span>
                  <span>
                    Provide the exact location or a recognizable landmark.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-0.5">
                    <CheckCircle2 size={16} />
                  </span>
                  <span>
                    If possible, stay near the person until our team arrives.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-0.5">
                    <CheckCircle2 size={16} />
                  </span>
                  <span>
                    Upload a photo from a safe distance to help us identify
                    them.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg mt-2">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>
                    Please do not submit fake requests; a life might be at
                    stake.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:w-2/3 bg-white dark:bg-slate-800 p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 transition-colors duration-300">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                  <label className="block text-base font-bold text-slate-900 dark:text-white">
                    Where is the person?{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    Step 1 of 3
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    {gpsStatus === "success" ? (
                      <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 p-4 rounded-xl">
                        <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
                          <MapPin size={20} className="animate-bounce" />
                          <span className="font-bold">Location Attached</span>
                          <a
                            href={formData.gpsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-xs font-bold bg-white dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 px-3 py-1 rounded-md border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                          >
                            View on Map
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={removeGps}
                          className="text-sm font-semibold text-rose-500 hover:text-rose-700 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={getLocation}
                        disabled={gpsStatus === "fetching"}
                        className="w-full flex items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 rounded-xl font-bold transition-all disabled:opacity-70"
                      >
                        {gpsStatus === "fetching" ? (
                          <>
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>{" "}
                            Fetching GPS...
                          </>
                        ) : (
                          <>
                            <MapPin size={20} /> Use My Current GPS Location
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="md:col-span-2 relative flex items-center py-2">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">
                      AND / OR
                    </span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                  </div>

                  <div className="md:col-span-2">
                    <textarea
                      rows="2"
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors resize-none placeholder:text-slate-400"
                      placeholder="Type landmark or manual address here (e.g., Outside Kalyan Station Platform 1)"
                      value={formData.manualLocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          manualLocation: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                  <label className="block text-base font-bold text-slate-900 dark:text-white">
                    Condition & Details <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    Step 2 of 3
                  </span>
                </div>
                <textarea
                  required
                  rows="3"
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors resize-none placeholder:text-slate-400"
                  placeholder="Describe what they are wearing, any visible injuries, apparent age, or state of mind."
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData({ ...formData, condition: e.target.value })
                  }
                ></textarea>

                <div className="mt-4">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Camera size={16} /> Upload Photo (Highly Recommended)
                  </label>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-slate-200 dark:file:bg-slate-700 file:text-slate-700 dark:file:text-slate-200 hover:file:bg-slate-300 transition-colors"
                    onChange={(e) =>
                      setFormData({ ...formData, photo: e.target.files[0] })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                  <label className="block text-base font-bold text-slate-900 dark:text-white">
                    Your Contact Info
                  </label>
                  <span className="text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    Step 3 of 3
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <User size={16} /> Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-colors placeholder:text-slate-400"
                      placeholder="Optional"
                      value={formData.reporterName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reporterName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <Phone size={16} /> Phone{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-colors placeholder:text-slate-400"
                      placeholder="For location verification"
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-600 text-white font-black text-lg py-4 rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-900/20 mt-8 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1"
              >
                {loading ? "Transmitting Alert..." : "SEND EMERGENCY ALERT"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default RescueRequest;
