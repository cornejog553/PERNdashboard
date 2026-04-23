// pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalCleaners: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    activeCleaners: 0
  });

  const [bookingsByMonth, setBookingsByMonth] = useState([]);
  const [bookingsByStatus, setBookingsByStatus] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [customersRes, cleanersRes, bookingsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/customers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/cleaners`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const customers = await customersRes.json();
      const cleaners = await cleanersRes.json();
      const bookings = await bookingsRes.json();

      // Calculate stats
      const pending = bookings.filter(b => b.status === 'pending').length;
      const confirmed = bookings.filter(b => b.status === 'confirmed').length;
      const completed = bookings.filter(b => b.status === 'completed').length;
      const active = cleaners.filter(c => c.is_active).length;

      setStats({
        totalCustomers: customers.length,
        totalCleaners: cleaners.length,
        totalBookings: bookings.length,
        pendingBookings: pending,
        confirmedBookings: confirmed,
        completedBookings: completed,
        activeCleaners: active
      });

      // Process bookings by month (last 6 months)
      const monthlyData = processBookingsByMonth(bookings);
      setBookingsByMonth(monthlyData);

      // Process bookings by status for pie chart
      const statusData = [
        { name: 'Pending', value: pending, color: '#FCD34D' },
        { name: 'Confirmed', value: confirmed, color: '#60A5FA' },
        { name: 'Completed', value: completed, color: '#34D399' },
        { name: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: '#F87171' }
      ].filter(item => item.value > 0); // Only show statuses with data

      setBookingsByStatus(statusData);

      // Get recent bookings (last 5)
      const recent = bookings
        .sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at))
        .slice(0, 5);
      setRecentBookings(recent);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const processBookingsByMonth = (bookings) => {
    const monthCounts = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    bookings.forEach(booking => {
      const date = new Date(booking.scheduled_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthCounts[monthKey] = {
        month: monthLabel,
        count: (monthCounts[monthKey]?.count || 0) + 1
      };
    });

    // Convert to array and sort, get last 6 months
    return Object.entries(monthCounts)
      .map(([key, value]) => value)
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split(' ');
        const [bMonth, bYear] = b.month.split(' ');
        const aDate = new Date(`${aMonth} 1, ${aYear}`);
        const bDate = new Date(`${bMonth} 1, ${bYear}`);
        return aDate - bDate;
      })
      .slice(-6);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Welcome back, {user.full_name || 'User'}!
        </h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your business today.</p>
      </div>

      {/* Stats Cards Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon="👥"
          color="bg-blue-500"
          trend="+12%"
        />
        <StatCard
          title="Active Cleaners"
          value={`${stats.activeCleaners}/${stats.totalCleaners}`}
          icon="🧹"
          color="bg-green-500"
          trend="+5%"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon="📅"
          color="bg-purple-500"
          trend="+18%"
        />
        <StatCard
          title="Pending"
          value={stats.pendingBookings}
          icon="⏳"
          color="bg-yellow-500"
          subtitle="Need attention"
        />
      </div>

      {/* Secondary Stats - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <MiniStatCard
          label="Confirmed"
          value={stats.confirmedBookings}
          color="text-blue-600"
        />
        <MiniStatCard
          label="Completed"
          value={stats.completedBookings}
          color="text-green-600"
        />
        <MiniStatCard
          label="Success Rate"
          value={stats.totalBookings > 0 
            ? `${Math.round((stats.completedBookings / stats.totalBookings) * 100)}%`
            : '0%'
          }
          color="text-purple-600"
        />
      </div>

      {/* Charts Section - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Bookings by Month - Bar Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Bookings Trend</h2>
          {bookingsByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={bookingsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar 
                  dataKey="count" 
                  fill="#3B82F6" 
                  name="Bookings"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              No booking data available
            </div>
          )}
        </div>

        {/* Bookings by Status - Pie Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Booking Status</h2>
          {bookingsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={bookingsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              No booking status data
            </div>
          )}
          
          {/* Legend for mobile */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 justify-center">
            {bookingsByStatus.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs sm:text-sm text-gray-600">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings Table - Responsive */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          {recentBookings.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Service
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customer_name}
                      </div>
                      <div className="text-sm text-gray-500 sm:hidden">
                        {booking.service_name}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                      {booking.service_name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="hidden sm:block">
                        {formatDate(booking.scheduled_at)}
                      </div>
                      <div className="sm:hidden">
                        {new Date(booking.scheduled_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No recent bookings
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color, trend, subtitle }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-green-600 text-xs sm:text-sm font-medium mt-1">
              {trend} from last month
            </p>
          )}
          {subtitle && (
            <p className="text-gray-500 text-xs sm:text-sm mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`${color} w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 ml-4`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Mini Stat Card Component
function MiniStatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <p className="text-gray-500 text-xs sm:text-sm font-medium mb-2">{label}</p>
      <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}