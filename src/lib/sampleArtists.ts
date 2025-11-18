export interface Artist {
  id: number;
  name: string;
  image: string;
  followers: string;
  genre: string;
}

export const sampleArtists: Artist[] = [
  {
    id: 1,
    name: "Honey Singh",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    followers: "3.5M",
    genre: "Punjabi Pop • Hip Hop",
  },
  {
    id: 2,
    name: "Badshah",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
    followers: "2.8M",
    genre: "Hip Hop • Rap",
  },
  {
    id: 3,
    name: "Diljit Dosanjh",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop",
    followers: "4.2M",
    genre: "Punjabi • Folk",
  },
  {
    id: 4,
    name: "Neha Kakkar",
    image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop",
    followers: "5.1M",
    genre: "Bollywood • Pop",
  },
  {
    id: 5,
    name: "Guru Randhawa",
    image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400&fit=crop",
    followers: "3.3M",
    genre: "Punjabi Pop",
  },
  {
    id: 6,
    name: "Arijit Singh",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop",
    followers: "6.8M",
    genre: "Romantic • Bollywood",
  },
  {
    id: 7,
    name: "Nucleya",
    image: "https://images.unsplash.com/photo-1499415479124-43c32433a620?w=400&h=400&fit=crop",
    followers: "1.9M",
    genre: "EDM • Electronic",
  },
  {
    id: 8,
    name: "Armaan Malik",
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=400&fit=crop",
    followers: "2.6M",
    genre: "Pop • Bollywood",
  },
];
