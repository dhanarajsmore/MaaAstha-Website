import React, { useState, useEffect } from "react";

const Records = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("current");
  const [selectedPerson, setSelectedPerson] = useState(null);

  const [reunionModal, setReunionModal] = useState(null);
  const [reunionForm, setReunionForm] = useState({
    dateOfLeaving: "",
    receiverName: "",
    receiverRelation: "",
    receiverContact: "",
    receiverIdProof: "",
    receiverAddress: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/persons/all");
      const data = await response.json();
      if (data.success) setRecords(data.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const calculateDays = (arrival, leaving) => {
    if (!arrival) return "N/A";
    const start = new Date(arrival);
    const end = leaving ? new Date(leaving) : new Date();
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleReunionSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/persons/update/${reunionModal._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "Reunited",
            reunionDetails: reunionForm,
          }),
        },
      );
      if (response.ok) {
        alert("Reunion details logged securely!");
        setReunionModal(null);
        setReunionForm({
          dateOfLeaving: "",
          receiverName: "",
          receiverRelation: "",
          receiverContact: "",
          receiverIdProof: "",
          receiverAddress: "",
        });
        fetchRecords();
      }
    } catch (error) {
      alert("Failed to save reunion details.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Bhai, pakka delete karna hai? Data hamesha ke liye chala jayega.",
      )
    ) {
      try {
        await fetch(`http://localhost:5000/api/persons/delete/${id}`, {
          method: "DELETE",
        });
        fetchRecords();
      } catch (error) {
        alert("Delete failed!");
      }
    }
  };

  const filteredRecords = records.filter((record) => {
    if (viewMode === "current" && record.status === "Reunited") return false;
    if (viewMode === "reunited" && record.status !== "Reunited") return false;

    const searchLower = searchTerm.toLowerCase();
    const name = record.fullName || record.name || "";
    const loc = record.address || record.location || "";
    return (
      name.toLowerCase().includes(searchLower) ||
      loc.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden font-sans transition-colors duration-300 relative">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-ngo-dark dark:text-white font-heading">
              Shelter Records
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage and view resident database securely
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search name, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ngo-green transition-all"
              />
            </div>
            <button
              onClick={fetchRecords}
              className="p-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all active:scale-95"
            >
              <span className={isLoading ? "animate-spin inline-block" : ""}>
                🔄
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode("current")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
              viewMode === "current"
                ? "bg-white dark:bg-gray-600 text-ngo-dark dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Currently in Shelter
          </button>
          <button
            onClick={() => setViewMode("reunited")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
              viewMode === "reunited"
                ? "bg-white dark:bg-gray-600 text-ngo-dark dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Reunited
          </button>
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
              viewMode === "all"
                ? "bg-white dark:bg-gray-600 text-ngo-dark dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            All-Time History
          </button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm border-b dark:border-gray-700">
              <th className="p-4 font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider">
                Status
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider">
                Date Added
              </th>
              <th className="p-4 font-semibold uppercase tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {isLoading && records.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-10 text-center text-gray-500 dark:text-gray-400"
                >
                  Loading database...
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-10 text-center text-gray-500 dark:text-gray-400"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr
                  key={record._id}
                  className="hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {record.fullName || record.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {record.address || record.location}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                        record.status === "Reunited"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                    {record.arrivalDateTime
                      ? new Date(record.arrivalDateTime).toLocaleDateString(
                          "en-IN",
                        )
                      : "N/A"}
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => setSelectedPerson(record)}
                      className="text-xs font-bold uppercase bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                    >
                      👁️ View
                    </button>
                    {record.status !== "Reunited" && (
                      <button
                        onClick={() => setReunionModal(record)}
                        className="text-xs font-bold uppercase bg-green-50 text-green-600 px-3 py-1.5 rounded-md hover:bg-green-500 hover:text-white transition-all shadow-sm"
                      >
                        🤝 Reunite
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(record._id)}
                      className="text-xs font-bold uppercase bg-red-50 text-red-500 px-3 py-1.5 rounded-md hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {reunionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-green-50 dark:bg-green-900/20">
              <h3 className="text-xl font-bold font-heading text-green-700 dark:text-green-400">
                Reunion Security Form
              </h3>
              <button
                onClick={() => setReunionModal(null)}
                className="text-gray-500 hover:text-red-500 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleReunionSubmit} className="p-6 space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 p-3 rounded-lg text-sm border border-yellow-200 dark:border-yellow-700/50 mb-4">
                <strong>Attention:</strong> Log receiver details carefully. This
                is a crucial legal & security requirement.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Date of Leaving *
                  </label>
                  <input
                    required
                    type="datetime-local"
                    className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
                    value={reunionForm.dateOfLeaving}
                    onChange={(e) =>
                      setReunionForm({
                        ...reunionForm,
                        dateOfLeaving: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Receiver Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Who is taking them?"
                    className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
                    value={reunionForm.receiverName}
                    onChange={(e) =>
                      setReunionForm({
                        ...reunionForm,
                        receiverName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Relationship *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g., Brother, Son, NGO"
                    className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
                    value={reunionForm.receiverRelation}
                    onChange={(e) =>
                      setReunionForm({
                        ...reunionForm,
                        receiverRelation: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Receiver Contact No. *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Active mobile number"
                    className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
                    value={reunionForm.receiverContact}
                    onChange={(e) =>
                      setReunionForm({
                        ...reunionForm,
                        receiverContact: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Receiver ID Proof No. *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Aadhar / PAN No."
                    className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none"
                    value={reunionForm.receiverIdProof}
                    onChange={(e) =>
                      setReunionForm({
                        ...reunionForm,
                        receiverIdProof: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Receiver Permanent Address *
                  </label>
                  <textarea
                    required
                    rows="2"
                    placeholder="Full residential address"
                    className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none resize-none"
                    value={reunionForm.receiverAddress}
                    onChange={(e) =>
                      setReunionForm({
                        ...reunionForm,
                        receiverAddress: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setReunionModal(null)}
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg font-bold shadow-md disabled:opacity-50"
                >
                  {isUpdating ? "Logging..." : "Confirm Reunion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/80">
              <h3 className="text-xl font-bold font-heading text-ngo-dark dark:text-white">
                Record Details
              </h3>
              <button
                onClick={() => setSelectedPerson(null)}
                className="text-gray-500 hover:text-red-500 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                  <div className="w-48 h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {selectedPerson.imageUrl || selectedPerson.image ? (
                      <img
                        src={`http://localhost:5000${selectedPerson.imageUrl || selectedPerson.image}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                    ) : null}
                    <span
                      className="text-gray-400 text-sm px-4 text-center block"
                      style={{
                        display:
                          selectedPerson.imageUrl || selectedPerson.image
                            ? "none"
                            : "block",
                      }}
                    >
                      No Photo
                    </span>
                  </div>
                  <div className="text-center w-full">
                    <span
                      className={`px-4 py-1.5 block rounded-md text-sm font-bold tracking-wide mb-2 ${selectedPerson.status === "Reunited" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                    >
                      Status: {selectedPerson.status}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full block">
                      Days in Shelter:{" "}
                      {calculateDays(
                        selectedPerson.arrivalDateTime,
                        selectedPerson.reunionDetails?.dateOfLeaving,
                      )}
                    </span>
                  </div>
                </div>

                <div className="w-full md:w-2/3 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-ngo-green uppercase tracking-wider border-b border-gray-100 pb-2 mb-3">
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div>
                        <p className="text-gray-500">Full Name</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedPerson.fullName ||
                            selectedPerson.name ||
                            "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Age & Gender</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedPerson.age || "N/A"} •{" "}
                          {selectedPerson.gender || "N/A"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500">Location Found</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedPerson.address ||
                            selectedPerson.location ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-ngo-green uppercase tracking-wider border-b border-gray-100 pb-2 mb-3">
                      Admission Details
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div>
                        <p className="text-gray-500">Brought By</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedPerson.broughtBy || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Arrival Date</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedPerson.arrivalDateTime
                            ? new Date(
                                selectedPerson.arrivalDateTime,
                              ).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500">Reason</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedPerson.reason || "N/A"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500">Condition / Description</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedPerson.condition ||
                            selectedPerson.description ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedPerson.status === "Reunited" &&
                    selectedPerson.reunionDetails && (
                      <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-800/30">
                        <h4 className="text-xs font-bold text-green-700 uppercase tracking-wider border-b border-green-200 dark:border-green-800 pb-2 mb-3">
                          🤝 Reunion Details (Security Log)
                        </h4>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                          <div>
                            <p className="text-gray-500">Date of Leaving</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {new Date(
                                selectedPerson.reunionDetails.dateOfLeaving,
                              ).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Receiver Name</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {selectedPerson.reunionDetails.receiverName}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Relationship</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {selectedPerson.reunionDetails.receiverRelation}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Contact No.</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {selectedPerson.reunionDetails.receiverContact}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-500">Receiver ID Proof</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {selectedPerson.reunionDetails.receiverIdProof}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-500">Permanent Address</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {selectedPerson.reunionDetails.receiverAddress}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 text-right">
              <button
                onClick={() => setSelectedPerson(null)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
