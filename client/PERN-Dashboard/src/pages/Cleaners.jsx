import { useEffect, useState } from "react";
import cleanerIcon from "../assets/DefaultCleanerProfileImg.png";
import emailIcon from "../assets/EmailIcon.svg";
import phoneIcon from "../assets/PhoneIcon.svg";

export default function Cleaners() {
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (add to cleaners array, API call, etc.)
    console.log(formData);
    setShowModal(false);
    // Reset form
    setFormData({ full_name: '', email: '', phone: '' });
  };

  useEffect(() => {
    async function fetchCleaners() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cleaners`);
        const cleanersData = await res.json();

        setCleaners(cleanersData);
      } catch (err) {
        console.error("Error fetching cleaners:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCleaners();
  }, []);

  if (loading)
    return (
      <div class="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4">
        <div class="flex animate-pulse space-x-4">
          <div class="size-10 rounded-full bg-gray-200"></div>
          <div class="flex-1 space-y-6 py-1">
            <div class="h-2 rounded bg-gray-200"></div>
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-4">
                <div class="col-span-2 h-2 rounded bg-gray-200"></div>
                <div class="col-span-1 h-2 rounded bg-gray-200"></div>
              </div>
              <div class="h-2 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex gap-10 flex-wrap justify-between">
      <div className="flex justify-end mb-4 w-full">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Add Cleaner
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 border border-gray-200 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Cleaner</h2>

            <form onSubmit={handleSubmit}>
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

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

      {cleaners.map((cleaner) => (
        // Cleaner Card
        <div className="flex-row w-full sm:w-full md:w-full lg:w-1/4 p-4 shadow-md">
          <div>
            <img src={cleanerIcon} alt="Cleaner Profile Image" />
          </div>
          <div className="font-bold flex items-center justify-center">
            {cleaner.full_name}
          </div>
          <div className="flex gap-2 items-center">
            <img src={emailIcon} alt="" />
            <span
              class="w-full sm:w-auto truncate block max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
              title={cleaner.email}
            >
              {cleaner.email}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <img src={phoneIcon} alt="" />
            {cleaner.phone}
          </div>
        </div>
      ))}
    </div>
  );
}
