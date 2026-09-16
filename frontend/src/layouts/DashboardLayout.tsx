import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({
  children,
}: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const username =
    localStorage.getItem("username") ||
    "User";

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* =========================================================
     PAGE TITLE
  ========================================================= */

  const pageTitle =
    location.pathname === "/dashboard"
      ? "Dashboard"
      : location.pathname === "/check-in"
      ? "Daily Check-in"
      : location.pathname ===
        "/check-in/history"
      ? "History"
      : location.pathname ===
        "/action-plan"
      ? "Action Plan"
      : location.pathname === "/reports"
      ? "Reports"
      : location.pathname === "/journal"
      ? "Journal"
      : location.pathname ===
        "/reflection"
      ? "Reflection"
      : location.pathname ===
        "/recommendations"
      ? "Recommendations"
      : location.pathname ===
        "/achievements"
      ? "Achievements"
      : location.pathname ===
        "/settings/goals"
      ? "Goal Settings"
      : "Pause";

  /* =========================================================
     NAVIGATION ITEM
  ========================================================= */

  const navItem = (
    path: string,
    label: string
  ) => {
    const isActive =
      location.pathname === path;

    return (
      <Link
        to={path}
        className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
          isActive
            ? "bg-purple-100 text-purple-700"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* =====================================================
          FIXED SIDEBAR
      ===================================================== */}

      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 flex flex-col">
        {/* LOGO */}

        <div className="h-[69px] shrink-0 flex items-center px-6 border-b border-gray-100">
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-white-600 text-white flex items-center justify-center font-bold text-sm">
               <img 
                src="src/assets/pause-favicon.png" 
                alt="Pause Logo" 
                className="w-6 h-6 object-contain"
              />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Pause
              </h1>

              <p className="text-[10px] text-slate-400 mt-0.5">
                Wellness Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* NAVIGATION */}

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-4 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Overview
          </p>

          <nav className="space-y-1">
            {navItem(
              "/dashboard",
              "Dashboard"
            )}

            {navItem(
              "/check-in",
              "Daily Check-in"
            )}

            {navItem(
              "/action-plan",
              "Action Plan"
            )}

            {navItem(
              "/reports",
              "Reports"
            )}
          </nav>

          <div className="my-6 border-t border-gray-100" />

          <p className="px-4 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Explore
          </p>

          <nav className="space-y-1">
            {navItem(
              "/journal",
              "Journal"
            )}

            {navItem(
              "/reflection",
              "Reflection"
            )}

            {navItem(
              "/recommendations",
              "Recommendations"
            )}

            {navItem(
              "/achievements",
              "Achievements"
            )}

            {navItem(
              "/check-in/history",
              "History"
            )}
          </nav>
        </div>

        {/* SIDEBAR FOOTER */}

        <div className="shrink-0 border-t border-gray-100 p-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-400">
              Signed in as
            </p>

            <p className="text-sm font-semibold text-slate-800 mt-1 truncate">
              {username}
            </p>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN AREA

          ml-64 reserves exactly the space occupied by
          the fixed sidebar.
      ===================================================== */}

      <div className="ml-64 min-h-screen">
        {/* ===================================================
            STICKY TOP BAR
        =================================================== */}

        <header className="sticky top-0 z-30 h-[69px] bg-white/95 backdrop-blur border-b border-gray-200">
          <div className="h-full px-8 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-800">
                {pageTitle}
              </h2>
            </div>

            <div className="flex items-center gap-5">

              <div className="w-px h-8 bg-gray-200" />

              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;