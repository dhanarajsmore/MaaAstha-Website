import React, { useState, useEffect } from "react";
import { Clock, ShieldCheck, Ban, Trash2, Eye, AlertTriangle, MapPin, Phone, User, Camera, Info, Activity } from "lucide-react";

const RescueRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("active");
  const [selectedReq, setSelectedReq] = useState(null);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/rescue-requests/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) setRequests(json.data);
    } catch (e) { console.error("Failed", e); } 
    finally { setLoading(false); }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    if (!window.confirm(`Mark this alert as ${newStatus}?`)) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/rescue-requests/update/${id}`, {
        method: "PATCH", 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }, 
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        loadRequests();
        setSelectedReq(null);
      }
    } catch (e) { alert("Failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bhai, delete karna hai?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/rescue-requests/delete/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        loadRequests();
        setSelectedReq(null);
      } else {
        alert(data.message || "Delete failed! You might not have permission.");
      }
    } catch (e) { alert("Delete failed!"); }
  };

  const filteredRequests = requests.filter((r) => {
    const isResolved = r.status === "Rescued" || r.status === "Invalid";
    return viewMode === "active" ? !isResolved : isResolved;
  });

  // 🚀 NAYA FUNCTION: Link ko pakad kar Button banane ke liye
  const formatLocationText = (text) => {
    if (!text) return "N/A";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // Taaki row click trigger na ho
            className="inline-flex items-center gap-1.5 px-3 py-1 mt-1 mb-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 rounded-lg font-bold text-xs hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors border border-blue-200 dark:border-blue-700/50 shadow-sm"
          >
            🗺️ View on Maps
          </a>
        );
      }
      // Agar "\n" hai toh usko proper line break (<br/>) mein convert karo
      return <span key={i}>{part.split('\n').map((str, idx) => <React.Fragment key={idx}>{str}<br/></React.Fragment>)}</span>;
    });
  };

  const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3.5">
      <div className="mt-0.5 p-2 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
        <Icon size={18} strokeWidth={2.2} />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide">{label}</p>
        <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 leading-relaxed">{value || "N/A"}</div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300 relative font-sans">
      
      <div className="p-7 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white font-heading flex items-center gap-2">
            <AlertTriangle className="text-rose-500" /> Emergency Alerts
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 block">Prioritize and manage active rescue missions</span>
        </div>
        <div className="flex gap-2.5 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl w-fit border border-slate-200 dark:border-slate-700/50">
          <button onClick={() => setViewMode("active")} className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${viewMode === "active" ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-rose-600"}`}>
            Active Alerts {viewMode === "active" && <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs">{filteredRequests.length}</span>}
          </button>
          <button onClick={() => setViewMode("resolved")} className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${viewMode === "resolved" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-800"}`}>
            Past Records
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-500 text-xs tracking-wider border-b dark:border-slate-800">
              <th className="p-5 font-bold uppercase">Location</th>
              <th className="p-5 font-bold uppercase">Condition</th>
              <th className="p-5 font-bold uppercase">Reporter</th>
              <th className="p-5 font-bold uppercase text-center">Visuals</th>
              <th className="p-5 font-bold uppercase text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {loading ? <tr><td colSpan="5" className="p-10 text-center text-slate-500">Loading alerts...</td></tr> : filteredRequests.length === 0 ? (
              <tr><td colSpan="5" className="p-10 text-center text-slate-500">No {viewMode} alerts right now.</td></tr>
            ) : filteredRequests.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  {/* 🚀 Location Formatting in Table */}
                  <td className="p-5 font-semibold text-slate-900 dark:text-white max-w-[250px]" title={r.location}>
                    {formatLocationText(r.location)}
                  </td>
                  <td className="p-5 text-slate-600 dark:text-slate-300 font-medium">{r.condition}</td>
                  <td className="p-5">
                    <div className="text-slate-800 dark:text-slate-200 font-medium">{r.reporterName || "Anonymous"}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{r.reporterPhone}</div>
                  </td>
                  <td className="p-5 text-center">
                    {r.photoUrl ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-800/50">
                        <Camera size={14}/> Attached
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs italic">N/A</span>
                    )}
                  </td>
                  <td className="p-5 flex justify-center items-center gap-2">
                    <button onClick={() => setSelectedReq(r)} className="flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 rounded-lg transition-all shadow-sm bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-600 hover:text-white dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800/50 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-transparent">
                      <Eye size={14} strokeWidth={2.5}/> View
                    </button>

                    {viewMode === "active" ? (
                      <>
                        {r.status !== "In Progress" && (
                          <button onClick={() => handleUpdateStatus(r._id, "In Progress")} className="flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 rounded-lg transition-all shadow-sm bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-600 hover:text-white dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800/50 dark:hover:bg-amber-600 dark:hover:text-white dark:hover:border-transparent">
                            <Clock size={14} strokeWidth={2.5} /> Progress
                          </button>
                        )}
                        <button onClick={() => handleUpdateStatus(r._id, "Rescued")} className="flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 rounded-lg transition-all shadow-sm bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800/50 dark:hover:bg-emerald-600 dark:hover:text-white dark:hover:border-transparent">
                          <ShieldCheck size={14} strokeWidth={2.5} /> Rescued
                        </button>
                        <button onClick={() => handleUpdateStatus(r._id, "Invalid")} className="flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 rounded-lg transition-all shadow-sm bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-500 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-600 dark:hover:text-white dark:hover:border-transparent">
                          <Ban size={14} strokeWidth={2.5} /> Invalid
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold uppercase px-3 py-1.5 rounded-lg border bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                        {r.status}
                      </span>
                    )}
                    
                    <button onClick={() => handleDelete(r._id)} className="flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 rounded-lg transition-all shadow-sm bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800/50 dark:hover:bg-rose-600 dark:hover:text-white dark:hover:border-transparent">
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800 animate-fadeInUp">
            
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-rose-50 dark:bg-rose-950/30">
              <div className="flex items-center gap-4">
                 <div className="p-3.5 rounded-2xl bg-white dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800">
                    <AlertTriangle size={28} strokeWidth={2.5}/>
                 </div>
                 <div>
                    <h3 className="text-2xl font-extrabold font-heading text-slate-950 dark:text-white">Emergency Assessment</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                      <Clock size={14}/> Reported on: {new Date(selectedReq.createdAt).toLocaleString("en-IN")}
                    </p>
                 </div>
              </div>
              <button onClick={() => setSelectedReq(null)} className="p-2 rounded-full text-slate-400 hover:bg-rose-100 hover:text-rose-500 dark:hover:bg-rose-950/50 transition-colors text-3xl leading-none">&times;</button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <div className="flex flex-col lg:flex-row gap-8">
                
                <div className="w-full lg:w-5/12 flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white border-l-4 border-rose-500 pl-3">Visual Evidence</h4>
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
                    {selectedReq.photoUrl ? (
                      <img 
                        src={selectedReq.photoUrl.startsWith("http") ? selectedReq.photoUrl : `http://localhost:5000${selectedReq.photoUrl}`} 
                        alt="Rescue Subject" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 gap-2">
                        <Camera size={32} opacity={0.5}/>
                        <span className="text-sm font-medium">No photo provided</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={`mt-2 p-4 rounded-2xl border flex items-center justify-between ${
                    selectedReq.status === 'Rescued' ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800' :
                    selectedReq.status === 'In Progress' ? 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800' :
                    selectedReq.status === 'Invalid' ? 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700' :
                    'bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800'
                  }`}>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase">Current Status</span>
                    <span className={`text-base font-extrabold px-3 py-1 rounded-lg bg-white dark:bg-slate-950 shadow-sm ${
                      selectedReq.status === 'Rescued' ? 'text-emerald-600 dark:text-emerald-400' :
                      selectedReq.status === 'In Progress' ? 'text-amber-600 dark:text-amber-400' :
                      selectedReq.status === 'Invalid' ? 'text-slate-500' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {selectedReq.status || 'Pending Review'}
                    </span>
                  </div>
                </div>

                <div className="w-full lg:w-7/12 space-y-8">
                  <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
                    {/* 🚀 Location Formatting in Modal */}
                    <DetailRow icon={MapPin} label="Exact Location Found" value={formatLocationText(selectedReq.location)} />
                    <DetailRow icon={Activity} label="Observed Condition" value={selectedReq.condition} />
                  </div>

                  <div className="space-y-6 bg-indigo-50/50 dark:bg-indigo-950/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                    <h4 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 border-b border-indigo-200 dark:border-indigo-800 pb-2 mb-4 flex items-center gap-2">
                      <Info size={18}/> Reporter Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <DetailRow icon={User} label="Reported By" value={selectedReq.reporterName || "Anonymous Good Samaritan"} />
                      <DetailRow icon={Phone} label="Contact Number" value={<a href={`tel:${selectedReq.reporterPhone}`} className="text-indigo-600 dark:text-indigo-400 font-mono hover:underline">{selectedReq.reporterPhone}</a>} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-end items-center gap-3">
              <button onClick={() => setSelectedReq(null)} className="px-6 py-2.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">Close Window</button>
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

export default RescueRequests;