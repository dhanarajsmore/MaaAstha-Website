import React from "react";
import { useNavigate } from "react-router-dom";

const MissingPersonCard = ({ person }) => {
  const navigate = useNavigate();

  const imageUrl = person.imageUrl || person.image;
  const imageSrc = imageUrl 
    ? (imageUrl.startsWith("http") ? imageUrl : `https://maaastha-website-bb9c.onrender.com${imageUrl}`) 
    : "https://via.placeholder.com/300x400?text=No+Image";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
        <img
          src={imageSrc}
          alt={person.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = "https://via.placeholder.com/300x400?text=Image+Not+Found"; }}
        />
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-md tracking-wider">
          MISSING
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold font-heading text-gray-900 dark:text-white mb-3">
            {person.name}
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p>
              <span className="font-semibold text-gray-800 dark:text-gray-200">Age:</span> {person.age} years
            </p>
            <p>
              <span className="font-semibold text-gray-800 dark:text-gray-200">Missing Since:</span> {person.missingSince}
            </p>
            <p>
              <span className="font-semibold text-gray-800 dark:text-gray-200">Last Seen:</span> {person.location}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/report-missing', { state: person })}
          className="w-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-bold py-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-200 dark:border-red-800/50 shadow-sm flex justify-center items-center gap-2 mt-auto"
        >
          <span>🚨</span> I Have Info / Claim
        </button>
      </div>
    </div>
  );
};

export default MissingPersonCard;