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
      const res = await fetch("https://maaastha-website-bb9c.onrender.com/api/contacts/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setMessages(json.data);
    } catch (e) {
      console.error("Failed to load messages", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `https://maaastha-website-bb9c.onrender.com/api/contacts/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) loadMessages();
    } catch (e) {
      alert("Failed to delete message");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
            Public Inquiries
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400 mt-1 block">
            Messages from Contact Us page
          </span>
        </div>
        <span className="text-sm font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800/50">
          {messages.length} Messages
        </span>
      </div>

      <div className="overflow-x-auto min-h-[300px] px-2 pb-4 -mx-2">
        <table className="w-full text-left border-separate border-spacing-y-4 min-w-[800px]">
          <thead>
            <tr className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
              <th className="px-5 py-2">Sender Info</th>
              <th className="px-5 py-2">Subject</th>
              <th className="px-5 py-2 w-1/3">Message</th>
              <th className="px-5 py-2">Date</th>
              {adminRole === "superadmin" && (
                <th className="px-5 py-2 text-center w-32">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={adminRole === "superadmin" ? 5 : 4}
                  className="p-10 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                  Loading messages...
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td
                  colSpan={adminRole === "superadmin" ? 5 : 4}
                  className="p-10 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                  No messages found.
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr
                  key={msg._id}
                  className="group hover:-translate-y-0.5 transition-transform duration-300"
                >
                  <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all align-top">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {msg.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                      {msg.phone}
                    </div>
                    {msg.email && (
                      <div className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mt-1">
                        {msg.email}
                      </div>
                    )}
                  </td>
                  <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all align-top">
                    <span className="inline-block px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-xs font-bold">
                      {msg.subject}
                    </span>
                  </td>
                  <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all text-slate-600 dark:text-slate-300 text-sm align-top leading-relaxed">
                    {msg.message}
                  </td>
                  <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all text-slate-500 dark:text-slate-400 text-xs font-medium align-top">
                    {new Date(msg.createdAt).toLocaleString("en-IN")}
                  </td>
                  {adminRole === "superadmin" && (
                    <td className="p-5 bg-white dark:bg-slate-800/90 border-y border-slate-200 dark:border-slate-700/50 first:border-l last:border-r first:rounded-l-2xl last:rounded-r-2xl shadow-sm group-hover:shadow-md group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 transition-all align-top">
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="w-full flex items-center justify-center gap-1.5 text-xs font-bold uppercase px-3 py-2 rounded-lg transition-all shadow-sm bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800/50 dark:hover:bg-rose-600 dark:hover:text-white transition-colors"
                      >
                        <Trash2 size={14} strokeWidth={2.5} /> Delete
                      </button>
                    </td>
                  )}
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
