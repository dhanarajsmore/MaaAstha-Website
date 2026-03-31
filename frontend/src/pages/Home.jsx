import React from "react";
import { Link } from "react-router-dom";
import buildingImage from "../assets/building.jpg";

const Home = () => {
  return (
    <div className="w-full">
      <section
        className="relative h-[75vh] w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${buildingImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl tracking-tight">
            MAA ASTHA FOUNDATION
          </h1>
          <div className="w-32 h-2 bg-ngo-green mx-auto mb-10 rounded-full"></div>
          <p className="text-2xl md:text-3xl text-ngo-green font-bold italic mb-6">
            "Compassion in Action, Dignity in Life"
          </p>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-medium">
            Beghar Nivara Kendra, Ghansoli is more than just a shelter; it is a
            center for transformation. We work tirelessly to provide immediate
            relief and long-term rehabilitation for the abandoned, elderly, and
            mentally challenged citizens of our society.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-800 text-sans">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-ngo-dark-blue dark:text-white mb-6">
                Our Holistic Approach
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                At Maa Astha Foundation, we believe that providing a meal is
                only the first step. Our comprehensive care model includes
                psychiatric evaluation, hygiene management, and identifying the
                root causes of homelessness for each resident.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-2xl">🏥</span>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Healthcare:</strong> Daily medical rounds and
                    emergency tie-ups with NMMC hospitals.
                  </p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-2xl">⚖️</span>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Legal Aid:</strong> Help in recovering lost
                    documents like Aadhaar and Voter IDs for residents.
                  </p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-2xl">🤝</span>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Reintegration:</strong> Skill training sessions to
                    help able residents find small-scale employment.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-ngo-light-gray dark:bg-gray-700 p-10 rounded-3xl border-t-8 border-ngo-green shadow-xl">
              <h3 className="text-2xl font-bold text-ngo-dark-blue dark:text-white mb-6 underline decoration-ngo-green">
                Our Core Values
              </h3>
              <div className="space-y-6 text-lg">
                <p className="text-gray-800 dark:text-gray-200">
                  <strong>Dignity:</strong> Every person is treated as a family
                  member, not a beneficiary.
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <strong>Transparency:</strong> Every rupee donated and every
                  life rescued is recorded with full accountability.
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  <strong>Sustainability:</strong> Creating long-term solutions
                  for homelessness rather than temporary fixes.
                </p>
                <p className="mt-8 italic text-ngo-blue font-semibold text-center border-t border-gray-300 dark:border-gray-600 pt-6">
                  "Serving the homeless is not charity, it is our duty towards
                  humanity."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="p-8">
            <h3 className="text-5xl font-black text-ngo-green mb-2">X+</h3>
            <p className="text-gray-500 font-bold uppercase tracking-widest">
              Residents On-Site
            </p>
          </div>
          <div className="p-8 border-x border-gray-200 dark:border-gray-700">
            <h3 className="text-5xl font-black text-ngo-blue mb-2">X+</h3>
            <p className="text-gray-500 font-bold uppercase tracking-widest">
              Total Rescues
            </p>
          </div>
          <div className="p-8">
            <h3 className="text-5xl font-black text-ngo-green mb-2">X%</h3>
            <p className="text-gray-500 font-bold uppercase tracking-widest">
              Health Recovery Rate
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20 text-center max-w-3xl">
        <h2 className="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-4">
          KNOW ABOUT US
        </h2>
        <h3 className="text-3xl md:text-4xl font-heading font-bold text-ngo-dark dark:text-white mb-6 transition-colors duration-300">
          We provide a place for the homeless with special needs
        </h3>
        <p className="text-gray-500 dark:text-gray-300 mb-8 leading-relaxed transition-colors duration-300">
          Humara maqsad beghar, besahara aur gumm hue logon ko unki manzil aur
          parivaar tak pohochana hai. Maa Astha sirf ek NGO nahi, ek aasha ki
          kiran hai.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/about"
            className="inline-block bg-ngo-light text-white px-8 py-3 rounded-md font-medium hover:bg-ngo-green transition shadow-sm"
          >
            Learn more
          </Link>
          <Link
            to="/missing"
            className="inline-block bg-ngo-red text-white px-8 py-3 rounded-md font-medium hover:bg-red-700 transition shadow-sm"
          >
            Find Missing People
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;