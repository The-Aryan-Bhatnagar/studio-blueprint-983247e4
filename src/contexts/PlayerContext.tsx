import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { usePlayTracking } from "@/hooks/usePlayTracking";

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
  playSong: (song: Song) => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
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
  const [queue, setQueue] = useState<Song[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { startTracking, stopTracking } = usePlayTracking();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener("ended", () => {
        playNext();
      });
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const playSong = (song: Song) => {
    if (audioRef.current) {
      // Stop tracking previous song if any
      if (currentSong) {
        stopTracking(String(currentSong.id));
      }
      
      audioRef.current.src = song.audioUrl;
      audioRef.current.play();
      setCurrentSong(song);
      setIsPlaying(true);
      
      // Start tracking play count for new song
      startTracking(String(song.id));
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        // Stop tracking when paused
        if (currentSong) {
          stopTracking(String(currentSong.id));
        }
      } else {
        audioRef.current.play();
        // Resume tracking when playing again
        if (currentSong) {
          startTracking(String(currentSong.id));
        }
      }
      setIsPlaying(!isPlaying);
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

  const playNext = () => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    playSong(queue[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    playSong(queue[prevIndex]);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        playSong,
        togglePlay,
        seekTo,
        setVolume,
        playNext,
        playPrevious,
        queue,
        setQueue,
      }}
    >
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
