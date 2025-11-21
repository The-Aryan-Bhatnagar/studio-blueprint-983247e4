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
  isMuted: boolean;
  isRepeat: boolean;
  isShuffle: boolean;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
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
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { startTracking, stopTracking } = usePlayTracking();


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const playSong = (song: Song) => {
    if (!audioRef.current) return;

    const previousSong = currentSong;

    // Stop tracking previous song if any
    if (previousSong) {
      stopTracking(String(previousSong.id));
    }

    // Update current song and reset playback
    setCurrentSong(song);
    audioRef.current.src = song.audioUrl;
    audioRef.current.currentTime = 0;

    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        // Start tracking play count for new song only when playback actually starts
        startTracking(String(song.id));
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
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
        playSong,
        togglePlay,
        seekTo,
        setVolume,
        toggleMute,
        toggleRepeat,
        toggleShuffle,
        playNext,
        playPrevious,
        queue,
        setQueue,
      }}
    >
      <audio
        ref={audioRef}
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
