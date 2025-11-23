// BookingCalendar.jsx
import { useEffect, useState } from "react";
import { Calendar, Views } from "react-big-calendar";
import { localizer } from "./calendarSetup";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function BookingCalendar() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("http://localhost:5000/api/bookings");
        const data = await res.json();

        //Convert start and end Date objects
        const formattedData = data.map((booking) => {
          const start = new Date(booking.scheduled_at);
          return {
            ...booking,
            title: booking.service_name,
            start,
            end: new Date(start.getTime() + 60 * 60 * 1000), // add 1 hour
            id: booking.id,
          };
        });

        setBookings(formattedData);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  const [currentView, setCurrentView] = useState(Views.MONTH);

  const handleSelectEvent = (event) => {
    alert(`Clicked on booking: ${event.title}`);
    // You can route to a booking detail page or open a modal here
  };

  if (loading) return <div>Loading bookings...</div>;

  return (
    <Calendar
      localizer={localizer}
      events={bookings}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 600 }}
      defaultView={Views.MONTH}
      view={currentView}
      onView={setCurrentView}
      date={currentDate}
      onNavigate={(newDate) => setCurrentDate(newDate)}
      onSelectEvent={handleSelectEvent}
    />
  );
}
