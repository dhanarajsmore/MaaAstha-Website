import React, { useState, useEffect } from "react";

const StatCard = ({ title, value, subtitle, colorClass }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 text-center">
    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium font-sans">
      {title}
    </h3>
    <p className={`text-3xl font-bold mt-2 font-heading ${colorClass}`}>
      {value}
    </p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-sans italic">
      {subtitle}
    </p>
  </div>
);

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalSheltered: 0,
    reunited: 0,
    escaped: 0,
    dead: 0,
    selfExited: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch("http://localhost:5000/api/persons/stats", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Stats fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
          Shelter Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-sans mt-1 text-sm">
          Current status of residents at Maa Astha.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="In Shelter"
          value={isLoading ? "..." : stats.totalSheltered}
          subtitle="Active residents"
          colorClass="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Reunited"
          value={isLoading ? "..." : stats.reunited}
          subtitle="Back to family"
          colorClass="text-indigo-600 dark:text-indigo-400"
        />
        <StatCard
          title="Self Exited"
          value={isLoading ? "..." : stats.selfExited}
          subtitle="Left on own"
          colorClass="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Escaped"
          value={isLoading ? "..." : stats.escaped}
          subtitle="Ran away"
          colorClass="text-orange-500 dark:text-orange-400"
        />
        <StatCard
          title="Dead"
          value={isLoading ? "..." : stats.dead}
          subtitle="Passed away"
          colorClass="text-red-600 dark:text-red-500"
        />
      </div>
    </div>
  );
};

export default DashboardOverview;