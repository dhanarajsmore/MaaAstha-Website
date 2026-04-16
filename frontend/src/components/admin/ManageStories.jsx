import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, MapPin } from "lucide-react";

const ManageStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialForm = {
    title: "",
    location: "",
    description: "",
    beforeImage: null,
    afterImage: null,
  };
  const [formData, setFormData] = useState(initialForm);

  const adminRole = localStorage.getItem("adminRole");

  const loadStories = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://maaastha-website-bb9c.onrender.com/api/stories/all");
      const json = await res.json();
      if (json.success) setStories(json.data);
    } catch (e) {
      console.error("Failed to load stories", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("adminToken");
      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("location", formData.location);
      dataToSend.append("description", formData.description);
      if (formData.beforeImage)
        dataToSend.append("beforeImage", formData.beforeImage);
      if (formData.afterImage)
        dataToSend.append("afterImage", formData.afterImage);

      const res = await fetch("https://maaastha-website-bb9c.onrender.com/api/stories/add", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: dataToSend,
      });

      const data = await res.json();
      if (data.success) {
        alert("Success Story published!");
        setFormData(initialForm);
        document.getElementById("before-photo-upload").value = "";
        document.getElementById("after-photo-upload").value = "";
        loadStories();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Server connection failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this story permanently? Both images will also be removed from the cloud.",
      )
    )
      return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `https://maaastha-website-bb9c.onrender.com/api/stories/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) loadStories();
    } catch (e) {
      alert("Failed to delete story");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden font-sans transition-colors duration-300">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-heading">
          Manage Success Stories
        </h2>
        <span className="text-sm text-slate-500 dark:text-slate-400 mt-1 block">
          Publish real transformations directly to the About Us page.
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 h-fit">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Post New Story
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Title / Name *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Ramesh's Journey Home"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Location / Reunion Place
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., Jalgaon, MH"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Transformation Story *
              </label>
              <textarea
                required
                rows="4"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none resize-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Describe their journey..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Before Image (Rescued) *
              </label>
              <input
                type="file"
                required
                id="before-photo-upload"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, beforeImage: e.target.files[0] })
                }
                className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 dark:file:bg-rose-900/30 dark:file:text-rose-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                After Image (Recovered) *
              </label>
              <input
                type="file"
                required
                id="after-photo-upload"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, afterImage: e.target.files[0] })
                }
                className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 dark:file:bg-emerald-900/30 dark:file:text-emerald-400"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <PlusCircle size={18} />{" "}
              {isSubmitting ? "Publishing..." : "Publish Story"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Published Stories
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {loading ? (
              <div className="p-6 text-center text-slate-500">
                Loading stories...
              </div>
            ) : stories.length === 0 ? (
              <div className="p-6 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                No stories published yet.
              </div>
            ) : (
              stories.map((story) => (
                <div
                  key={story._id}
                  className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row"
                >
                  <div className="w-full sm:w-2/5 grid grid-cols-2 bg-slate-200 dark:bg-slate-700">
                    <div className="relative border-r-2 border-white dark:border-slate-800">
                      <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Before
                      </div>
                      <img
                        src={story.beforeImageUrl}
                        alt="Before"
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        After
                      </div>
                      <img
                        src={story.afterImageUrl}
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-3/5 p-4 flex flex-col">
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">
                      {story.title}
                    </h4>
                    {story.location && (
                      <p className="text-xs text-indigo-500 mb-2 flex items-center gap-1">
                        <MapPin size={12} /> {story.location}
                      </p>
                    )}
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
                      {story.description}
                    </p>
                    {adminRole === "superadmin" && (
                      <button
                        onClick={() => handleDelete(story._id)}
                        className="self-end flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStories;
