import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminRole = localStorage.getItem("adminRole");

  const loadMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/contacts/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) setMessages(json.data);
    } catch (e) {
      console.error("Failed to load messages", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMessages(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:5000/api/contacts/delete/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) loadMessages();
    } catch (e) { alert("Failed to delete message"); }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">Public Inquiries</h2>
          <span className="text-sm text-slate-500 dark:text-slate-400 mt-1 block">Messages from Contact Us page</span>
        </div>
        <span className="text-sm font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800/50">
          {messages.length} Messages
        </span>
      </div>
      
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs tracking-wider border-b dark:border-slate-800">
              <th className="p-4 font-bold uppercase">Sender Info</th>
              <th className="p-4 font-bold uppercase">Subject</th>
              <th className="p-4 font-bold uppercase">Message</th>
              <th className="p-4 font-bold uppercase">Date</th>
              <th className="p-4 font-bold uppercase text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">Loading messages...</td></tr>
            ) : messages.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">No messages found.</td></tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{msg.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{msg.phone}</div>
                    {msg.email && <div className="text-xs text-slate-500 dark:text-slate-400">{msg.email}</div>}
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-semibold">
                      {msg.subject}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 text-sm max-w-md">
                    {msg.message}
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">
                    {new Date(msg.createdAt).toLocaleString("en-IN")}
                  </td>
                  <td className="p-4 flex justify-center">
                    {adminRole === "superadmin" ? (
                      <button 
                        onClick={() => handleDelete(msg._id)}
                        className="flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 rounded-lg transition-all shadow-sm bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800/50 dark:hover:bg-rose-600 dark:hover:text-white dark:hover:border-transparent"
                      >
                        <Trash2 size={14} strokeWidth={2.5} /> Delete
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">View Only</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactMessages;