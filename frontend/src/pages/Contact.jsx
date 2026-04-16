import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Clock,
  User,
  MessageCircle,
} from "lucide-react";
// DHYAAN DE: Apni .jpg ya .png background image ka sahi naam yahan check kar lena 👇
import contactBg from "../assets/contact-bg.jpg";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://maaastha-website-bb9c.onrender.com/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(
          "Message sent successfully! Our team will contact you soon. / संदेश यशस्वीरित्या पाठवला गेला!",
        );
        setFormData({
          name: "",
          phone: "",
          email: "",
          subject: "General Inquiry",
          message: "",
        });
      } else {
        alert("Failed to send message. / संदेश पाठवण्यात अयशस्वी.");
      }
    } catch (error) {
      alert(
        "Server error. Please try again later. / सर्व्हर त्रुटी. कृपया नंतर पुन्हा प्रयत्न करा.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // FIX: Maine `min-h-screen` ke saath background image set ki hai
    <div
      className="pt-32 pb-20 min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans relative"
      // Background Image styling yahan add ki hai 👇
      style={{
        backgroundImage: `url(${contactBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark Overlay adding blur and gradient to make text readable */}
      <div className="absolute inset-0 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-[2px]"></div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header Section (Over Dark Background) */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
            Get In Touch
          </h1>
          <p className="text-emerald-400 font-bold text-xl mb-6 italic underline decoration-2 underline-offset-8">
            संपर्क साधा
          </p>
          <p className="text-slate-100 max-w-2xl mx-auto text-xl leading-relaxed font-medium">
            Koi sawal hai? Ya kisi ki madad karna chahte hain? Humse sampark
            karein.
            <br />
            <span className="text-base italic text-slate-300 mt-3 block font-normal">
              (काही प्रश्न आहेत का? किंवा कोणाला मदत करू इच्छिता? आमच्याशी
              संपर्क साधा, आमची टीम लवकरच आपल्याशी बोलेल.)
            </span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Side: Contact Details Card (Kept same style) */}
          <div className="lg:w-1/3 w-full space-y-6">
            <div className="bg-ngo-dark text-white rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden h-full border border-emerald-900/50">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-10 border-b border-emerald-800 pb-4 flex items-center gap-3">
                  <User size={24} className="text-ngo-green" /> Contact Info /
                  माहिती
                </h2>

                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="bg-emerald-800/50 p-3 rounded-xl text-ngo-green">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">
                        Our Location / पत्ता
                      </h3>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        NMMC Urban Homeless Shelter, Sector 3, Ghansoli, Navi
                        Mumbai - 400701
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="bg-emerald-800/50 p-3 rounded-xl text-ngo-green">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">
                        Call Us / फोन
                      </h3>
                      <p className="text-2xl font-black">+91 98765 43210</p>
                      <div className="flex items-center gap-1 mt-1.5 text-rose-400 text-xs font-bold">
                        <Clock size={12} /> 24/7 Emergencies / आपत्कालीन
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="bg-emerald-800/50 p-3 rounded-xl text-ngo-green">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">
                        Email / ईमेल
                      </h3>
                      <p className="text-slate-200">contact@maaastha.org</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Background Decoration */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-ngo-green opacity-10 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* Right Side: Contact Form (Updated style over image) */}
          <div className="lg:w-2/3 w-full bg-white/90 dark:bg-slate-900/90 rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100/50 dark:border-slate-800/50 transition-all backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-ngo-light/30 dark:bg-emerald-950/30 text-ngo-green rounded-xl flex items-center justify-center">
                <MessageCircle size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                  Send a Message
                </h2>
                <p className="text-ngo-green font-bold text-sm italic">
                  संदेश पाठवा
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-8"></div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    Full Name / पूर्ण नाव
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-100/70 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-600 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-ngo-green outline-none transition-all font-medium"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    Phone / फोन नंबर
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-100/70 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-600 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-ngo-green outline-none transition-all font-medium"
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Email Address / ईमेल
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-100/70 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-600 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-ngo-green outline-none transition-all font-medium"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Your Message / आपला संदेश
                </label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-100/70 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-600 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-ngo-green outline-none transition-all resize-none font-medium"
                  rows="5"
                  placeholder="How can we help you? / आम्ही तुम्हाला कशी मदत करू शकतो?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ngo-green text-white font-black py-5 rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/30 text-lg flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={20} /> Send Message / संदेश पाठवा
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
