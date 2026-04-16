import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import buildingImage from "../assets/landing-hero.jpg";

const AnimatedCounter = ({ end, label, marathiLabel, colorClass }) => {
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
    <div className="p-8 transform hover:-translate-y-2 transition-transform duration-300 text-center">
      <h3
        className={`text-5xl md:text-6xl font-black ${colorClass} mb-2 drop-shadow-sm`}
      >
        {count}
      </h3>
      <p className="text-gray-700 dark:text-gray-200 font-bold uppercase tracking-widest text-sm">
        {label}
      </p>
      {/* Marathi Translation for Stats */}
      <p className="text-ngo-green font-medium text-xs mt-1 italic">
        ({marathiLabel})
      </p>
    </div>
  );
};

const Home = () => {
  const [stats, setStats] = useState({ sheltered: 0, rescued: 0, reunited: 0 });

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const res = await fetch("https://maaastha-website-bb9c.onrender.com/api/persons/stats");
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
      {/* Hero Section */}
      <section
        className="relative h-[85vh] w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${buildingImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="inline-block bg-ngo-green text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-widest mb-4 shadow-lg">
            NMMC URBAN HOMELESS SHELTER
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-2 drop-shadow-2xl">
            MAA&nbsp;&nbsp;ASTHA&nbsp;&nbsp;SAMAJIK&nbsp;&nbsp;
            VIKAS&nbsp;&nbsp;SEWA&nbsp;&nbsp;SANSTHA
          </h1>
          <p className="text-emerald-400 font-bold text-xl mb-6">
            मा आस्था सामाजिक विकास सेवा संस्था
          </p>

          <div className="w-24 h-1.5 bg-ngo-green mx-auto mb-6 rounded-full"></div>

          <div className="mb-10">
            <p className="text-xl md:text-3xl text-gray-200 font-medium italic drop-shadow-md">
              "Compassion in Action, Dignity in Life"
            </p>
            <p className="text-lg text-emerald-200 mt-2 font-medium">
              "कृतीतून करुणा, जीवनात प्रतिष्ठा"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/rescue"
              className="bg-rose-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-rose-700 transition-all shadow-xl"
            >
              🚨 Emergency Rescue / आपत्कालीन बचाव
            </Link>
            <Link
              to="/donate"
              className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
            >
              Support Us / आम्हाला सहकार्य करा
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16 z-20 max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-slate-700 overflow-hidden">
          <AnimatedCounter
            end={stats.sheltered}
            label="Residents"
            marathiLabel="येथील निवासी"
            colorClass="text-ngo-green"
          />
          <AnimatedCounter
            end={stats.rescued}
            label="Total Rescues"
            marathiLabel="एकूण बचाव"
            colorClass="text-indigo-600 dark:text-indigo-400"
          />
          <AnimatedCounter
            end={stats.reunited}
            label="Reunited"
            marathiLabel="कुटुंबाशी भेट"
            colorClass="text-emerald-500"
          />
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-24 bg-ngo-base dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-sm font-bold tracking-widest text-ngo-green uppercase mb-2">
                  What We Do / आम्ही काय करतो
                </h2>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
                  Our Holistic Approach <br />
                  <span className="text-2xl text-ngo-green font-bold">
                    आमचा सर्वांगीण दृष्टिकोन
                  </span>
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                At Maa Astha Foundation, we believe that providing a meal is
                only the first step. Our model includes psychiatric evaluation
                and hygiene management.
                <br />
                <span className="text-slate-500 dark:text-slate-500 italic text-base mt-2 block">
                  (मा आस्ता फाउंडेशनमध्ये, आमचा असा विश्वास आहे की जेवण देणे हे
                  केवळ पहिले पाऊल आहे. आमच्या मॉडेलमध्ये मानसोपचार मूल्यमापन आणि
                  स्वच्छता व्यवस्थापन समाविष्ट आहे.)
                </span>
              </p>

              {/* Feature Cards */}
              <div className="space-y-4">
                <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4">
                  <span className="text-3xl">🏥</span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Healthcare / आरोग्य सेवा
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm italic">
                      Daily medical rounds and psychiatric treatment. (दैनंदिन
                      वैद्यकीय फेऱ्या आणि मानसोपचार उपचार.)
                    </p>
                  </div>
                </div>
                <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4">
                  <span className="text-3xl">🤝</span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Family Reunion / कौटुंबिक पुनर्मिलन
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm italic">
                      Relentless efforts to reunite missing persons. (हरवलेल्या
                      व्यक्तींना पुन्हा एकत्र आणण्यासाठी सतत प्रयत्न.)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Values Box */}
            <div className="bg-ngo-dark p-10 md:p-14 rounded-[3rem] shadow-2xl text-white">
              <h3 className="text-3xl font-black mb-2">Our Core Values</h3>
              <p className="text-emerald-400 font-bold mb-8 italic">
                आमची मूळ मूल्ये
              </p>

              <div className="space-y-6">
                <div className="border-l-4 border-ngo-green pl-4">
                  <h4 className="text-xl font-bold">Dignity (प्रतिष्ठा)</h4>
                  <p className="text-slate-300 text-sm italic">
                    Every person is treated as family. (प्रत्येक व्यक्तीला
                    कुटुंबाप्रमाणे वागणूक दिली जाते.)
                  </p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h4 className="text-xl font-bold">
                    Transparency (पारदर्शकता)
                  </h4>
                  <p className="text-slate-300 text-sm italic">
                    Full accountability of every rupee. (प्रत्येक रुपयाची पूर्ण
                    जबाबदारी.)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="bg-ngo-green py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-3xl md:text-5xl font-black text-white mb-4">
            Help Us Bring Them Home
          </h3>
          <p className="text-xl text-white mb-2 font-bold italic underline underline-offset-8 decoration-emerald-300">
            त्यांना घरी पोहोचवण्यासाठी आम्हाला मदत करा
          </p>
          <p className="text-emerald-50 text-lg mb-10 mt-6 leading-relaxed">
            Humara maqsad beghar, besahara aur gumm hue logon ko unki manzil tak
            pohochana hai.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/about"
              className="bg-white text-ngo-green px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-slate-50 transition"
            >
              Read Stories / कथा वाचा
            </Link>
            <Link
              to="/missing"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-ngo-green transition"
            >
              Find People / व्यक्ती शोधा
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
