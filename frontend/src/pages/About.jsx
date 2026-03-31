import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  HandHeart,
  ShieldCheck,
  Users,
  MapPin,
  Heart,
} from "lucide-react";
import img1 from "../assets/about-1.jpg";

const About = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const missionRef = useRef(null);
  const operationsRef = useRef(null);
  const impactRef = useRef(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/stories/all");
        const json = await res.json();
        if (json.success) setStories(json.data);
      } catch (error) {
        console.error("Failed to fetch stories");
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop - 100,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen font-sans transition-colors duration-300">
      <div className="bg-slate-950 pt-32 pb-20 px-6 text-center border-b-[8px] border-ngo-green">
        <div className="max-w-4xl mx-auto animate-fadeInUp">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Our Identity & Purpose
          </h1>
          <div className="w-24 h-1.5 bg-ngo-green mx-auto mb-8 rounded-full"></div>
          <p className="text-xl md:text-2xl text-slate-300 italic font-medium">
            "Maa Astha Foundation: A journey of compassion, healing, and hope."
          </p>
        </div>
      </div>

      <div className="sticky top-16 md:top-20 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4">
          <ul className="flex justify-center sm:justify-between items-center overflow-x-auto custom-scrollbar gap-6 py-4">
            <li>
              <button
                onClick={() => scrollToSection(missionRef)}
                className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-ngo-green dark:hover:text-ngo-green uppercase tracking-wider whitespace-nowrap transition-colors"
              >
                Mission & Vision
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(operationsRef)}
                className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-ngo-green dark:hover:text-ngo-green uppercase tracking-wider whitespace-nowrap transition-colors"
              >
                Core Operations
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(impactRef)}
                className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-ngo-green dark:hover:text-ngo-green uppercase tracking-wider whitespace-nowrap transition-colors"
              >
                Impact & Stories
              </button>
            </li>
          </ul>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-20 px-6 md:px-12 space-y-32">
        <div
          ref={missionRef}
          className="scroll-mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <div className="space-y-10">
            <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:border-ngo-green transition-colors">
              <div className="absolute top-0 right-0 p-6 opacity-5 transform group-hover:scale-110 transition-transform">
                <Target size={120} />
              </div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 bg-green-50 dark:bg-emerald-900/30 text-ngo-green rounded-2xl flex items-center justify-center">
                  <Target size={28} strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed relative z-10">
                To provide a safe, dignified, and loving environment for the
                homeless, abandoned, and destitute. We aim to be their family
                when they have none, ensuring they receive the best medical,
                nutritional, and emotional care possible.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:border-indigo-500 transition-colors">
              <div className="absolute top-0 right-0 p-6 opacity-5 transform group-hover:scale-110 transition-transform">
                <Eye size={120} />
              </div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Eye size={28} strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                  Our Vision
                </h2>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed relative z-10">
                A world where no individual is left behind on the streets. We
                envision a society that is sensitive to the needs of the
                homeless and works together to ensure every human being has
                access to basic necessities and a chance at a better life.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-ngo-green rounded-[3rem] transform rotate-3 scale-105 opacity-20 dark:opacity-40"></div>
            <img
              src={img1}
              alt="Healthcare and Care"
              className="relative rounded-[3rem] shadow-2xl w-full h-[600px] object-cover"
            />
          </div>
        </div>

        <div ref={operationsRef} className="scroll-mt-32">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-ngo-green uppercase mb-2">
              Core Operations
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
              What We Do
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 mx-auto bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full flex items-center justify-center mb-6">
                <HandHeart size={36} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Rescue Operations
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Information milte hi humari team sadak par rehne wale bimar ya
                mentally challenged logon ko rescue karti hai.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 mx-auto bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={36} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Safe Shelter & Care
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Rescue kiye gaye logon ko humare aashray me rakha jata hai,
                jahan unhe khana, kapde aur medical care milti hai.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 mx-auto bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-full flex items-center justify-center mb-6">
                <Users size={36} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Family Reunion
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Police aur social media ki madad se hum in logon ke parivaar ko
                dhund kar unhe wapas milate hain.
              </p>
            </div>
          </div>
        </div>

        <div ref={impactRef} className="scroll-mt-32">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-ngo-green uppercase mb-2">
              Impact
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
              Transformations that Inspire
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Real stories of hope, healing, and reunions made possible by our
              dedicated team and your continuous support.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-slate-500 py-10">
              Loading stories of impact...
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center text-slate-500 bg-slate-100 dark:bg-slate-800 p-10 rounded-3xl border border-slate-200 dark:border-slate-700">
              More success stories are being updated soon. Stay tuned!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stories.map((story) => (
                <div
                  key={story._id}
                  className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col"
                >
                  <div className="grid grid-cols-2 h-48 sm:h-64 bg-slate-200 dark:bg-slate-700">
                    <div className="relative border-r-4 border-white dark:border-slate-900">
                      <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded shadow">
                        Before (Rescued)
                      </div>
                      <img
                        src={story.beforeImageUrl}
                        alt="Before"
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded shadow">
                        After (Recovered)
                      </div>
                      <img
                        src={story.afterImageUrl}
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                      {story.title}
                    </h4>
                    {story.location && (
                      <p className="text-sm font-bold text-indigo-500 mb-4 flex items-center gap-1">
                        <MapPin size={14} /> {story.location}
                      </p>
                    )}
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed flex-1 whitespace-pre-line">
                      {story.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <div className="bg-indigo-50 dark:bg-slate-950 py-24 px-4 text-center border-t border-indigo-100 dark:border-slate-800 transition-colors duration-300">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
          Be a Part of Our Journey
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto text-lg">
          Aapka thoda sa samay ya chhota sa yogdaan kisi ki zindagi badal sakta
          hai. Aaj hi humare sath judein.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/volunteer"
            className="bg-slate-900 text-white hover:bg-ngo-green dark:bg-white dark:text-slate-950 dark:hover:bg-ngo-green dark:hover:text-white font-bold py-4 px-10 rounded-xl transition-colors shadow-lg"
          >
            Join as Volunteer
          </Link>
          <Link
            to="/donate"
            className="bg-transparent border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-slate-950 font-bold py-4 px-10 rounded-xl transition-colors shadow-lg"
          >
            Donate Now
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default About;
