import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { User, Mail, Calendar, Shield } from "lucide-react";

function ProfileContent() {
  const { user, userRole } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">My Profile</h1>

          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-hero flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.user_metadata?.full_name || "User"}</h2>
                <p className="text-muted-foreground capitalize flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {userRole}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Member Since</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={new Date(user?.created_at || "").toLocaleDateString()}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-4">Account Actions</h3>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
