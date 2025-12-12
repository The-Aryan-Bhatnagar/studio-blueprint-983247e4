import { useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: events, isLoading } = useEvents();

  const filteredEvents = events?.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.artist_profiles?.stage_name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Live Events</h1>
        <p className="text-xs md:text-base text-muted-foreground">
          Discover and book tickets for upcoming concerts and shows
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-9 md:h-10 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8 md:py-12 text-muted-foreground text-sm">
          Loading events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="py-8 md:py-12 text-center">
            <CalendarIcon className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-sm md:text-base">
              {searchQuery
                ? "No events found matching your search"
                : "No upcoming events at the moment"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
