import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex flex-col h-screen bg-muted text-muted-foreground">
      <Link to="/">Go Home</Link>

      <header className="w-full bg-background border-b shadow-sm px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Welcome back 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            Here's what's happening with your platform today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              Users
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage platform users.
            </p>
            <Button asChild>
              <Link to="/admin/all-users">Go to Users</Link>
            </Button>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              Institution Admin
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage platform Admins.
            </p>
            <Button asChild>
              <Link to="/admin/all-instituteAdmin">Go to Admins</Link>
            </Button>
          </div>

          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              Employee
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Employee details found here
            </p>
            <Button asChild>
              <Link to="/admin/all-employees">Go to Users</Link>
            </Button>
          </div>

          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              Reports
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              View usage and system stats.
            </p>
            <Button variant="outline">View Reports</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
