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
        const res = await fetch("https://maaastha-website-bb9c.onrender.com/api/stories/all");
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
      {/* Hero Section with Marathi Subtitle */}
      <div className="bg-slate-950 pt-32 pb-20 px-6 text-center border-b-[8px] border-ngo-green">
        <div className="max-w-4xl mx-auto animate-fadeInUp">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
            Our Identity & Purpose
          </h1>
          <p className="text-emerald-400 font-bold text-xl mb-6 italic">
            आमची ओळख आणि उद्देश
          </p>
          <div className="w-24 h-1.5 bg-ngo-green mx-auto mb-8 rounded-full"></div>
          <p className="text-xl md:text-2xl text-slate-300 italic font-medium">
            "Maa Astha Foundation: A journey of compassion, healing, and hope."
            <br />
            <span className="text-lg text-slate-400 mt-2 block">
              "मा आस्ता फाउंडेशन: करुणा, उपचार आणि आशेचा प्रवास."
            </span>
          </p>
        </div>
      </div>

      {/* Sticky Navigation */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4">
          <ul className="flex justify-center sm:justify-between items-center overflow-x-auto custom-scrollbar gap-6 py-4">
            <li>
              <button
                onClick={() => scrollToSection(missionRef)}
                className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-ngo-green uppercase tracking-wider whitespace-nowrap transition-colors"
              >
                Mission & Vision / ध्येय आणि दृष्टी
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(operationsRef)}
                className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-ngo-green uppercase tracking-wider whitespace-nowrap transition-colors"
              >
                Core Operations / मुख्य कार्ये
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(impactRef)}
                className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-ngo-green uppercase tracking-wider whitespace-nowrap transition-colors"
              >
                Impact / प्रभाव
              </button>
            </li>
          </ul>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-20 px-6 md:px-12 space-y-32">
        {/* Mission & Vision Section */}
        <div
          ref={missionRef}
          className="scroll-mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <div className="space-y-10">
            <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:border-ngo-green transition-colors">
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 bg-green-50 dark:bg-emerald-900/30 text-ngo-green rounded-2xl flex items-center justify-center">
                  <Target size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    Our Mission
                  </h2>
                  <p className="text-ngo-green font-bold text-sm italic underline decoration-2">
                    आमचे ध्येय
                  </p>
                </div>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed relative z-10">
                To provide a safe, dignified, and loving environment for the
                homeless, abandoned, and destitute.
                <br />
                <span className="text-base text-slate-500 italic mt-3 block">
                  (बेघर, सोडून दिलेल्या आणि निराधार लोकांसाठी सुरक्षित,
                  सन्मानजनक आणि प्रेमळ वातावरण प्रदान करणे.)
                </span>
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:border-indigo-500 transition-colors">
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Eye size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                    Our Vision
                  </h2>
                  <p className="text-indigo-500 font-bold text-sm italic underline decoration-2">
                    आमची दृष्टी
                  </p>
                </div>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed relative z-10">
                A world where no individual is left behind on the streets. We
                envision a society that is sensitive to the needs of the
                homeless.
                <br />
                <span className="text-base text-slate-500 italic mt-3 block">
                  (असे जग जिथे कोणतीही व्यक्ती रस्त्यावर सोडून दिली जाणार नाही.
                  आम्ही अशा समाजाची कल्पना करतो जो बेघरांच्या गरजांबद्दल
                  संवेदनशील असेल.)
                </span>
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-ngo-green rounded-[3rem] transform rotate-3 scale-105 opacity-20 dark:opacity-40"></div>
            <img
              src={img1}
              alt="Care"
              className="relative rounded-[3rem] shadow-2xl w-full h-[600px] object-cover"
            />
          </div>
        </div>

        {/* Core Operations with Marathi Headers */}
        <div ref={operationsRef} className="scroll-mt-32">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-ngo-green uppercase mb-2">
              Core Operations / मुख्य कार्ये
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
              What We Do
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center hover:-translate-y-2 transition-all">
              <div className="w-20 h-20 mx-auto bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full flex items-center justify-center mb-6">
                <HandHeart size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Rescue Operations
              </h3>
              <p className="text-rose-600 text-xs font-bold mb-3">बचाव कार्य</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                माहिती मिळताच आमची टीम रस्त्यावरील आजारी किंवा मानसिकदृष्ट्या
                सक्षम नसलेल्या व्यक्तींना वाचवते.
              </p>
            </div>
            {/* Same logic for other two cards */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center hover:-translate-y-2 transition-all">
              <div className="w-20 h-20 mx-auto bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Safe Shelter & Care
              </h3>
              <p className="text-emerald-600 text-xs font-bold mb-3">
                सुरक्षित निवारा आणि काळजी
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                वाचवलेल्या लोकांना निवाऱ्यात अन्न, कपडे आणि वैद्यकीय सेवा दिली
                जाते.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center hover:-translate-y-2 transition-all">
              <div className="w-20 h-20 mx-auto bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-full flex items-center justify-center mb-6">
                <Users size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Family Reunion
              </h3>
              <p className="text-indigo-600 text-xs font-bold mb-3">
                कौटुंबिक पुनर्मिलन
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                पोलीस आणि सोशल मीडियाच्या मदतीने आम्ही या व्यक्तींना त्यांच्या
                कुटुंबाशी पुन्हा जोडतो.
              </p>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div ref={impactRef} className="scroll-mt-32">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-ngo-green uppercase mb-2">
              Impact / प्रभाव
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
              Transformations that Inspire
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto italic">
              "Real stories of hope and healing." <br /> (आशा आणि उपचारांच्या
              वास्तविक कथा.)
            </p>
          </div>

          {loading ? (
            <div className="text-center text-slate-500 py-10">
              Loading stories of impact...
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center text-slate-500 bg-slate-100 dark:bg-slate-800 p-10 rounded-3xl border border-slate-200">
              More success stories are being updated soon. Stay tuned!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stories.map((story) => (
                <div
                  key={story._id}
                  className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700"
                >
                  {/* Image Grid Logic kept same as original for backend data */}
                  <div className="grid grid-cols-2 h-48 sm:h-64 bg-slate-200">
                    <div className="relative border-r-4 border-white dark:border-slate-900">
                      <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                        Before (बचावपूर्वी)
                      </div>
                      <img
                        src={story.beforeImageUrl}
                        alt="Before"
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                        After (सुधारणा)
                      </div>
                      <img
                        src={story.afterImageUrl}
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-8">
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                      {story.title}
                    </h4>
                    {story.location && (
                      <p className="text-sm font-bold text-indigo-500 mb-4 flex items-center gap-1">
                        <MapPin size={14} /> {story.location}
                      </p>
                    )}
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                      {story.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* CTA Section */}
      <div className="bg-indigo-50 dark:bg-slate-950 py-24 px-4 text-center border-t border-indigo-100 dark:border-slate-800">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
          Be a Part of Our Journey
        </h2>
        <p className="text-indigo-600 font-bold mb-10 italic">
          आमच्या प्रवासाचा भाग व्हा
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/volunteer"
            className="bg-slate-900 text-white hover:bg-ngo-green font-bold py-4 px-10 rounded-xl transition-all shadow-lg"
          >
            Join as Volunteer / स्वयंसेवक व्हा
          </Link>
          <Link
            to="/donate"
            className="bg-slate-900 text-white hover:bg-ngo-green font-bold py-4 px-10 rounded-xl transition-all shadow-lg"
          >
            Donate Now / देणगी द्या
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default About;
