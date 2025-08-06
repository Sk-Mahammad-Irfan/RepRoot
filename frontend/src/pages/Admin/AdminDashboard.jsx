import React, { useState } from "react";
import { Home, Users, Settings, Menu } from "lucide-react";
import { Button } from "../../components/ui/button"; // shadcn/ui Button

const navItems = [
  { label: "Dashboard", icon: <Home size={18} />, href: "#" },
  { label: "Users", icon: <Users size={18} />, href: "#" },
  { label: "Settings", icon: <Settings size={18} />, href: "#" },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden transition-opacity ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold">Admin</h2>
          <nav className="space-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 hover:text-blue-400"
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 ml-0 md:ml-64">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              className="text-gray-600 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-700 text-sm">Admin</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="w-8 h-8 rounded-full border"
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">
            Welcome to the Admin Dashboard
          </h2>
          <p className="mb-4 text-gray-600">
            Manage your application and users here.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button>Primary Action</Button>
            <Button variant="secondary">Another Action</Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
