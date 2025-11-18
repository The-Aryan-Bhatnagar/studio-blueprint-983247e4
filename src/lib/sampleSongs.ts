export interface Song {
  id: number;
  title: string;
  artist: string;
  image: string;
  plays: number;
  audioUrl: string;
  duration: string;
  genre: string;
}

export const sampleSongs: Song[] = [
  {
    id: 1,
    title: "Desi Kalakaar",
    artist: "Honey Singh",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    plays: 2345678,
    audioUrl: "/audio/desi-kalakaar.mp3",
    duration: "3:45",
    genre: "Punjabi Pop",
  },
  {
    id: 2,
    title: "Dheere Dheere",
    artist: "Honey Singh",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    plays: 3456789,
    audioUrl: "/audio/dheere-dheere.mp3",
    duration: "4:12",
    genre: "Romantic",
  },
  {
    id: 3,
    title: "Dope Shope",
    artist: "Honey Singh",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
    plays: 1987654,
    audioUrl: "/audio/dope-shope.mp3",
    duration: "3:28",
    genre: "Hip Hop",
  },
  {
    id: 4,
    title: "Get Up Jawani",
    artist: "Honey Singh",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop",
    plays: 1765432,
    audioUrl: "/audio/get-up-jawani.mp3",
    duration: "3:15",
    genre: "Party",
  },
  {
    id: 5,
    title: "Haye Mera Dil",
    artist: "Honey Singh",
    image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop",
    plays: 1654321,
    audioUrl: "/audio/haye-mera-dil.mp3",
    duration: "3:55",
    genre: "Romantic",
  },
  {
    id: 6,
    title: "High Heels",
    artist: "Honey Singh",
    image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400&fit=crop",
    plays: 2543210,
    audioUrl: "/audio/high-heels.mp3",
    duration: "4:32",
    genre: "Party",
  },
  {
    id: 7,
    title: "Mere Mehboob Qayamat Hogi",
    artist: "Honey Singh",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop",
    plays: 1432109,
    audioUrl: "/audio/mere-mehboob-qayamat-hogi.mp3",
    duration: "5:15",
    genre: "Romantic",
  },
  {
    id: 8,
    title: "Raat Jashan Di",
    artist: "Honey Singh",
    image: "https://images.unsplash.com/photo-1499415479124-43c32433a620?w=400&h=400&fit=crop",
    plays: 1821098,
    audioUrl: "/audio/raat-jashan-di.mp3",
    duration: "4:05",
    genre: "Party",
  },
  {
    id: 9,
    title: "Superman",
    artist: "Honey Singh",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    plays: 2098765,
    audioUrl: "/audio/superman.mp3",
    duration: "3:38",
    genre: "Hip Hop",
  },
  {
    id: 10,
    title: "Yaar Bathere",
    artist: "Honey Singh",
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=400&fit=crop",
    plays: 1676543,
    audioUrl: "/audio/yaar-bathere.mp3",
    duration: "3:50",
    genre: "Punjabi Pop",
  },
];
