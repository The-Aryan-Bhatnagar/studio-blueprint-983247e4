import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useCreateEvent, useUpdateEvent, type Event } from "@/hooks/useEvents";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Upload, Calendar, MapPin, DollarSign, Users } from "lucide-react";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artistId: string;
  event?: Event;
}

const CreateEventDialog = ({ open, onOpenChange, artistId, event }: CreateEventDialogProps) => {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [location, setLocation] = useState(event?.location || "");
  const [eventDate, setEventDate] = useState(
    event?.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : ""
  );
  const [ticketPrice, setTicketPrice] = useState(event?.ticket_price?.toString() || "0");
  const [totalSeats, setTotalSeats] = useState(event?.total_seats?.toString() || "");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState(event?.banner_url || "");
  const [uploading, setUploading] = useState(false);

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const handleBannerUpload = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${artistId}-${Date.now()}.${fileExt}`;
      const filePath = `${artistId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("event-banners")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("event-banners")
        .getPublicUrl(filePath);

      setBannerUrl(data.publicUrl);
      toast({
        title: "Success",
        description: "Banner uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !location || !eventDate || !totalSeats) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const eventData = {
      artist_id: artistId,
      title,
      description,
      location,
      event_date: new Date(eventDate).toISOString(),
      ticket_price: parseFloat(ticketPrice) || 0,
      total_seats: parseInt(totalSeats),
      available_seats: event ? event.available_seats : parseInt(totalSeats),
      banner_url: bannerUrl,
      is_published: true,
    };

    if (event) {
      await updateEvent.mutateAsync({ id: event.id, ...eventData });
    } else {
      await createEvent.mutateAsync(eventData);
    }

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setEventDate("");
    setTicketPrice("0");
    setTotalSeats("");
    setBannerFile(null);
    setBannerUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create New Event"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Banner Upload */}
          <div className="space-y-2">
            <Label>Event Banner</Label>
            {bannerUrl && (
              <img
                src={bannerUrl}
                alt="Event banner preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setBannerFile(file);
                    handleBannerUpload(file);
                  }
                }}
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                disabled={!bannerFile || uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
              rows={4}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location *
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter event location"
              required
            />
          </div>

          {/* Event Date */}
          <div className="space-y-2">
            <Label htmlFor="eventDate">
              <Calendar className="w-4 h-4 inline mr-1" />
              Event Date & Time *
            </Label>
            <Input
              id="eventDate"
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>

          {/* Ticket Price */}
          <div className="space-y-2">
            <Label htmlFor="ticketPrice">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Ticket Price (0 for free)
            </Label>
            <Input
              id="ticketPrice"
              type="number"
              min="0"
              step="0.01"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Total Seats */}
          <div className="space-y-2">
            <Label htmlFor="totalSeats">
              <Users className="w-4 h-4 inline mr-1" />
              Total Seats *
            </Label>
            <Input
              id="totalSeats"
              type="number"
              min="1"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
              placeholder="Enter total number of seats"
              required
              disabled={!!event}
            />
            {event && (
              <p className="text-sm text-muted-foreground">
                Cannot change total seats for existing events
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createEvent.isPending || updateEvent.isPending}
            >
              {event ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
