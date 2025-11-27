import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Users, ArrowLeft, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { toast } from "sonner";
import eventTech from "@/assets/event-tech.jpg";
import eventMusic from "@/assets/event-music.jpg";
import eventArt from "@/assets/event-art.jpg";
import eventFood from "@/assets/event-food.jpg";
import eventSports from "@/assets/event-sports.jpg";
import eventWorkshop from "@/assets/event-workshop.jpg";

interface Event {
  id: string;
  title: string;
  description: string | null;
  category: string;
  date: string;
  location: string;
  max_attendees: number | null;
  image_url: string | null;
  organizer_id: string;
}

interface Profile {
  full_name: string | null;
  email: string;
}

const categoryImages: Record<string, string> = {
  Technology: eventTech,
  Music: eventMusic,
  Art: eventArt,
  Food: eventFood,
  Sports: eventSports,
  Workshop: eventWorkshop,
};

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [organizer, setOrganizer] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventDetails();
      fetchRegistrationStatus();
      fetchRegistrationCount();
    }
  }, [id, user]);

  const fetchEventDetails = async () => {
    try {
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (eventError) throw eventError;
      
      setEvent(eventData);

      // Fetch organizer profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", eventData.organizer_id)
        .single();

      if (!profileError && profileData) {
        setOrganizer(profileData);
      }
    } catch (error: any) {
      toast.error("Failed to load event details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrationStatus = async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("id")
        .eq("event_id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error) {
        setIsRegistered(!!data);
      }
    } catch (error) {
      console.error("Error fetching registration status:", error);
    }
  };

  const fetchRegistrationCount = async () => {
    if (!id) return;

    try {
      const { count, error } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_id", id);

      if (!error && count !== null) {
        setRegistrationCount(count);
      }
    } catch (error) {
      console.error("Error fetching registration count:", error);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!id) return;

    setRegistering(true);

    try {
      if (isRegistered) {
        // Unregister
        const { error } = await supabase
          .from("registrations")
          .delete()
          .eq("event_id", id)
          .eq("user_id", user.id);

        if (error) throw error;

        toast.success("Successfully unregistered from event");
        setIsRegistered(false);
        setRegistrationCount(prev => prev - 1);
      } else {
        // Register
        const { error } = await supabase
          .from("registrations")
          .insert({
            event_id: id,
            user_id: user.id,
          });

        if (error) throw error;

        toast.success("Successfully registered for event!");
        setIsRegistered(true);
        setRegistrationCount(prev => prev + 1);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update registration");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <Card className="p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Event not found</h2>
              <Button asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Events
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" className="mb-6" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>

          <div className="space-y-6">
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={event.image_url || categoryImages[event.category] || eventTech}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="text-sm font-semibold text-primary uppercase">
                {event.category}
              </span>
              <h1 className="text-4xl font-bold mt-2 mb-4">{event.title}</h1>
              
              <div className="flex flex-col gap-3 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-lg">{format(new Date(event.date), "PPPp")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-lg">
                    {registrationCount} {registrationCount === 1 ? "person" : "people"} registered
                    {event.max_attendees && ` • Max ${event.max_attendees}`}
                  </span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={handleRegister}
                disabled={registering || (event.max_attendees !== null && registrationCount >= event.max_attendees && !isRegistered)}
                variant={isRegistered ? "outline" : "default"}
              >
                {registering 
                  ? "Processing..." 
                  : !user 
                    ? "Login to Register" 
                    : isRegistered 
                      ? "Unregister" 
                      : event.max_attendees !== null && registrationCount >= event.max_attendees
                        ? "Event Full"
                        : "Register for Event"}
              </Button>
            </div>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">About this event</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {event.description || "No description available for this event."}
              </p>
            </Card>

            {organizer && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Organizer</h2>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{organizer.full_name || "Anonymous"}</p>
                    <p className="text-sm text-muted-foreground">{organizer.email}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
