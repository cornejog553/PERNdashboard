import { useEffect, useState } from 'react';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('http://localhost:5000/api/bookings');
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">All Bookings</h2>
      {bookings.map(booking => (
        <div key={booking.id} className="border p-4 rounded shadow-sm">
          <p><strong>Customer:</strong> {booking.customer_name}</p>
          <p><strong>Service:</strong> {booking.service_name}</p>
          <p><strong>Cleaner:</strong> {booking.cleaner_name || 'Unassigned'}</p>
          <p><strong>Scheduled:</strong> {new Date(booking.scheduled_at).toLocaleString()}</p>
          <p><strong>Status:</strong> {booking.status}</p>
        </div>
      ))}
    </div>
  );
}