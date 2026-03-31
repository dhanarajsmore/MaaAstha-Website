import React, { useState, useEffect } from "react";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events/all");
        const data = await response.json();
        if (data.success) {
          setEvents(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="pt-24 pb-20 min-h-screen font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Our Work & Events
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            A glimpse into the ground activities, rescue operations, and
            community drives conducted by Maa Astha NGO.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400 text-lg">
            Loading our journey...
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((evt) => (
              <div
                key={evt._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={
                      evt.imageUrl.startsWith("http")
                        ? evt.imageUrl
                        : `http://localhost:5000${evt.imageUrl}`
                    }
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Event+Photo";
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-indigo-700 dark:text-indigo-400 font-bold px-3 py-1.5 rounded-lg shadow-sm text-sm">
                    {new Date(evt.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold font-heading text-gray-900 dark:text-white mb-2">
                    {evt.title}
                  </h3>
                  <div className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mb-4 flex items-center gap-1">
                    <span>📍</span> {evt.location}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-2xl font-bold font-heading text-gray-800 dark:text-white mb-2">
              No Events Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Stay tuned! We will update this section with our latest activities
              soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
