import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-ngo-green text-white py-12 mt-16">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Column 1 */}
        <div>
          <h3 className="text-xl font-bold mb-4 font-heading">Maa Astha</h3>
          <p className="text-gray-200">
            Helping families reunite with their missing loved ones.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="font-bold mb-4 text-white font-heading">Home</h4>
          <ul className="space-y-2 text-gray-200">
            <li>
              <Link to="/about" className="hover:text-white transition">
                About us
              </Link>
            </li>
            <li>
              <Link to="/missing" className="hover:text-white transition">
                Missing People
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="font-bold mb-4 text-white font-heading">More</h4>
          <ul className="space-y-2 text-gray-200">
            <li>
              <Link to="/" className="hover:text-white transition">
                Projects
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-white transition">
                Events
              </Link>
            </li>
            <li>
              <Link to="/donate" className="hover:text-white transition">
                Donate
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4 - Donation */}
        <div>
          <h4 className="font-bold mb-4 text-white font-heading">
            Donate and make a difference!
          </h4>
          <p className="text-gray-200 mb-4">
            Your support helps us bring families back together.
          </p>
          <Link
            to="/donate"
            className="block w-full text-center bg-white text-ngo-green px-6 py-3 rounded-md font-bold text-base hover:bg-gray-100 transition shadow-sm"
          >
            Donate Now
          </Link>
        </div>
      </div>

      {/* Bottom Footer Area (Cleaned) */}
      <div className="container mx-auto px-6 mt-12 pt-6 border-t border-white/20 flex justify-center items-center text-sm text-gray-300">
        <p className="text-center">
          © {new Date().getFullYear()} Maa Astha Samajik Vikas Seva Sanstha. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
