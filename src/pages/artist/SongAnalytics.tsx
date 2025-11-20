import { useParams, useNavigate } from "react-router-dom";
import { useSongs } from "@/hooks/useSongs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Users, MapPin, Smartphone, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SongAnalytics = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const { data: songs } = useSongs();
  
  const song = songs?.find(s => s.id === songId);
  const analytics = song?.song_analytics?.[0];

  if (!song) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Song not found</p>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Streams",
      value: analytics?.total_plays || 0,
      icon: Play,
      trend: "+12.5%",
      color: "text-primary"
    },
    {
      title: "Last 30 Days",
      value: analytics?.plays_last_30_days || 0,
      icon: TrendingUp,
      trend: "+8.3%",
      color: "text-green-500"
    },
    {
      title: "Last 7 Days",
      value: analytics?.plays_last_7_days || 0,
      icon: TrendingUp,
      trend: "+15.2%",
      color: "text-blue-500"
    },
    {
      title: "Total Likes",
      value: analytics?.total_likes || 0,
      icon: Users,
      trend: "+6.7%",
      color: "text-pink-500"
    },
  ];

  // Mock data for detailed analytics
  const topCountries = [
    { country: "United States", plays: 2450, percentage: 35 },
    { country: "India", plays: 1890, percentage: 27 },
    { country: "United Kingdom", plays: 980, percentage: 14 },
    { country: "Canada", plays: 670, percentage: 10 },
    { country: "Australia", plays: 450, percentage: 6 },
  ];

  const topCities = [
    { city: "New York", plays: 890 },
    { city: "Mumbai", plays: 750 },
    { city: "London", plays: 620 },
    { city: "Los Angeles", plays: 540 },
    { city: "Toronto", plays: 380 },
  ];

  const ageGroups = [
    { range: "18-24", percentage: 42 },
    { range: "25-34", percentage: 35 },
    { range: "35-44", percentage: 15 },
    { range: "45+", percentage: 8 },
  ];

  const devices = [
    { type: "Android", percentage: 48 },
    { type: "iOS", percentage: 38 },
    { type: "Web", percentage: 14 },
  ];

  const trafficSources = [
    { source: "Artist Profile", percentage: 35 },
    { source: "Search", percentage: 28 },
    { source: "Playlists", percentage: 22 },
    { source: "Direct Link", percentage: 15 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/artist/dashboard/songs")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{song.title}</h1>
          <p className="text-muted-foreground">Detailed Analytics</p>
        </div>
        <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
          PRO Feature
        </Badge>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-sm text-green-500 font-medium">{stat.trend}</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value.toLocaleString()}</h3>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </Card>
        ))}
      </div>

      {/* Geographic Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Top Countries</h2>
          </div>
          <div className="space-y-4">
            {topCountries.map((item) => (
              <div key={item.country}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{item.country}</span>
                  <span className="text-muted-foreground">{item.plays.toLocaleString()} plays</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Cities */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Top Cities</h2>
          </div>
          <div className="space-y-3">
            {topCities.map((item, index) => (
              <div key={item.city} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</span>
                  <span className="font-medium">{item.city}</span>
                </div>
                <span className="text-muted-foreground">{item.plays.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Demographics & Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Groups */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Age Groups</h2>
          <div className="space-y-4">
            {ageGroups.map((group) => (
              <div key={group.range}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{group.range}</span>
                  <span className="text-muted-foreground">{group.percentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary rounded-full"
                    style={{ width: `${group.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Devices */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Smartphone className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Devices</h2>
          </div>
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.type}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{device.type}</span>
                  <span className="text-muted-foreground">{device.percentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary rounded-full"
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Traffic Sources */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Traffic Sources</h2>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.source}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{source.source}</span>
                  <span className="text-muted-foreground">{source.percentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SongAnalytics;
