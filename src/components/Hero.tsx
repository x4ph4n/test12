import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HeroProps {
  onSearch: (query: string) => void;
  onCategorySelect: (category: string | null) => void;
}

const categories = ["Technology", "Music", "Sports", "Art", "Food", "Workshop"];

export const Hero = ({ onSearch, onCategorySelect }: HeroProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleSearch = () => {
    onSearch(searchValue);
  };

  const handleCategoryClick = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null);
      onCategorySelect(null);
    } else {
      setActiveCategory(category);
      onCategorySelect(category);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            Discover Amazing
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Events Near You
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Connect with your community through concerts, workshops, conferences, and more
          </p>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-2 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search events by title, description, or location..." 
                  className="pl-12 h-14 border-0 focus-visible:ring-0 text-lg"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              
              <Button 
                size="lg" 
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                onClick={() => handleCategoryClick(category)}
                className={`${
                  activeCategory === category
                    ? "bg-white text-primary border-white"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                } backdrop-blur-sm transition-colors`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
