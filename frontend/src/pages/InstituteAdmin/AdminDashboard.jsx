import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const InstituteAdminDashboard = () => {
  return (
    <>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              Users
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage platform users.
            </p>
            <Button asChild>
              <Link to="/institute/students">Go to Students</Link>
            </Button>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              My Students
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your approved students.
            </p>
            <Button asChild>
              <Link to="/institute/approve-students">Go to My Students</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default InstituteAdminDashboard;
