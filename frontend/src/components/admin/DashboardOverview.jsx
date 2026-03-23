import React, { useState, useEffect } from "react";

const StatCard = ({ title, value, subtitle, colorClass }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium font-sans">
      {title}
    </h3>
    <p className={`text-3xl font-bold mt-2 font-heading ${colorClass}`}>
      {value}
    </p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-sans">
      {subtitle}
    </p>
  </div>
);

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalSheltered: 0,
    reunited: 0,
    medicalNeeds: 0,
    recentlyAdded: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/persons/stats");
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
        <h1 className="text-2xl font-bold text-ngo-dark dark:text-white font-heading transition-colors duration-300">
          Shelter Overview
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-sans transition-colors duration-300">
          Current status and recent activities at Maa Astha.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sheltered"
          value={isLoading ? "..." : stats.totalSheltered}
          subtitle="Currently in shelter"
          colorClass="text-ngo-green dark:text-green-400"
        />
        <StatCard
          title="Recently Added"
          value={isLoading ? "..." : stats.recentlyAdded}
          subtitle="Last 7 days"
          colorClass="text-ngo-light dark:text-green-300"
        />
        <StatCard
          title="Reunited"
          value={isLoading ? "..." : stats.reunited}
          subtitle="With family"
          colorClass="text-ngo-dark dark:text-white"
        />
        <StatCard
          title="Medical Needs"
          value={isLoading ? "..." : stats.medicalNeeds}
          subtitle="Requires attention"
          colorClass="text-ngo-red dark:text-red-400"
        />
      </div>
    </div>
  );
};

export default DashboardOverview;