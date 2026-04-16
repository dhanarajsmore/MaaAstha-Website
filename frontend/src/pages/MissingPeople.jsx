import React, { useState, useEffect } from "react";
import MissingPersonCard from "../components/MissingPersonCard";
import { Search, Filter, Users } from "lucide-react";

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
          "https://maaastha-website-bb9c.onrender.com/api/missing-persons/all",
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
    <div className="pt-32 pb-20 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            Missing People
          </h1>
          <p className="text-ngo-green font-bold text-xl mb-4 italic">
            हरवलेल्या व्यक्ती
          </p>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg">
            Help us reunite these individuals with their families. If you
            recognize someone, please contact us immediately.
            <br />
            <span className="text-sm italic block mt-1 font-medium">
              (या व्यक्तींना त्यांच्या कुटुंबाशी पुन्हा जोडण्यासाठी आम्हाला मदत
              करा. आपण कोणाला ओळखत असल्यास, कृपया आमच्याशी त्वरित संपर्क साधा.)
            </span>
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 mb-12 flex flex-col lg:flex-row gap-6 items-center">
          {/* Search Input */}
          <div className="relative flex-grow w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name... / नावाने शोधा..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-ngo-green outline-none transition-all"
            />
          </div>

          {/* Age Filters */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Filter size={16} className="text-ngo-green" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Age / वय:
              </span>
              <input
                type="number"
                placeholder="Min"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                className="w-16 p-2 bg-transparent text-slate-900 dark:text-white outline-none text-center font-bold"
              />
              <span className="text-slate-300">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                className="w-16 p-2 bg-transparent text-slate-900 dark:text-white outline-none text-center font-bold"
              />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-ngo-green border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-500 font-bold">
              Loading cases... / माहिती लोड होत आहे...
            </p>
          </div>
        ) : filteredPersons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPersons.map((person) => (
              <MissingPersonCard key={person._id} person={person} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] shadow-inner border border-dashed border-slate-200 dark:border-slate-800">
            <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={40} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
              No active cases found.
            </h3>
            <p className="text-ngo-green font-bold mb-6 italic">
              सध्या कोणतीही नोंद सापडली नाही.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setMinAge("");
                setMaxAge("");
              }}
              className="text-indigo-600 font-bold hover:underline"
            >
              Clear all filters / सर्व फिल्टर्स काढा
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissingPeople;
