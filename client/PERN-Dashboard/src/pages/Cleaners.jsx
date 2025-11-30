import { useEffect, useState } from "react";
import cleanerIcon from "../assets/DefaultCleanerProfileImg.png";
import emailIcon from "../assets/EmailIcon.svg";
import phoneIcon from "../assets/PhoneIcon.svg";

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
    <div className="flex gap-10 flex-wrap justify-between">
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
