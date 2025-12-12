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
          className="h-32 md:h-48 bg-cover bg-center"
          style={{
            backgroundImage: event.banner_url
              ? `url(${event.banner_url})`
              : "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-foreground)))",
          }}
        />
        <CardContent className="p-3 md:p-6">
          <div className="flex items-start justify-between mb-2 md:mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-xl font-bold mb-0.5 md:mb-1 truncate">{event.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                by {event.artist_profiles?.stage_name}
              </p>
            </div>
            {!isFree && (
              <div className="text-right flex-shrink-0 ml-2">
                <div className="text-lg md:text-2xl font-bold text-primary">
                  ${event.ticket_price}
                </div>
                <div className="text-[10px] md:text-xs text-muted-foreground">per ticket</div>
              </div>
            )}
            {isFree && (
              <div className="px-2 md:px-3 py-0.5 md:py-1 bg-green-500/20 text-green-700 dark:text-green-300 rounded-full text-xs md:text-sm font-semibold flex-shrink-0 ml-2">
                FREE
              </div>
            )}
          </div>

          {event.description && (
            <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 line-clamp-2">
              {event.description}
            </p>
          )}

          <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
            <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
              <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">
                {format(new Date(event.event_date), "PPP 'at' p")}
              </span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
              <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />
              <span>
                {event.available_seats} / {event.total_seats} seats
              </span>
            </div>
          </div>

          <Button
            className="w-full h-8 md:h-10 text-xs md:text-sm"
            onClick={() => setBookingOpen(true)}
            disabled={isSoldOut}
          >
            <Ticket className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
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
