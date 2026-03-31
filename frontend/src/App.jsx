import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import MissingPeople from "./pages/MissingPeople";
import RescueRequest from "./pages/RescueRequest";
import Contact from "./pages/Contact";
import Donation from "./pages/Donation";
import AdminLogin from "./pages/AdminLogin";
import Volunteer from "./pages/Volunteer";
import AdminDashboard from "./pages/AdminDashboard";
import ReportForm from "./pages/ReportForm";
import Events from "./pages/Events";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin-dashboard");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <div
        className={`${!isAdminRoute ? "pt-24" : ""} min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300`}
      >
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/missing" element={<MissingPeople />} />
            <Route path="/rescue" element={<RescueRequest />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donation />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/report-missing" element={<ReportForm />} />
            <Route path="/events" element={<Events />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
