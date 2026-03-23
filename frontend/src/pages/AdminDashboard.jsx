import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardOverview from "../components/admin/DashboardOverview";
import AddPerson from "../components/admin/AddPerson";
import Records from "../components/admin/Records";
import Donations from "../components/admin/Donations";
import Volunteers from "../components/admin/Volunteers";
import RescueRequests from "../components/admin/RescueRequests";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "add", label: "Add Person", icon: "➕" },
    { id: "records", label: "View Records", icon: "📁" },
    { id: "donations", label: "Donations", icon: "💰" },
    { id: "volunteers", label: "Volunteers", icon: "🤝" },
    { id: "rescues", label: "Rescue Alerts", icon: "🚨" },
  ];

  const handleLogout = () => {
    navigate("/admin");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "add":
        return <AddPerson />;
      case "records":
        return <Records />;
      case "donations":
        return <Donations />;
      case "volunteers":
        return <Volunteers />;
      case "rescues":
        return <RescueRequests />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300 overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed md:relative z-50 w-64 h-full bg-white dark:bg-gray-800 shadow-2xl md:shadow-lg flex flex-col border-r border-transparent dark:border-gray-700 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-ngo-dark dark:text-white font-heading">
              Maa Astha
            </h2>
            <p className="text-xs text-ngo-green dark:text-green-400 mt-1 font-semibold tracking-wide">
              ADMIN PORTAL
            </p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-ngo-red focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? "bg-green-50 dark:bg-gray-700 text-ngo-green dark:text-green-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 p-4 flex justify-between items-center transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 className="font-semibold text-gray-700 dark:text-white capitalize font-heading text-xl">
              {activeTab.replace("-", " ")}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
              title="Toggle Theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-50 dark:bg-red-900/30 text-ngo-red dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium shadow-sm border border-red-100 dark:border-red-900/50 text-sm sm:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
