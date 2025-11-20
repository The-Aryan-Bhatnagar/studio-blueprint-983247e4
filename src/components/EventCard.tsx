import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, MapPin, Ticket, Users } from "lucide-react";
import { format } from "date-fns";
import type { Event } from "@/hooks/useEvents";
import { useState } from "react";
import BookEventDialog from "./BookEventDialog";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const isFree = event.ticket_price === 0;
  const isSoldOut = event.available_seats === 0;

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div
          className="h-48 bg-cover bg-center"
          style={{
            backgroundImage: event.banner_url
              ? `url(${event.banner_url})`
              : "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-foreground)))",
          }}
        />
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                by {event.artist_profiles?.stage_name}
              </p>
            </div>
            {!isFree && (
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  ${event.ticket_price}
                </div>
                <div className="text-xs text-muted-foreground">per ticket</div>
              </div>
            )}
            {isFree && (
              <div className="px-3 py-1 bg-green-500/20 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                FREE
              </div>
            )}
          </div>

          {event.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {event.description}
            </p>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>
                {format(new Date(event.event_date), "PPP 'at' p")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>
                {event.available_seats} / {event.total_seats} seats available
              </span>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={() => setBookingOpen(true)}
            disabled={isSoldOut}
          >
            <Ticket className="w-4 h-4 mr-2" />
            {isSoldOut ? "Sold Out" : "Book Tickets"}
          </Button>
        </CardContent>
      </Card>

      <BookEventDialog
        event={event}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </>
  );
};

export default EventCard;
