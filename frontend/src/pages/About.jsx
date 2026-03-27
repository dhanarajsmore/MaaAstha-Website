import React from "react";
import { Link } from "react-router-dom";
import img1 from "../assets/about-1.jpg";

const About = () => {
  return (
    <div className="w-full bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <main className="max-w-7xl mx-auto py-16 px-6 md:px-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-ngo-dark-blue dark:text-white mb-4">
            Our Identity & Purpose
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto italic">
            "Maa Astha Foundation: A journey of compassion, healing, and hope."
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div className="space-y-12">
            <div className="relative p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl border-l-8 border-ngo-green shadow-sm transition-colors duration-300">
              <h2 className="text-3xl font-bold text-ngo-green mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                To provide a safe, dignified, and loving environment for the
                homeless, abandoned, and the destitute. We aim to be their
                family when they have none, ensuring they receive the best
                medical, nutritional, and emotional care possible.
              </p>
            </div>

            <div className="relative p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl border-l-8 border-ngo-blue shadow-sm transition-colors duration-300">
              <h2 className="text-3xl font-bold text-ngo-blue mb-4">
                Our Vision
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                A world where no individual is left behind on the streets. We
                envision a society that is sensitive to the needs of the
                homeless and works together to ensure every human being has
                access to basic necessities and a chance at a better life.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 justify-center">
            <img
              src={img1}
              alt="Healthcare"
              className="rounded-2xl shadow-xl h-72 w-full object-cover transform hover:scale-105 transition-all"
            />
            <div className="bg-ngo-dark-blue text-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-3 underline decoration-ngo-green">
                Our Core Values
              </h3>
              <ul className="list-disc list-inside space-y-2 opacity-90 text-lg">
                <li>Unconditional Compassion</li>
                <li>Inclusion for All Genders & Ages</li>
                <li>Total Transparency & Accountability</li>
                <li>Continuous Community Engagement</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mb-16 pt-10 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-ngo-dark dark:text-white mb-12">
            What We Do
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-20 h-20 mx-auto bg-green-50 dark:bg-gray-800 text-ngo-green rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm transition-colors duration-300">
                🤝
              </div>
              <h3 className="text-xl font-bold text-ngo-dark dark:text-white mb-3 font-heading">
                Rescue Operations
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-sans">
                Information milte hi humari team sadak par rehne wale bimar ya
                mentally challenged logon ko rescue karti hai.
              </p>
            </div>

            <div className="p-6">
              <div className="w-20 h-20 mx-auto bg-green-50 dark:bg-gray-800 text-ngo-green rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm transition-colors duration-300">
                🏠
              </div>
              <h3 className="text-xl font-bold text-ngo-dark dark:text-white mb-3 font-heading">
                Safe Shelter
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-sans">
                Rescue kiye gaye logon ko humare aashray me rakha jata hai,
                jahan unhe khana, kapde aur medical care milti hai.
              </p>
            </div>

            <div className="p-6">
              <div className="w-20 h-20 mx-auto bg-green-50 dark:bg-gray-800 text-ngo-green rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm transition-colors duration-300">
                👨‍👩‍👧‍👦
              </div>
              <h3 className="text-xl font-bold text-ngo-dark dark:text-white mb-3 font-heading">
                Family Reunion
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-sans">
                Police aur social media ki madad se hum in logon ke parivaar ko
                dhund kar unhe wapas milate hain.
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="bg-ngo-light py-16 px-4 text-center">
        <h2 className="text-3xl font-heading font-bold text-white mb-6">
          Be a Part of Our Journey
        </h2>
        <p className="text-green-50 mb-8 max-w-2xl mx-auto font-sans text-lg">
          Aapka thoda sa samay ya chhota sa yogdaan kisi ki zindagi badal sakta
          hai. Aaj hi humare sath judein.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/volunteer"
            className="bg-white text-ngo-dark hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition shadow-lg"
          >
            Join as Volunteer
          </Link>
          <Link
            to="/donate"
            className="bg-ngo-dark text-white hover:bg-gray-800 border border-white font-bold py-3 px-8 rounded-full transition shadow-lg"
          >
            Donate Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
