import React, { useState, useEffect } from "react";
import MissingPersonCard from "../components/MissingPersonCard";

const MissingPeople = () => {
  const [missingPersons, setMissingPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissingPersons = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/missing-persons/all",
        );
        const data = await response.json();
        if (data.success) {
          setMissingPersons(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch missing persons", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMissingPersons();
  }, []);

  const filteredPersons = missingPersons.filter((person) => {
    const matchName = person.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchMinAge = minAge === "" || person.age >= parseInt(minAge);
    const matchMaxAge = maxAge === "" || person.age <= parseInt(maxAge);
    return matchName && matchMinAge && matchMaxAge;
  });

  return (
    <div className="pt-24 pb-12 font-sans transition-colors duration-300 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Help Us Find Them
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Agar aapne inme se kisi ko bhi dekha hai, toh turant NGO ko inform
            karein. Ek call kisi ki zindagi badal sakti hai.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-10 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between transition-colors duration-300">
          <div className="w-full md:w-1/2 relative">
            <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-colors"
            />
          </div>

          <div className="w-full md:w-1/2 flex gap-4 items-center md:justify-end">
            <span className="text-gray-600 dark:text-gray-300 font-semibold hidden md:block">
              Age:
            </span>
            <input
              type="number"
              placeholder="Min"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
              className="w-full md:w-24 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-colors text-center"
            />
            <span className="text-gray-400 dark:text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
              className="w-full md:w-24 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-colors text-center"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            Loading cases...
          </div>
        ) : filteredPersons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPersons.map((person) => (
              <MissingPersonCard key={person._id} person={person} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="text-6xl mb-4">🤷‍♂️</div>
            <h3 className="text-2xl font-bold font-heading text-gray-800 dark:text-white mb-2">
              No active cases right now.
            </h3>
            <button
              onClick={() => {
                setSearchTerm("");
                setMinAge("");
                setMaxAge("");
              }}
              className="mt-6 text-green-600 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissingPeople;
