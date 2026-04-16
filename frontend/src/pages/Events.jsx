import React, { useState, useEffect } from "react";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://maaastha-website-bb9c.onrender.com/api/events/all");
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
    <div className="pt-32 pb-20 min-h-screen font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      {/* Background Soft Blurs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 dark:bg-indigo-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            Our Work & Events
          </h1>
          <p className="text-indigo-600 font-bold text-xl mb-4 italic">
            आमचे कार्य आणि कार्यक्रम
          </p>
          <div className="w-24 h-1.5 bg-indigo-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            A glimpse into the ground activities, rescue operations, and
            awareness programs conducted by our team.
            <br />
            <span className="text-sm italic block mt-2 font-medium">
              (आमच्या टीमद्वारे राबवले जाणारे उपक्रम, बचाव कार्य आणि जनजागृती
              कार्यक्रमांची एक झलक.)
            </span>
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-500 font-bold">
              Loading events... / माहिती लोड होत आहे...
            </p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((evt) => (
              <div
                key={evt._id}
                className="group bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-xl border border-white dark:border-slate-800 transition-all hover:scale-[1.02]"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg text-xs font-black text-indigo-600 uppercase tracking-widest">
                    {new Date(evt.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    {evt.title}
                  </h3>
                  <div className="text-sm text-indigo-600 dark:text-indigo-400 font-bold mb-4 flex items-center gap-2">
                    <span className="bg-indigo-50 dark:bg-indigo-900/30 p-1.5 rounded-lg">
                      📍
                    </span>{" "}
                    {evt.location}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-medium">
                    {evt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
            <div className="text-6xl mb-6">📸</div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
              No Events Found Yet
            </h3>
            <p className="text-indigo-600 font-bold italic mb-2">
              अद्याप कोणताही कार्यक्रम सापडला नाही.
            </p>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Stay tuned! We will update this section soon with our latest
              activities.
              <br />
              <span className="text-xs italic">
                (आमच्या नवीन उपक्रमांची माहिती लवकरच येथे अपडेट केली जाईल.)
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
