import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Users, Calendar, Shield, Settings } from "lucide-react";

function AdminContent() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Organizers</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Now</p>
                  <p className="text-2xl font-bold">123</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">User Management</h2>
              <p className="text-muted-foreground mb-4">
                Manage user accounts, roles, and permissions
              </p>
              <div className="text-sm text-muted-foreground">
                Coming soon: User list, role assignments, and account management
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Event Management</h2>
              <p className="text-muted-foreground mb-4">
                Review and manage all events on the platform
              </p>
              <div className="text-sm text-muted-foreground">
                Coming soon: Event approval workflow and moderation tools
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Role Management</h2>
              <p className="text-muted-foreground mb-4">
                Assign and modify user roles across the platform
              </p>
              <div className="text-sm text-muted-foreground">
                Coming soon: Role assignment interface and permission matrix
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Site Settings</h2>
              <p className="text-muted-foreground mb-4">
                Configure platform-wide settings and preferences
              </p>
              <div className="text-sm text-muted-foreground">
                Coming soon: Global settings, notifications, and platform configuration
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminContent />
    </ProtectedRoute>
  );
}
