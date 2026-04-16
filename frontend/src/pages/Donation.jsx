import React, { useState } from "react";
import { Heart, Landmark, Smartphone, ShieldCheck } from "lucide-react";

const Donation = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    amount: "",
    modeOfPayment: "",
    transactionId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentApps = [
    "Google Pay (GPay)",
    "PhonePe",
    "Paytm",
    "Amazon Pay",
    "BHIM UPI",
    "Bank Transfer (NEFT/IMPS)",
    "Other",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("https://maaastha-website-bb9c.onrender.com/api/donations/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert(
          "Donation details submitted! / देणगीचा तपशील यशस्वीरित्या सादर केला!",
        );
        setFormData({
          name: "",
          phone: "",
          amount: "",
          modeOfPayment: "",
          transactionId: "",
        });
      }
    } catch (error) {
      alert("Something went wrong. / काहीतरी चुकीचे घडले.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      {/* Background Soft Blurs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-indigo-200/30 dark:bg-indigo-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            Support Our Cause
          </h1>
          <p className="text-emerald-600 font-bold text-xl mb-4 italic">
            आमच्या कार्याला हातभार लावा
          </p>
          <div className="w-24 h-1.5 bg-emerald-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Your small contribution can provide a meal or medicine to someone in
            need.
            <br />
            <span className="text-sm italic block mt-1 font-medium">
              (तुमची छोटीशी मदत कोणाचे तरी आयुष्य बदलू शकते.)
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side: QR & Bank Details */}
          <div className="space-y-8">
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Smartphone className="text-emerald-600" /> UPI Payment / युपीआय
                पेमेन्ट
              </h2>
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-3xl shadow-inner mb-6 border-4 border-slate-50">
                  {/* Replace this with your actual QR image */}
                  <img
                    src="/qr-placeholder.png"
                    alt="QR Code"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <p className="text-center font-bold text-slate-800 dark:text-slate-200 text-lg mb-1">
                  UPI ID: maaastha@upi
                </p>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-black italic">
                  Scan to donate / स्कॅन करून देणगी द्या
                </p>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Landmark className="text-indigo-600" /> Bank Transfer / बँक
                तपशील
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-bold">Account Name:</span>
                  <span>Maa Astha Foundation</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-bold">Bank:</span>
                  <span>HDFC Bank</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-bold">IFSC Code:</span>
                  <span className="font-mono">HDFC000XXXX</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Account No:</span>
                  <span className="font-mono">XXXXXXXXXXXX</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Notification Form */}
          <div className="bg-slate-900 text-white p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>

            <h2 className="text-3xl font-black mb-2 relative z-10">
              Notify Us
            </h2>
            <p className="text-emerald-400 font-bold mb-8 italic">
              पेमेंट केल्यावर आम्हाला कळवा
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Full Name / पूर्ण नाव
                </label>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    Amount / रक्कम
                  </label>
                  <input
                    required
                    name="amount"
                    type="number"
                    placeholder="₹"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    Phone / फोन
                  </label>
                  <input
                    required
                    name="phone"
                    type="tel"
                    placeholder="10 Digits"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Payment App / पेमेन्ट ॲप
                </label>
                <select
                  required
                  name="modeOfPayment"
                  value={formData.modeOfPayment}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value="">Select App</option>
                  {paymentApps.map((app) => (
                    <option key={app} value={app}>
                      {app}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Transaction ID / ट्रांझॅक्शन आयडी
                </label>
                <input
                  required
                  name="transactionId"
                  type="text"
                  placeholder="UTR / Ref No."
                  value={formData.transactionId}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 text-lg"
              >
                <ShieldCheck size={24} />
                {isSubmitting
                  ? "Processing..."
                  : "Confirm Donation / खात्री करा"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;
