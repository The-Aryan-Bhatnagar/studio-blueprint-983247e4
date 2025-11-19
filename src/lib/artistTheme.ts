// Artist Portal Theme Configuration
// Distinct professional theme for content creators

export const artistTheme = {
  // Artist-specific color palette
  colors: {
    primary: 'hsl(271 91% 65%)', // Purple - creativity
    secondary: 'hsl(24 95% 53%)', // Orange - energy/action
    background: 'hsl(240 15% 8%)', // Darker professional background
    card: 'hsl(240 12% 10%)', // Darker cards
    muted: 'hsl(240 8% 15%)', // Muted elements
  },
  
  // Navigation items for artist portal
  navigation: [
    { title: 'Dashboard', path: '/artist/dashboard', icon: 'LayoutDashboard' },
    { title: 'Upload Song', path: '/artist/dashboard/upload', icon: 'Upload' },
    { title: 'My Songs', path: '/artist/dashboard/songs', icon: 'Music' },
    { title: 'Settings', path: '/artist/dashboard/settings', icon: 'Settings' },
  ],
} as const;
