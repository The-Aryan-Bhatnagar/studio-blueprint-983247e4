import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useEventBookings, type Event } from "@/hooks/useEvents";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { User, Mail, Phone, Ticket, DollarSign, Calendar } from "lucide-react";
import { format } from "date-fns";

interface EventBookingsDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventBookingsDialog = ({ event, open, onOpenChange }: EventBookingsDialogProps) => {
  const { data: bookings, isLoading } = useEventBookings(event.id);

  const totalRevenue = bookings?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;
  const totalTicketsSold = bookings?.reduce((sum, booking) => sum + booking.number_of_tickets, 0) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Booking Details - {event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Ticket className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{totalTicketsSold}</div>
                <div className="text-xs text-muted-foreground">Tickets Sold</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <User className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{bookings?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Total Bookings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Total Revenue</div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings List */}
          <div>
            <h3 className="font-semibold mb-4">Customer Details</h3>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading bookings...
              </div>
            ) : !bookings || bookings.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No bookings yet
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>
                            {booking.user_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>

                        {/* Customer Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                {booking.user_name || "Anonymous User"}
                              </h4>
                              {booking.user_email && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <Mail className="w-3 h-3" />
                                  <span className="truncate">{booking.user_email}</span>
                                </div>
                              )}
                              {booking.user_phone && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <Phone className="w-3 h-3" />
                                  <span>{booking.user_phone}</span>
                                </div>
                              )}
                            </div>

                            {/* Booking Status */}
                            <div className="px-3 py-1 bg-green-500/20 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                              {booking.booking_status}
                            </div>
                          </div>

                          {/* Booking Details */}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Ticket className="w-4 h-4 text-primary" />
                              <span className="font-medium">{booking.number_of_tickets}</span>
                              <span className="text-muted-foreground">
                                {booking.number_of_tickets === 1 ? "ticket" : "tickets"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-primary" />
                              <span className="font-medium">${booking.total_amount.toFixed(2)}</span>
                              <span className="text-muted-foreground">paid</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span className="text-muted-foreground">
                                Booked on {format(new Date(booking.created_at), "PPP")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventBookingsDialog;
