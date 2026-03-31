import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  UserPlus,
  Database,
  HeartHandshake,
  Users,
  AlertCircle,
  CalendarDays,
  UserSearch,
  Mail,
  LogOut,
  FileText, 
} from "lucide-react";
import { CiLight, CiDark } from "react-icons/ci";

import DashboardOverview from "../components/admin/DashboardOverview";
import AddPerson from "../components/admin/AddPerson";
import Records from "../components/admin/Records";
import Donations from "../components/admin/Donations";
import Volunteers from "../components/admin/Volunteers";
import RescueRequests from "../components/admin/RescueRequests";
import ContactMessages from "../components/admin/ContactMessages";
import MissingReports from "../components/admin/MissingReports";
import ManageEvents from "../components/admin/ManageEvents";
import ManageStories from "../components/admin/ManageStories";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const adminName = localStorage.getItem("adminName") || "Admin";
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "add", label: "Add Person", icon: <UserPlus size={20} /> },
    { id: "records", label: "View Records", icon: <Database size={20} /> },
    { id: "events", label: "Manage Events", icon: <CalendarDays size={20} /> },
    { id: "donations", label: "Donations", icon: <HeartHandshake size={20} /> },
    { id: "volunteers", label: "Volunteers", icon: <Users size={20} /> },
    { id: "rescues", label: "Rescue Alerts", icon: <AlertCircle size={20} /> },
    {
      id: "missing-reports",
      label: "Missing Claims",
      icon: <UserSearch size={20} />,
    },
    { id: "stories", label: "Manage Stories", icon: <FileText size={20} /> }, // Added this
    { id: "contacts", label: "Inbox", icon: <Mail size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminName");
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "add":
        return <AddPerson />;
      case "records":
        return <Records />;
      case "events":
        return <ManageEvents />;
      case "donations":
        return <Donations />;
      case "volunteers":
        return <Volunteers />;
      case "rescues":
        return <RescueRequests />;
      case "missing-reports":
        return <MissingReports />;
      case "stories": // Added this
        return <ManageStories />;
      case "contacts":
        return <ContactMessages />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed md:relative z-50 w-64 h-full bg-white dark:bg-slate-900 shadow-2xl md:shadow-none flex flex-col border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-heading tracking-tight">
              Maa Astha
            </h2>
            <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5">
              Admin Portal
            </p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-red-500"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <span
                className={
                  activeTab === item.id
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-400"
                }
              >
                {item.icon}
              </span>
              <span className="text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-100 dark:border-slate-800 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 className="font-extrabold text-slate-800 dark:text-slate-100 capitalize text-xl font-heading">
              {activeTab.replace("-", " ")}
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
              <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-xs">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {adminName}
              </span>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              title="Toggle Theme"
            >
              {theme === "light" ? (
                <CiDark size={22} strokeWidth={1} />
              ) : (
                <CiLight
                  size={22}
                  className="text-yellow-400"
                  strokeWidth={1}
                />
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all font-bold text-sm shadow-sm"
            >
              <span className="hidden sm:inline">Logout</span>
              <LogOut size={18} strokeWidth={2.5} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto h-full">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
