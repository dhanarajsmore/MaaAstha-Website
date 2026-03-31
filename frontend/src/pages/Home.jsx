import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import buildingImage from "../assets/building.jpg";

const AnimatedCounter = ({ end, label, colorClass }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);

    if (end === 0) {
      setCount(0);
      return;
    }

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="p-8 transform hover:-translate-y-2 transition-transform duration-300">
      <h3
        className={`text-5xl md:text-6xl font-black ${colorClass} mb-2 drop-shadow-sm`}
      >
        {count}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-sm">
        {label}
      </p>
    </div>
  );
};

const Home = () => {
  const [stats, setStats] = useState({ sheltered: 0, rescued: 0, reunited: 0 });

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/persons/stats");
        const json = await res.json();
        if (json.success) {
          setStats({
            sheltered: json.data.totalSheltered || 0,
            rescued: json.data.rescuedPeople || 0,
            reunited: json.data.reunited || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch live stats");
      }
    };
    fetchLiveStats();
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <section
        className="relative h-[85vh] w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${buildingImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        <div className="relative z-10 text-center px-4 max-w-5xl animate-fadeInUp">
          <div className="inline-block bg-ngo-green text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-widest mb-6 shadow-lg">
            NMMC URBAN HOMELESS SHELTER
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tight leading-tight">
            MAA ASTHA <br /> FOUNDATION
          </h1>
          <div className="w-24 h-1.5 bg-ngo-green mx-auto mb-8 rounded-full"></div>
          <p className="text-xl md:text-3xl text-gray-200 font-medium italic mb-10 drop-shadow-md">
            "Compassion in Action, Dignity in Life"
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/rescue"
              className="bg-rose-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-rose-700 hover:scale-105 transition-all shadow-xl shadow-rose-900/50"
            >
              🚨 Emergency Rescue
            </Link>
            <Link
              to="/donate"
              className="bg-white text-ngo-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl"
            >
              Support Our Cause
            </Link>
          </div>
        </div>
      </section>

      <section className="relative -mt-16 z-20 max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-slate-700">
          <AnimatedCounter
            end={stats.sheltered}
            label="Residents On-Site"
            colorClass="text-ngo-green"
          />
          <AnimatedCounter
            end={stats.rescued}
            label="Total Rescues"
            colorClass="text-indigo-600 dark:text-indigo-400"
          />
          <AnimatedCounter
            end={stats.reunited}
            label="Families Reunited"
            colorClass="text-emerald-500"
          />
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-slate-900 text-sans transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-sm font-bold tracking-widest text-ngo-green uppercase mb-2">
                  What We Do
                </h2>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                  Our Holistic <br /> Approach to Care
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                At Maa Astha Foundation, we believe that providing a meal is
                only the first step. Our comprehensive care model includes
                psychiatric evaluation, hygiene management, and identifying the
                root causes of homelessness.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:shadow-md transition-shadow border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                  <span className="text-3xl bg-white dark:bg-slate-700 p-3 rounded-xl shadow-sm">
                    🏥
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                      Healthcare & Recovery
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Daily medical rounds, psychiatric treatment, and emergency
                      tie-ups with NMMC hospitals.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:shadow-md transition-shadow border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                  <span className="text-3xl bg-white dark:bg-slate-700 p-3 rounded-xl shadow-sm">
                    ⚖️
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                      Identity & Legal Aid
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Help in recovering lost documents like Aadhaar and Voter
                      IDs to restore their civic rights.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:shadow-md transition-shadow border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                  <span className="text-3xl bg-white dark:bg-slate-700 p-3 rounded-xl shadow-sm">
                    🤝
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                      Family Reintegration
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Relentless efforts by our team to locate families and
                      reunite missing persons safely.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-10 md:p-14 rounded-[3rem] border-t-[10px] border-ngo-green shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">
                💚
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8 relative z-10">
                Our Core Values
              </h3>
              <div className="space-y-8 relative z-10">
                <div className="flex gap-4">
                  <div className="w-1.5 bg-ngo-green rounded-full"></div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      Dignity
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      Every person is treated as a family member, not just a
                      beneficiary.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1.5 bg-indigo-500 rounded-full"></div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      Transparency
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      Every rupee donated and every life rescued is recorded
                      with full accountability.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1.5 bg-rose-500 rounded-full"></div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      Sustainability
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      Creating long-term solutions for homelessness rather than
                      temporary fixes.
                    </p>
                  </div>
                </div>

                <div className="mt-10 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-inner border border-slate-100 dark:border-slate-700">
                  <p className="italic text-slate-700 dark:text-slate-300 font-semibold text-center text-lg">
                    "Serving the homeless is not charity, it is our duty towards
                    humanity."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-ngo-green dark:bg-emerald-900 py-20 text-center transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-3xl md:text-5xl font-heading font-black text-white mb-6">
            Help Us Bring Them Home
          </h3>
          <p className="text-emerald-100 text-lg mb-10 leading-relaxed">
            Humara maqsad beghar, besahara aur gumm hue logon ko unki manzil aur
            parivaar tak pohochana hai. Maa Astha sirf ek NGO nahi, ek aasha ki
            kiran hai.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/about"
              className="bg-white text-ngo-green px-8 py-3.5 rounded-lg font-bold hover:bg-slate-50 transition shadow-lg"
            >
              Read Our Stories
            </Link>
            <Link
              to="/missing"
              className="bg-transparent border-2 border-white text-white px-8 py-3.5 rounded-lg font-bold hover:bg-white hover:text-ngo-green transition shadow-lg"
            >
              Find Missing People
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default Home;
