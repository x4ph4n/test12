import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Link } from "react-router-dom";
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
}

const categoryImages: Record<string, string> = {
  Technology: eventTech,
  Music: eventMusic,
  Art: eventArt,
  Food: eventFood,
  Sports: eventSports,
  Workshop: eventWorkshop,
};

const Index = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchQuery, selectedCategory, events]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
      setFilteredEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((event) => event.category === selectedCategory);
    }

    setFilteredEvents(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Hero onSearch={handleSearch} onCategorySelect={handleCategoryFilter} />
        
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {selectedCategory ? `${selectedCategory} Events` : "Upcoming Events"}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} found
                </p>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <Card className="p-12 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No events found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedCategory
                    ? "Try adjusting your search or filters"
                    : "No upcoming events at the moment"}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Link key={event.id} to={`/events/${event.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={event.image_url || categoryImages[event.category] || eventTech}
                          alt={event.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <div className="mb-2">
                          <span className="text-xs font-semibold text-primary uppercase">
                            {event.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {event.description || "No description available"}
                        </p>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(event.date), "PPp")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          {event.max_attendees && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>Max: {event.max_attendees} attendees</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
