import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  category: string;
  attendees: number;
  image: string;
  price?: string;
}

export const EventCard = ({ 
  title, 
  date, 
  location, 
  category, 
  attendees, 
  image,
  price = "Free"
}: EventCardProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-primary text-primary-foreground">
            {category}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {price}
          </Badge>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>{attendees.toLocaleString()} attending</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
