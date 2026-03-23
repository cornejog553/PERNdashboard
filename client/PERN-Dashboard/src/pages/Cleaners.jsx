import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cleanerIcon from "../assets/DefaultCleanerProfileImg.png";
import emailIcon from "../assets/EmailIcon.svg";
import phoneIcon from "../assets/PhoneIcon.svg";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");
const isAdmin = user.role === "admin";

export default function Cleaners() {
  const navigate = useNavigate();
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewCleanerModal, setShowNewCleanerModal] = useState(false);
  // const [showUpdateCleanerModal, setShowUpdateCleanerModal] = useState(false);
  const [showDeleteModal, setShowDeleteCleanerModal] = useState(false);
  const [deleteCleanerId, setDeleteCleanerId] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    is_active: true,
  });

  const fetchCleaners = async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/cleaners`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!res.ok) {
            if (res.status === 401) {
              // Token expired or invalid
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
              return;
            }
            throw new Error("Failed to fetch cleaners");
          }

          const cleanersData = await res.json();
          setCleaners(cleanersData);
        } catch (err) {
          console.error("Error fetching cleaners:", err);
        } finally {
          setLoading(false);
        }
      }

  const handleNewCleanerSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cleaners`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add cleaner");
      }

      const newCleaner = await response.json();

      // Add the new cleaner to your local state
      setCleaners([...cleaners, newCleaner]);

      // Close modal and reset form
      setShowNewCleanerModal(false);
      setFormData({ full_name: "", email: "", phone: "", is_active: true });
    } catch (error) {
      console.error("Error adding cleaner:", error);
      alert("Failed to add cleaner. Please try again.");
    }
  };

  const handleCleanerDeletion = async (cleanerId) => {
    setDeleteLoading(true);
    console.log(cleanerId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cleaners/${cleanerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete cleaner");

      await fetchCleaners();
      setShowDeleteCleanerModal(false);
      setDeleteCleanerId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchCleaners();
  }, [token]);

  if (loading)
    return (
      <div className="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4">
        <div className="flex animate-pulse space-x-4">
          <div className="size-10 rounded-full bg-gray-200"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 rounded bg-gray-200"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                <div className="col-span-1 h-2 rounded bg-gray-200"></div>
              </div>
              <div className="h-2 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex gap-10 flex-wrap justify-start">
      {isAdmin && (
        <div className="flex justify-end mb-4 w-full">
          <button
            onClick={() => setShowNewCleanerModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            Add Cleaner
          </button>
        </div>
      )}

      {/* New Cleaner Modal */}
      {showNewCleanerModal && isAdmin && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 border border-gray-200 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Cleaner</h2>

            <form onSubmit={handleNewCleanerSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Active Cleaner?
                </label>
                <select
                  value={formData.is_active}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_active: e.target.value === "true",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCleanerModal(false);
                    setFormData({ full_name: "", email: "", phone: "" });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Add Cleaner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Cleaner Modal */}

      {showDeleteModal && isAdmin && (
        <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-200 p-7 w-[360px] max-w-[90%]">

        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8.5 3h3a1 1 0 0 1 1 1H7.5a1 1 0 0 1 1-1ZM5.5 5h9l-.8 10.1A1.5 1.5 0 0 1 12.2 16H7.8a1.5 1.5 0 0 1-1.5-1.4L5.5 5ZM4 5h12"
              stroke="#A32D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <p className="text-base font-medium text-gray-900 mb-1.5">Delete cleaner?</p>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          This action cannot be undone. The cleaner's profile and all associated records will be permanently removed.
        </p>

        <div className="flex gap-2.5">
          <button
            onClick={()=> {setShowDeleteCleanerModal(false)}}
            disabled={deleteLoading}
            className="flex-1 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={()=> handleCleanerDeletion(deleteCleanerId)}
            disabled={deleteLoading}
            className="flex-1 py-2 text-sm rounded-lg bg-red-800 text-red-100 hover:bg-red-900 transition-colors cursor-pointer border-none"
          >
            {deleteLoading ? "Deleting..." : "Yes, delete"}
          </button>
        </div>

      </div>
    </div>
      )}

      {cleaners.map((cleaner) => (
        // Cleaner Card
        <div className="flex-row w-full sm:w-full md:w-full lg:w-1/4 p-4 shadow-md bg-white rounded-lg" key={cleaner.id}>
          <div>
            <img src={cleanerIcon} alt="Cleaner Profile Image" />
          </div>
          <div className="font-bold flex items-center justify-center">
            {cleaner.full_name}
          </div>
          <div className="flex gap-2 items-center">
            <img src={emailIcon} alt="" />
            <span
              className="w-full sm:w-auto truncate block max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
              title={cleaner.email}
            >
              {cleaner.email}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <img src={phoneIcon} alt="" />
            {cleaner.phone}
          </div>

          {/* Update and Delete buttons - only show for admins */}
          {isAdmin && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => console.log("test")}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Update
              </button>
              <button
                onClick={() => {setShowDeleteCleanerModal(true)
                  setDeleteCleanerId(cleaner.id)
                }}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
