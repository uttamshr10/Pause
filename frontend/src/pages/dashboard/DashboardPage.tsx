import { Link } from "react-router-dom";

const DashboardPage = () => {
  const username = localStorage.getItem("username") || "User";

  return (
    <div className="space-y-6">
      
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {username} 👋
        </h1>
        <p className="text-gray-600">
          Track your daily wellness and understand your burnout patterns.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">

        <Link
          to="/check-in"
          className="bg-black text-white p-6 rounded-2xl shadow hover:opacity-90"
        >
          <h2 className="text-lg font-semibold mb-2">
            Daily Check-in
          </h2>
          <p className="text-sm">
            Log your mood, stress, and energy levels for today.
          </p>
        </Link>

        <Link
          to="/check-in/history"
          className="bg-white p-6 rounded-2xl shadow hover:bg-gray-50"
        >
          <h2 className="text-lg font-semibold mb-2">
            View History
          </h2>
          <p className="text-sm text-gray-600">
            See your past check-ins and trends.
          </p>
        </Link>

      </div>

      {/* Placeholder for future analytics */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-2">
          Analytics (Coming Soon)
        </h2>
        <p className="text-gray-500 text-sm">
          Burnout score, trends, and insights will appear here.
        </p>
      </div>

    </div>
  );
};

export default DashboardPage;