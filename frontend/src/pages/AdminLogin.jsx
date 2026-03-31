import React, { useState } from "react";
import { ShieldCheck, UserRound, KeyRound, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 🚀 IMPORT ADDED

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // 🚀 HOOK ADDED

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("adminToken", data.data.token);
        localStorage.setItem("adminRole", data.data.role);
        localStorage.setItem("adminName", data.data.username);

        // 🚀 THE FIX: IN-PLACE ROUTING WITHOUT RELOAD
        navigate("/admin-dashboard");
      } else {
        setError(data.message || "Invalid credentials!");
      }
    } catch (err) {
      setError("Server connection failed. Backend on hai?");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🚀 min-h-screen ko min-h-[80vh] kar diya taaki UI fit baithe
    <div className="min-h-[80vh] flex items-center justify-center p-4 font-sans transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
        <div className="bg-[#1A2E24] p-8 text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm mb-4 border border-white/20">
              <ShieldCheck
                size={36}
                className="text-[#A3E6B4]"
                strokeWidth={2.5}
              />
            </div>
            <h2 className="text-2xl font-extrabold text-white font-heading tracking-wide">
              Admin Portal
            </h2>
            <p className="text-[#8F9F91] text-sm mt-1">
              Maa Astha Shelter Project
            </p>
          </div>
          <ShieldCheck className="absolute -bottom-10 -right-10 text-white/5 w-48 h-48 rotate-12" />
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800/50 rounded-xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm font-semibold">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <UserRound size={18} />
                </div>
                <input
                  required
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2A3B2C] outline-none transition-all font-medium"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Secure Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <KeyRound size={18} />
                </div>
                <input
                  required
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2A3B2C] outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2A3B2C] hover:bg-[#1A2E24] text-white font-bold py-4 rounded-xl transition-all shadow-lg mt-6 flex justify-center items-center gap-2 disabled:opacity-70 text-lg"
            >
              {loading ? "Verifying..." : "Access Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
