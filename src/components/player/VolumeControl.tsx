import { Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function VolumeControl() {
  const { volume, isMuted, setVolume, toggleMute } = usePlayer();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="h-8 w-8 hover:bg-accent"
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <div className="w-20 cursor-pointer">
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={([value]) => setVolume(value)}
              max={100}
              step={1}
              className="cursor-pointer"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="flex items-center gap-2">
            <VolumeX className="h-4 w-4" />
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={([value]) => setVolume(value)}
              max={100}
              step={1}
              className="w-24"
            />
            <Volume2 className="h-4 w-4" />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
