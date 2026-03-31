import React, { useState, useEffect } from "react";
import { CheckCircle, Trash2, Eye, User, Briefcase, Phone, Mail, MapPin, HeartHandshake, CalendarClock, Cake, Contact } from "lucide-react";

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("active");
  const [selectedVol, setSelectedVol] = useState(null);

  const adminRole = localStorage.getItem("adminRole");

  const loadVolunteers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken"); 
      const res = await fetch("http://localhost:5000/api/volunteers/all", {
        headers: { "Authorization": `Bearer ${token}` } 
      });
      const json = await res.json();
      if (json.success) setVolunteers(json.data);
    } catch (e) { console.error("Failed", e); } 
    finally { setLoading(false); }
  };

  useEffect(() => { loadVolunteers(); }, []);

  const handleVerify = async (id) => {
    if (!window.confirm("Mark this volunteer as Verified?")) return;
    try {
      const token = localStorage.getItem("adminToken"); 
      const res = await fetch(`http://localhost:5000/api/volunteers/update/${id}`, {
        method: "PATCH", 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        }, 
        body: JSON.stringify({ status: "Verified" }),
      });
      if (res.ok) {
        loadVolunteers();
        setSelectedVol(null);
      }
    } catch (e) { alert("Failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete permanently?")) return;
    try {
      const token = localStorage.getItem("adminToken"); 
      const res = await fetch(`http://localhost:5000/api/volunteers/delete/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` } 
      });
      const data = await res.json();
      if (res.ok) {
        loadVolunteers();
        setSelectedVol(null);
      } else {
        alert(data.message || "Delete failed!");
      }
    } catch (e) { alert("Delete failed"); }
  };

  const filteredVolunteers = volunteers.filter((v) => 
    viewMode === "active" ? v.status !== "Verified" : v.status === "Verified"
  );

  const DetailRow = ({ icon: Icon, label, value, isFullWidth }) => (
    <div className={`flex items-start gap-3.5 ${isFullWidth ? 'col-span-full' : ''}`}>
      <div className="mt-0.5 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
        <Icon size={18} strokeWidth={2.2} />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 leading-relaxed">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300 relative font-sans">
      
      <div className="p-7 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white font-heading">Volunteers Pool</h2>
          <span className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 block">Review applications and manage NGO's support force</span>
        </div>
        <div className="flex gap-2.5 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl w-fit border border-slate-200 dark:border-slate-700/50">
          <button onClick={() => setViewMode("active")} className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${viewMode === "active" ? "bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-indigo-600"}`}>
            New Applications {viewMode === "active" && <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs">{filteredVolunteers.length}</span>}
          </button>
          <button onClick={() => setViewMode("verified")} className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${viewMode === "verified" ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-emerald-600"}`}>
            <CheckCircle size={16}/> Verified Members
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto min-h-[300px] px-2 pb-4 -mx-2">
        <table className="w-full text-left border-separate border-spacing-y-4 min-w-[900px]">
          <thead>
            <tr className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
              <th className="px-5 py-2">Applicant Name</th>
              <th className="px-5 py-2">Profession</th>
              <th className="px-5 py-2">Phone</th>
              <th className="px-5 py-2">Submitted On</th>
              <th className="px-5 py-2 text-center w-56">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" className="p-10 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">Loading applications...</td></tr> : filteredVolunteers.length === 0 ? (
              <tr><td colSpan="5" className="p-10 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">No {viewMode === "active" ? "pending" : "verified"} applications found.</td></tr>
            ) : (
              filteredVolunteers.map((v) => (
                <tr key={v._id} className="group hover:-translate-y-0.5 transition-transform duration-300">
                  <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all align-top">
                    <div className="font-semibold text-slate-900 dark:text-white text-base">{v.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{v.gender}, {v.age} yrs</div>
                  </td>
                  <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all text-slate-700 dark:text-slate-300 font-medium align-top">
                    {v.profession || "N/A"}
                  </td>
                  <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all align-top">
                    <a href={`tel:${v.phone}`} className="text-indigo-600 dark:text-indigo-400 font-mono hover:underline">{v.phone}</a>
                  </td>
                  <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all text-slate-500 dark:text-slate-400 text-sm align-top font-medium">
                    {new Date(v.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric'})}
                  </td>
                  <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all align-top">
                    <div className="flex flex-col justify-center items-center gap-2">
                      <button onClick={() => setSelectedVol(v)} className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase px-3 py-2 rounded-lg transition-all shadow-sm bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-600 hover:text-white dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800/50 dark:hover:bg-blue-600 dark:hover:text-white transition-colors">
                        <Eye size={15} strokeWidth={2.5}/> Details
                      </button>
                      
                      {v.status !== "Verified" ? (
                        <button onClick={() => handleVerify(v._id)} className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase px-3 py-2 rounded-lg transition-all shadow-sm bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-600 hover:text-white dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800/50 dark:hover:bg-emerald-600 dark:hover:text-white transition-colors">
                          <CheckCircle size={15} strokeWidth={2.5} /> Verify
                        </button>
                      ) : (
                        <span className="w-full flex items-center justify-center gap-1.5 text-xs font-bold uppercase px-3 py-2 rounded-lg border bg-emerald-50/50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                          <CheckCircle size={14}/> Verified
                        </span>
                      )}
                      
                      {adminRole === "superadmin" && (
                        <button onClick={() => handleDelete(v._id)} className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase px-3 py-2 rounded-lg transition-all shadow-sm bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800/50 dark:hover:bg-rose-600 dark:hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={15} strokeWidth={2.5} /> Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedVol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800 animate-fadeInUp">
            
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
              <div className="flex items-center gap-4">
                 <div className="p-3.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                    <User size={28} strokeWidth={2.5}/>
                 </div>
                 <div>
                    <h3 className="text-2xl font-extrabold font-heading text-slate-950 dark:text-white">{selectedVol.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                      <Contact size={14}/> ID: <span className="font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded uppercase tracking-wider text-slate-700 dark:text-slate-300">{selectedVol.idType} - {selectedVol.idNumber}</span>
                    </p>
                 </div>
              </div>
              <button onClick={() => setSelectedVol(null)} className="p-2 rounded-full text-slate-400 hover:bg-rose-100 hover:text-rose-500 dark:hover:bg-rose-950/50 transition-colors text-3xl leading-none">&times;</button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-9">
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-7 gap-x-8">
                 <DetailRow icon={Cake} label="Age" value={`${selectedVol.age} Years`} />
                 <DetailRow icon={User} label="Gender" value={selectedVol.gender} />
                 <DetailRow icon={Briefcase} label="Profession" value={selectedVol.profession} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="md:col-span-1 space-y-7 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white border-l-4 border-indigo-500 pl-3">Contact Info</h4>
                    <DetailRow icon={Phone} label="Phone Number" value={<a href={`tel:${selectedVol.phone}`} className="text-indigo-600 dark:text-indigo-400 font-mono">{selectedVol.phone}</a>} />
                    <DetailRow icon={Mail} label="Email Address" value={<a href={`mailto:${selectedVol.email}`} className="text-indigo-600 dark:text-indigo-400 break-all">{selectedVol.email}</a>} />
                 </div>
                 <div className="md:col-span-2 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 h-full">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white border-l-4 border-indigo-500 pl-3 mb-7">Permanent Address</h4>
                    <DetailRow icon={MapPin} label="Residential Address" value={selectedVol.address} isFullWidth />
                 </div>
              </div>

              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-7 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                 <h4 className="text-base font-bold text-indigo-800 dark:text-indigo-300 border-b border-indigo-200 dark:border-indigo-800 pb-3 mb-6 flex items-center gap-2.5">
                    <HeartHandshake size={20} className="text-indigo-600"/> Volunteer Contribution Plan
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1.5 flex items-start gap-3.5">
                       <div className="mt-0.5 p-2.5 rounded-xl bg-white dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border dark:border-indigo-800"><HeartHandshake size={19}/></div>
                       <div>
                          <p className="text-xs font-bold text-indigo-900/60 dark:text-indigo-400 uppercase tracking-wide">Areas of Help</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">{selectedVol.helpText}</p>
                       </div>
                    </div>
                    <div className="space-y-1.5 flex items-start gap-3.5">
                       <div className="mt-0.5 p-2.5 rounded-xl bg-white dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border dark:border-indigo-800"><CalendarClock size={19}/></div>
                       <div>
                          <p className="text-xs font-bold text-indigo-900/60 dark:text-indigo-400 uppercase tracking-wider">Availability Slot</p>
                          <p className="text-base font-semibold text-indigo-950 dark:text-white mt-1 leading-relaxed bg-white dark:bg-indigo-950 px-3 py-1.5 rounded-lg border dark:border-indigo-800 w-fit">{selectedVol.availability}</p>
                       </div>
                    </div>
                 </div>
              </div>

            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-3.5">
              <span className="text-xs text-slate-500 dark:text-slate-500">System Status: <strong className={`ml-1 px-2 py-0.5 rounded ${selectedVol.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{selectedVol.status}</strong></span>
              
              <button onClick={() => setSelectedVol(null)} className="px-6 py-2.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">Close Window</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Volunteers;