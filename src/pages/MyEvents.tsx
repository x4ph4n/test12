import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { Plus, Calendar, Users, MapPin, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  category: string;
  date: string;
  location: string;
  max_attendees: number | null;
}

function MyEventsContent() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchEvents = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", user.id)
        .order("date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;
      
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (error: any) {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">My Events</h1>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Events Created</p>
                  <p className="text-2xl font-bold">{events.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Attendees</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </Card>
          </div>

          {loading ? (
            <Card className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </Card>
          ) : events.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No events yet</h2>
              <p className="text-muted-foreground mb-6">
                Create your first event to start building your community
              </p>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="p-6 flex flex-col gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {event.description || "No description"}
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(event.date), "PPp")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    {event.max_attendees && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Max: {event.max_attendees}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-auto pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateEventDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchEvents}
      />
    </div>
  );
}

export default function MyEvents() {
  return (
    <ProtectedRoute allowedRoles={["organizer", "admin"]}>
      <MyEventsContent />
    </ProtectedRoute>
  );
}
