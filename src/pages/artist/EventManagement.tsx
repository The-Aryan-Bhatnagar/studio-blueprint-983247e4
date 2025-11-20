import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit, Trash2, Calendar, Users, Ticket, Eye } from "lucide-react";
import { useArtistEvents, useDeleteEvent, type Event } from "@/hooks/useEvents";
import { useArtistProfile } from "@/hooks/useArtistProfile";
import CreateEventDialog from "@/components/CreateEventDialog";
import EventBookingsDialog from "@/components/EventBookingsDialog";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const EventManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [viewingBookings, setViewingBookings] = useState<Event | null>(null);

  const { data: artistProfile } = useArtistProfile();
  const { data: events, isLoading } = useArtistEvents(artistProfile?.id);
  const deleteEvent = useDeleteEvent();

  const filteredEvents = events?.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleDelete = async () => {
    if (deletingEvent) {
      await deleteEvent.mutateAsync(deletingEvent.id);
      setDeletingEvent(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Event Management</h2>
          <p className="text-muted-foreground">
            Create and manage your events and track ticket sales
          </p>
        </div>
        <Button onClick={() => setCreateEventOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search your events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No events yet. Create your first event to start selling tickets!
            </p>
            <Button onClick={() => setCreateEventOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Event Banner */}
                  <div
                    className="w-48 h-32 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{
                      backgroundImage: event.banner_url
                        ? `url(${event.banner_url})`
                        : "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-foreground)))",
                    }}
                  />

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(event.event_date), "PPP")}
                          </span>
                          <span>{event.location}</span>
                        </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewingBookings(event)}
                                title="View Bookings"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingEvent(event);
                                  setCreateEventOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeletingEvent(event)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                    </div>

                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    {/* Event Stats */}
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-primary" />
                        <div className="text-sm">
                          <div className="font-semibold">
                            ${event.ticket_price === 0 ? "Free" : event.ticket_price.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Price
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <div className="text-sm">
                          <div className="font-semibold">
                            {event.total_seats - event.available_seats} / {event.total_seats}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Booked
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <div className="text-sm">
                          <div className="font-semibold">
                            {event.available_seats}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Available
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {artistProfile && (
        <>
          <CreateEventDialog
            open={createEventOpen}
            onOpenChange={(open) => {
              setCreateEventOpen(open);
              if (!open) setEditingEvent(undefined);
            }}
            artistId={artistProfile.id}
            event={editingEvent}
          />

          {viewingBookings && (
            <EventBookingsDialog
              event={viewingBookings}
              open={!!viewingBookings}
              onOpenChange={(open) => !open && setViewingBookings(null)}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingEvent} onOpenChange={() => setDeletingEvent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingEvent?.title}"? This action cannot be undone and all bookings will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventManagement;
