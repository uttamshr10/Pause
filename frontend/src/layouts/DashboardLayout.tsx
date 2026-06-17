import { Link, useLocation, useNavigate } from "react-router-dom";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const pageTitle =
  location.pathname === "/dashboard"
    ? "Dashboard"
    : location.pathname === "/check-in"
    ? "Daily Check-in"
    : location.pathname === "/check-in/history"
    ? "History"
    : location.pathname === "/reports"
    ? "Reports"
    : location.pathname === "/journal"
    ? "Journal"
    : location.pathname === "/settings/goals"
    ? "Goal Settings"
    : "Pause";

  const navItem = (path: string, label: string) => {
    const isActive = location.pathname === path;

    return (
      <Link
        to={path}
        className={`block px-4 py-2 rounded-xl text-sm font-medium transition
          ${
            isActive
              ? "bg-purple-100 text-purple-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-6">

        {/* Logo */}
        <h1 className="text-xl font-semibold text-slate-800 mb-8">
          Pause
        </h1>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItem("/dashboard", "Dashboard")}
          {navItem("/check-in", "Daily Check-in")}
          {navItem("/check-in/history", "History")}
          {navItem("/reports", "Reports")}
          {navItem("/journal", "Journal")}
          {navItem("/achievements", "Achievements")}
          {navItem("/recommendations", "Recommendations")}
          {navItem("/reflection", "Reflection")}
          {navItem("/action-plan", "Action Plan")}
        </nav>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200">

          <h2 className="text-lg font-semibold text-gray-800">
            {pageTitle}
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {username}
            </span>

            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:underline"
            >
              Logout
            </button>
          </div>

        </div>

        {/* PAGE CONTENT */}
        <div className="p-8">
          {children}
        </div>

      </div>

    </div>
  );
};

export default DashboardLayout;