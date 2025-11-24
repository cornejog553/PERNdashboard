import { useEffect, useState } from "react";


export default function Cleaners() {
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCleaners() {
      try {
        const res = await fetch("http://localhost:5000/api/cleaners");
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

  if (loading) return <div>Loading customers...</div>;

  return (
    <div className="flex gap-10">
      {cleaners.map((cleaner) => (
        <div className="flex-row shadow-md">
          <div>{cleaner.full_name}</div>
          <div>{cleaner.email}</div>
          <div>{cleaner.phone}</div>
        </div>
      ))}
    </div>
  )

}
