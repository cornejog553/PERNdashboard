import { useEffect, useState } from "react";


export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("http://localhost:5000/api/customers");
        const customerData = await res.json();

        setCustomers(customerData);
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  if (loading) return <div>Loading customers...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {customers.map((customer) => (
            <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {customer.full_name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {customer.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {customer.phone}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {customer.address}
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
