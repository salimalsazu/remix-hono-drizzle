import { Outlet, Link, useLocation } from "@remix-run/react";

const DashboardPage = () => {
  const location = useLocation();

  // Check if the current route is the dashboard index route
  const isDashboardIndex = location.pathname === "/dashboard";

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <Link className="text-2xl p-4" to="/dashboard">
          Dashboard
        </Link>

        <ul>
          <li className="p-2 hover:bg-gray-700">
            <Link to="/dashboard">Home</Link>
          </li>
          <li className="p-2 hover:bg-gray-700">
            <Link to="/dashboard/analytics">Analytics</Link>
          </li>
          <li className="p-2 hover:bg-gray-700">
            <Link to="/dashboard/settings">Settings</Link>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-100 p-6">
        {isDashboardIndex ? (
          <>
            {/* Dashboard's Main Content */}
            <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
            <p>This is the dashboard home page content.</p>
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
