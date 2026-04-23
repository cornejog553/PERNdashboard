// pages/Bookings.jsx
import { useState, useEffect } from "react";
import BookingCalendar from "../components/BookingCalendar";

export default function Bookings() {
  const [showCreateModal, setshowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    customer_id: "",
    service_id: "",
    cleaner_id: "",
    scheduled_at: "",
    status: "pending",
    notes: "",
  });

  // State for dropdown options
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshCalendar, setRefreshCalendar] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const isAdmin = user.role === "admin";

  // Fetch dropdown data when modal opens
  useEffect(() => {
    if (showCreateModal || (showViewModal && isEditing)) {
      fetchDropdownData();
    }
  }, [showCreateModal, showViewModal, isEditing]);

  const fetchDropdownData = async () => {
    setLoading(true);
    try {
      // Fetch all three in parallel
      const [customersRes, servicesRes, cleanersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/customers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/services`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/cleaners`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const customersData = await customersRes.json();
      const servicesData = await servicesRes.json();
      const cleanersData = await cleanersRes.json();

      setCustomers(customersData);
      setServices(servicesData);
      setCleaners(cleanersData);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      alert("Failed to load form data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewBookingSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
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
        throw new Error("Failed to create booking");
      }

      // Close modal and reset
      setshowCreateModal(false);
      setFormData({
        customer_id: "",
        service_id: "",
        cleaner_id: "",
        scheduled_at: "",
        status: "pending",
        notes: "",
      });

      // Refresh the page to show new booking
      window.location.reload();
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedBooking(event);
    setFormData({
      customer_id: event.customer_id,
      service_id: event.service_id,
      cleaner_id: event.cleaner_id || "",
      scheduled_at: formatDateTimeForInput(event.scheduled_at),
      status: event.status,
      notes: event.notes || "",
    });
    setIsEditing(false);
    setShowViewModal(true);
  };

  // Format date for datetime-local input
  const formatDateTimeForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Update booking
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${selectedBooking.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update booking");
      }

      setShowViewModal(false);
      setIsEditing(false);
      setSelectedBooking(null);

      // Refresh calendar
      setRefreshCalendar((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking. Please try again.");
    }
  };

  // Delete booking
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${selectedBooking.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }

      setShowViewModal(false);
      setSelectedBooking(null);

      // Refresh calendar
      setRefreshCalendar((prev) => prev + 1);
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking. Please try again.");
    }
  };

  return (
    <div className="p-6">
      {/* Header with Create button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings</h1>

        {isAdmin && (
          <button
            onClick={() => setshowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            Create Booking
          </button>
        )}
      </div>

      {/* Calendar Component */}
      <BookingCalendar
        onSelectEvent={handleSelectEvent}
        key={refreshCalendar}
      />

      {/* Create Booking Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Booking</h2>

            {loading ? (
              <div className="text-center py-8">Loading form data...</div>
            ) : (
              <form onSubmit={handleNewBookingSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Customer
                  </label>
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
                  <label className="block text-sm font-medium mb-2">
                    Service
                  </label>
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
                  <label className="block text-sm font-medium mb-2">
                    Cleaner (Optional)
                  </label>
                  <select
                    value={formData.cleaner_id}
                    onChange={(e) =>
                      setFormData({ ...formData, cleaner_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a cleaner (optional)</option>
                    {cleaners
                      .filter((cleaner) => cleaner.is_active)
                      .map((cleaner) => (
                        <option key={cleaner.id} value={cleaner.id}>
                          {cleaner.full_name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Date & Time
                  </label>
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
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
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
                  <label className="block text-sm font-medium mb-2">
                    Notes
                  </label>
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
                      setshowCreateModal(false);
                      setFormData({
                        customer_id: "",
                        service_id: "",
                        cleaner_id: "",
                        scheduled_at: "",
                        status: "pending",
                        notes: "",
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

      {/* View/Edit Booking Modal */}
      {showViewModal && selectedBooking && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Booking" : "Booking Details"}
            </h2>

            {loading && isEditing ? (
              <div className="text-center py-8">Loading form data...</div>
            ) : (
              <form
                onSubmit={
                  isEditing ? handleUpdateSubmit : (e) => e.preventDefault()
                }
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Customer
                  </label>
                  {isEditing ? (
                    <select
                      required
                      value={formData.customer_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customer_id: e.target.value,
                        })
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
                  ) : (
                    <input
                      type="text"
                      value={selectedBooking.customer_name}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                    />
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Service
                  </label>
                  {isEditing ? (
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
                  ) : (
                    <input
                      type="text"
                      value={selectedBooking.service_name}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                    />
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Cleaner
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.cleaner_id}
                      onChange={(e) =>
                        setFormData({ ...formData, cleaner_id: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a cleaner (optional)</option>
                      {cleaners
                        .filter((cleaner) => cleaner.is_active)
                        .map((cleaner) => (
                          <option key={cleaner.id} value={cleaner.id}>
                            {cleaner.full_name}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={selectedBooking.cleaner_name || "Not assigned"}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                    />
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduled_at}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduled_at: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                      isEditing
                        ? "focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                      isEditing
                        ? "focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                      isEditing
                        ? "focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            customer_id: selectedBooking.customer_id,
                            service_id: selectedBooking.service_id,
                            cleaner_id: selectedBooking.cleaner_id || "",
                            scheduled_at: formatDateTimeForInput(
                              selectedBooking.scheduled_at,
                            ),
                            status: selectedBooking.status,
                            notes: selectedBooking.notes || "",
                          });
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowViewModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
