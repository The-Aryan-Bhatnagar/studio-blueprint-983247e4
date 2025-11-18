import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Clock, Search, Heart, Bell } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Events = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const events = [
    {
      id: 1,
      title: "Honey Singh Live in Concert",
      artist: "Honey Singh",
      date: "April 20, 2024",
      time: "8:00 PM",
      location: "Talkatora Stadium, Delhi",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop",
      price: "$45-$120",
      category: "Concert",
    },
    {
      id: 2,
      title: "Badshah World Tour",
      artist: "Badshah",
      date: "April 25, 2024",
      time: "7:30 PM",
      location: "Phoenix Marketcity, Mumbai",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop",
      price: "$55-$150",
      category: "Concert",
    },
    {
      id: 3,
      title: "Diljit Dosanjh Album Release Party",
      artist: "Diljit Dosanjh",
      date: "May 5, 2024",
      time: "9:00 PM",
      location: "Hard Rock Cafe, Bangalore",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=400&fit=crop",
      price: "$35-$80",
      category: "Album Launch",
    },
    {
      id: 4,
      title: "Neha Kakkar Live Performance",
      artist: "Neha Kakkar",
      date: "May 12, 2024",
      time: "7:00 PM",
      location: "NSCI Dome, Mumbai",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=400&fit=crop",
      price: "$40-$100",
      category: "Concert",
    },
  ];

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGetTickets = (eventTitle: string) => {
    toast({
      title: "Redirecting to Tickets",
      description: `Getting tickets for ${eventTitle}...`,
    });
  };

  const handleReminder = (eventTitle: string) => {
    toast({
      title: "Reminder Set",
      description: `You'll be notified about ${eventTitle}`,
    });
  };

  const handleLike = (eventTitle: string) => {
    toast({
      title: "Event Saved",
      description: `${eventTitle} added to your favorites`,
    });
  };

  return (
    <div className="min-h-screen pb-32">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Discover live performances and exclusive events from your favorite artists
        </p>

        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search events, artists, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="concerts">Concerts</TabsTrigger>
          <TabsTrigger value="launches">Album Launches</TabsTrigger>
          <TabsTrigger value="my-events">My Events</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden bg-card border-border hover:border-primary/50 transition-all group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full w-10 h-10 p-0"
                        onClick={() => handleLike(event.title)}
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full w-10 h-10 p-0"
                        onClick={() => handleReminder(event.title)}
                      >
                        <Bell className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-sm rounded-full mb-2 inline-block">
                        {event.category}
                      </span>
                      <h3 className="text-2xl font-bold mb-1">{event.title}</h3>
                      <p className="text-muted-foreground">{event.artist}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Starting from</p>
                        <p className="text-2xl font-bold text-primary">{event.price}</p>
                      </div>
                      <Button
                        className="bg-gradient-primary hover:shadow-glow"
                        onClick={() => handleGetTickets(event.title)}
                      >
                        Get Tickets
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No events found matching your search.</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="concerts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents
              .filter((e) => e.category === "Concert")
              .map((event) => (
                <Card key={event.id} className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-muted-foreground">{event.artist}</p>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="launches">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents
              .filter((e) => e.category === "Album Launch")
              .map((event) => (
                <Card key={event.id} className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-muted-foreground">{event.artist}</p>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="my-events">
          <Card className="p-12 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No Saved Events</h3>
            <p className="text-muted-foreground">
              Events you like or set reminders for will appear here
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Events;
