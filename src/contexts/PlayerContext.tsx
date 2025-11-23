import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { usePlayTracking } from "@/hooks/usePlayTracking";
import { supabase } from "@/integrations/supabase/client";

export interface Song {
  id: string | number;
  title: string;
  artist: string;
  image: string;
  audioUrl: string;
  plays: number;
  duration?: number | string;
  genre?: string;
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isRepeat: boolean;
  isShuffle: boolean;
  isFullScreenOpen: boolean;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setFullScreenOpen: (open: boolean) => void;
  queue: Song[];
  setQueue: (songs: Song[]) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioObjectUrlRef = useRef<string | null>(null);
  const { startTracking, stopTracking } = usePlayTracking();


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const playSong = (song: Song) => {
    console.log("playSong called", { song });

    void (async () => {
      if (!audioRef.current) {
        console.log("playSong: no audio element");
        return;
      }

      const audio = audioRef.current;
      const previousSong = currentSong;

      // Stop tracking previous song if any
      if (previousSong) {
        stopTracking(String(previousSong.id));
      }

      setCurrentSong(song);
      setIsPlaying(false);

      let sourceUrl = song.audioUrl;
      let finalSrc = sourceUrl;

      try {
        // If this is a Supabase Storage URL, try downloading via the client
        if (sourceUrl.includes("/storage/v1/object/")) {
          try {
            const url = new URL(sourceUrl);
            const parts = url.pathname.split("/");
            // e.g. /storage/v1/object/public/song-audio/file.mp3
            const publicIndex = parts.findIndex((p) => p === "public" || p === "sign");
            const bucket = parts[publicIndex + 1];
            const filePath = decodeURIComponent(parts.slice(publicIndex + 2).join("/"));

            console.log("Downloading from storage", { bucket, filePath });

            const { data, error } = await supabase.storage
              .from(bucket)
              .download(filePath);

            if (error) {
              console.error("Error downloading audio from storage", error);
            } else if (data) {
              if (audioObjectUrlRef.current) {
                URL.revokeObjectURL(audioObjectUrlRef.current);
              }
              const blobUrl = URL.createObjectURL(data);
              audioObjectUrlRef.current = blobUrl;
              finalSrc = blobUrl;
            }
          } catch (storageError) {
            console.error("Error parsing storage URL", storageError);
          }
        }

        // Fallback: direct fetch when not a storage URL or storage download failed
        if (finalSrc === sourceUrl && !sourceUrl.startsWith("/audio/")) {
          try {
            const response = await fetch(sourceUrl);
            if (response.ok) {
              const blob = await response.blob();
              if (audioObjectUrlRef.current) {
                URL.revokeObjectURL(audioObjectUrlRef.current);
              }
              const blobUrl = URL.createObjectURL(blob);
              audioObjectUrlRef.current = blobUrl;
              finalSrc = blobUrl;
            } else {
              console.error("Direct fetch failed", response.status, response.statusText);
            }
          } catch (fetchError) {
            console.error("Error fetching audio directly", fetchError);
          }
        }

        console.log("Using audio src", finalSrc);

        audio.pause();
        audio.currentTime = 0;
        audio.src = finalSrc;
        audio.load();

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }

        setIsPlaying(true);
        startTracking(String(song.id));
      } catch (error) {
        console.error("Error in playSong pipeline", error);
        setIsPlaying(false);
      }
    })();
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      // Stop tracking when paused
      if (currentSong) {
        stopTracking(String(currentSong.id));
      }
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          // Resume tracking when playing again
          if (currentSong) {
            startTracking(String(currentSong.id));
          }
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error resuming audio:", error);
          setIsPlaying(false);
        });
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const playNext = () => {
    if (!currentSong || queue.length === 0) return;
    
    if (isShuffle) {
      // Pick a random song that's not the current one
      const otherSongs = queue.filter(s => s.id !== currentSong.id);
      if (otherSongs.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherSongs.length);
        playSong(otherSongs[randomIndex]);
      }
    } else {
      const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
      const nextIndex = (currentIndex + 1) % queue.length;
      playSong(queue[nextIndex]);
    }
  };

  const playPrevious = () => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    playSong(queue[prevIndex]);
  };

  useEffect(() => {
    return () => {
      if (audioObjectUrlRef.current) {
        URL.revokeObjectURL(audioObjectUrlRef.current);
      }
    };
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isRepeat,
        isShuffle,
        isFullScreenOpen,
        playSong,
        togglePlay,
        seekTo,
        setVolume,
        toggleMute,
        toggleRepeat,
        toggleShuffle,
        playNext,
        playPrevious,
        setFullScreenOpen: setIsFullScreenOpen,
        queue,
        setQueue,
      }}
    >
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime || 0);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onEnded={() => {
          if (isRepeat && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current
              .play()
              .catch((error) => console.error("Error replaying audio:", error));
          } else {
            playNext();
          }
        }}
        className="hidden"
      />
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
};
