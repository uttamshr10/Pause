import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, ClipboardCheck, History, LogOut } from "lucide-react";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Pause</h1>
          <p className="text-sm text-gray-500">Burnout Intelligence</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            to="/check-in"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <ClipboardCheck size={18} />
            Daily Check-in
          </Link>

          <Link
            to="/check-in/history"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <History size={18} />
            Check-in History
          </Link>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <header className="bg-white shadow-sm px-6 py-4">
          <h2 className="text-lg font-semibold">Pause Dashboard</h2>
        </header>

        <section className="p-6">{children}</section>
      </main>
    </div>
  );
};

export default DashboardLayout;