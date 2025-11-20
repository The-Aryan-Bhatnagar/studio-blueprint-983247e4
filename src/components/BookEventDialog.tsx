import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useBookEvent, type Event } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Ticket, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface BookEventDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookEventDialog = ({ event, open, onOpenChange }: BookEventDialogProps) => {
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const { user } = useAuth();
  const bookEvent = useBookEvent();

  const totalAmount = event.ticket_price * numberOfTickets;
  const maxTickets = Math.min(event.available_seats, 10); // Max 10 tickets per booking

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "Please login to book tickets",
        variant: "destructive",
      });
      return;
    }

    if (numberOfTickets > event.available_seats) {
      toast({
        title: "Error",
        description: "Not enough seats available",
        variant: "destructive",
      });
      return;
    }

    // Fetch user profile for additional info
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone_number")
      .eq("user_id", user.id)
      .single();

    await bookEvent.mutateAsync({
      event_id: event.id,
      user_id: user.id,
      number_of_tickets: numberOfTickets,
      total_amount: totalAmount,
      booking_status: "confirmed",
      user_email: user.email || "",
      user_name: profile?.full_name || "",
      user_phone: profile?.phone_number || "",
    });

    onOpenChange(false);
    setNumberOfTickets(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Book Tickets</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Info */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold">{event.title}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{format(new Date(event.event_date), "PPP 'at' p")}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-muted-foreground" />
                <span>{event.available_seats} seats available</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Number of Tickets */}
            <div className="space-y-2">
              <Label htmlFor="tickets">Number of Tickets</Label>
              <Input
                id="tickets"
                type="number"
                min="1"
                max={maxTickets}
                value={numberOfTickets}
                onChange={(e) =>
                  setNumberOfTickets(Math.min(parseInt(e.target.value) || 1, maxTickets))
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Maximum {maxTickets} tickets per booking
              </p>
            </div>

            {/* Price Summary */}
            <div className="p-4 bg-secondary rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ticket Price:</span>
                <span>${event.ticket_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Quantity:</span>
                <span>×{numberOfTickets}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Total:
                </span>
                <span className="text-primary">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  setNumberOfTickets(1);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={bookEvent.isPending}
                className="flex-1"
              >
                {bookEvent.isPending ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookEventDialog;
