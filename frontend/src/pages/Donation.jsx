import React, { useState } from "react";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/donations/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert(
          "Donation logged successfully! We will verify and update the status."
        );
        setFormData({
          name: "",
          phone: "",
          amount: "",
          modeOfPayment: "",
          transactionId: "",
        });
      } else {
        alert(data.message || "Failed to submit.");
      }
    } catch (error) {
      alert("Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 font-heading">
            Support Our Mission
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Aapka ek chhota sa yogdaan kisi beghar ko aashray aur nayi zindagi
            de sakta hai.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="bg-[#2A3B2C] rounded-2xl p-8 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="text-2xl">🏦</span> Bank Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[#8F9F91] text-xs font-bold uppercase tracking-wider mb-1">
                    Account Name
                  </p>
                  <p className="text-lg font-semibold tracking-wide">
                    Maa Astha Shelter Project
                  </p>
                </div>
                <div>
                  <p className="text-[#8F9F91] text-xs font-bold uppercase tracking-wider mb-1">
                    Account Number
                  </p>
                  <p className="text-2xl font-mono font-bold tracking-widest">
                    1234 5678 9012
                  </p>
                </div>
                <div className="flex gap-10">
                  <div>
                    <p className="text-[#8F9F91] text-xs font-bold uppercase tracking-wider mb-1">
                      IFSC
                    </p>
                    <p className="font-mono font-semibold">SBIN000XXXX</p>
                  </div>
                  <div>
                    <p className="text-[#8F9F91] text-xs font-bold uppercase tracking-wider mb-1">
                      Bank
                    </p>
                    <p className="font-semibold">SBI, Ghansoli</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Scan & Pay
              </h3>
              <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-xl mb-6 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                <span className="text-gray-400 text-sm">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=maaastha@upi&pn=Maa+Astha+NGO" 
                    alt="Donation QR Code" 
                    className="w-full h-full object-cover p-2 bg-white"
                  />
                </span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-900 px-6 py-2 rounded-lg w-full">
                <p className="font-mono text-gray-800 dark:text-gray-300 font-semibold tracking-wide">
                  maaastha@upi
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 h-fit">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Log Donation
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Payment karne ke baad details yahan bharein.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Donor Name
                </label>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#567E5D] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Phone / Email
                </label>
                <input
                  required
                  name="phone"
                  type="text"
                  placeholder="For tax receipt"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#567E5D] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Amount (₹)
                  </label>
                  <input
                    required
                    name="amount"
                    type="number"
                    min="1"
                    placeholder="500"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#567E5D] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Mode of Payment
                  </label>
                  <select
                    required
                    name="modeOfPayment"
                    value={formData.modeOfPayment}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#567E5D] outline-none transition-all"
                  >
                    <option value="">Select App</option>
                    {paymentApps.map((app) => (
                      <option key={app} value={app}>
                        {app}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  UTR / REF NO.
                </label>
                <input
                  required
                  name="transactionId"
                  type="text"
                  placeholder="Transaction ID"
                  value={formData.transactionId}
                  onChange={handleChange}
                  className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#567E5D] outline-none transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#567E5D] hover:bg-[#436349] text-white font-bold py-4 rounded-xl transition-all shadow-md mt-4 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Confirm & Notify NGO"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;