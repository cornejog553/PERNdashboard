// pages/Bookings.jsx
import { useState, useEffect } from "react";
import BookingCalendar from "../components/BookingCalendar";

export default function Bookings() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: "",
    service_id: "",
    cleaner_id: "",
    scheduled_at: "",
    status: "pending",
    notes: ""
  });

  // State for dropdown options
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const isAdmin = user.role === "admin";

  // Fetch dropdown data when modal opens
  useEffect(() => {
    if (showModal) {
      fetchDropdownData();
    }
  }, [showModal]);

  const fetchDropdownData = async () => {
    setLoading(true);
    try {
      // Fetch all three in parallel
      const [customersRes, servicesRes, cleanersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/customers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/services`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/cleaners`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const customersData = await customersRes.json();
      const servicesData = await servicesRes.json();
      const cleanersData = await cleanersRes.json();

      setCustomers(customersData);
      setServices(servicesData);
      setCleaners(cleanersData);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      alert('Failed to load form data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewBookingSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      // Close modal and reset
      setShowModal(false);
      setFormData({
        customer_id: "",
        service_id: "",
        cleaner_id: "",
        scheduled_at: "",
        status: "pending",
        notes: ""
      });

      // Refresh the page to show new booking
      window.location.reload();

    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  return (
    <div className="p-6">
      {/* Header with Create button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings</h1>
        
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            Create Booking
          </button>
        )}
      </div>

      {/* Calendar Component */}
      <BookingCalendar />

      {/* Create Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Booking</h2>

            {loading ? (
              <div className="text-center py-8">Loading form data...</div>
            ) : (
              <form onSubmit={handleNewBookingSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Customer</label>
                  <select
                    required
                    value={formData.customer_id}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.full_name} - {customer.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Service</label>
                  <select
                    required
                    value={formData.service_id}
                    onChange={(e) =>
                      setFormData({ ...formData, service_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {service.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Cleaner (Optional)</label>
                  <select
                    value={formData.cleaner_id}
                    onChange={(e) =>
                      setFormData({ ...formData, cleaner_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a cleaner (optional)</option>
                    {cleaners
                      .filter(cleaner => cleaner.is_active)
                      .map((cleaner) => (
                        <option key={cleaner.id} value={cleaner.id}>
                          {cleaner.full_name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduled_at}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduled_at: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormData({
                        customer_id: "",
                        service_id: "",
                        cleaner_id: "",
                        scheduled_at: "",
                        status: "pending",
                        notes: ""
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Create Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}