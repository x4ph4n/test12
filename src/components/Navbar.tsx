import { Button } from "@/components/ui/button";
import { Calendar, Menu, User, LogOut, Plus, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const { user, userRole, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">EventHub</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Discover
            </Link>
            {userRole === "organizer" && (
              <Link to="/my-events" className="text-foreground hover:text-primary transition-colors font-medium">
                My Events
              </Link>
            )}
            {userRole === "admin" && (
              <Link to="/admin" className="text-foreground hover:text-primary transition-colors font-medium">
                Admin
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {(userRole === "organizer" || userRole === "admin") && (
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground hidden md:inline-flex"
                    asChild
                  >
                    <Link to="/my-events">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Link>
                  </Button>
                )}
                
                <ThemeToggle />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.email}</span>
                        <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {userRole === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Button variant="ghost" className="hidden md:inline-flex" asChild>
                  <Link to="/auth">Log In</Link>
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
            
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
