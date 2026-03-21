import React, { useState } from "react";

const Donation = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    amount: "",
    referenceId: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/donations/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          paymentMode: "UPI/Bank Transfer",
          status: "Pending", // Default status for manual verification
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(
          "Thank you! Your donation details are submitted for verification. We will issue the receipt shortly.",
        );
        setFormData({ name: "", phone: "", amount: "", referenceId: "" });
      } else {
        alert(data.message || "Failed to submit details.");
      }
    } catch (error) {
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen font-sans transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-ngo-dark dark:text-white mb-4">
            Support Our Mission
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Aapka ek chhota sa yogdaan kisi beghar ko aashray aur nayi zindagi
            de sakta hai.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Payment Info */}
          <div className="space-y-6">
            <div className="bg-ngo-dark text-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-heading font-bold mb-6 flex items-center">
                <span className="mr-3">🏦</span> Bank Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-ngo-light uppercase tracking-widest">
                    Account Name
                  </p>
                  <p className="text-lg font-semibold">
                    Maa Astha Shelter Project
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ngo-light uppercase tracking-widest">
                    Account Number
                  </p>
                  <p className="text-xl font-mono">1234 5678 9012</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-ngo-light uppercase tracking-widest">
                      IFSC
                    </p>
                    <p className="font-mono">SBIN000XXXX</p>
                  </div>
                  <div>
                    <p className="text-xs text-ngo-light uppercase tracking-widest">
                      Bank
                    </p>
                    <p>SBI, Ghansoli</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-heading font-bold text-ngo-dark dark:text-white mb-4">
                Scan & Pay
              </h2>
              <div className="bg-gray-50 dark:bg-white p-4 rounded-xl inline-block mb-4">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                  alt="QR"
                  className="w-40 h-40"
                />
              </div>
              <p className="text-sm font-mono font-bold text-ngo-dark dark:text-white bg-gray-100 dark:bg-gray-700 py-2 rounded">
                maaastha@upi
              </p>
            </div>
          </div>

          {/* Right Side: Log Form */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border-t-4 border-ngo-green">
            <h2 className="text-2xl font-heading font-bold text-ngo-dark dark:text-white mb-2">
              Log Donation
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Payment karne ke baad details yahan bharein.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Donor Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-ngo-green outline-none"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Phone / Email
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-ngo-green outline-none"
                  placeholder="For tax receipt"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    Amount (₹)
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-ngo-green outline-none"
                    placeholder="500"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    UTR / Ref No.
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-ngo-green outline-none"
                    placeholder="Transaction ID"
                    value={formData.referenceId}
                    onChange={(e) =>
                      setFormData({ ...formData, referenceId: e.target.value })
                    }
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ngo-green text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Confirm & Notify NGO"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;
