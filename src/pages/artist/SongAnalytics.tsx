import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSongs } from "@/hooks/useSongs";
import { usePlayHistory } from "@/hooks/usePlayHistory";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Users, MapPin, Smartphone, Play, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DateRangePicker } from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";

const SongAnalytics = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const { data: songs } = useSongs();
  
  // Date range state (default to last 30 days)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const song = songs?.find(s => s.id === songId);
  const songAnalytics: any = song && (song as any).song_analytics;
  const analytics = Array.isArray(songAnalytics) ? songAnalytics[0] : songAnalytics;
  
  // Fetch play history with date range
  const { data: playHistory, isLoading } = usePlayHistory(
    songId || "",
    dateRange?.from,
    dateRange?.to
  );

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
      value: (playHistory?.totalPlays && playHistory.totalPlays > 0) 
        ? playHistory.totalPlays 
        : (analytics?.total_plays || 0),
      icon: Play,
      trend: "+12.5%",
      color: "text-primary"
    },
    {
      title: "Unique Listeners",
      value: (playHistory?.uniqueListeners && playHistory.uniqueListeners > 0)
        ? playHistory.uniqueListeners
        : (analytics?.total_plays || 0),
      icon: Users,
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

  const handleQuickFilter = (days: number) => {
    setDateRange({
      from: subDays(new Date(), days),
      to: new Date(),
    });
  };

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

      {/* Date Range Filter */}
      <Card className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Analytics Period</h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFilter(7)}
              >
                Last 7 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFilter(30)}
              >
                Last 30 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFilter(90)}
              >
                Last 90 Days
              </Button>
            </div>
          </div>
        </div>
      </Card>

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

      {isLoading ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Loading analytics...</p>
        </Card>
      ) : (
        <>
          {/* Geographic Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Countries */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Top Countries</h2>
              </div>
              {playHistory?.countryStats && playHistory.countryStats.length > 0 ? (
                <div className="space-y-4">
                  {playHistory.countryStats.map((item) => (
                    <div key={item.country}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">{item.country}</span>
                        <span className="text-muted-foreground">{item.count.toLocaleString()} plays ({item.percentage}%)</span>
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
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No geographic data available yet. Play counts will track location when available.
                </p>
              )}
            </Card>

            {/* Top Cities */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Top Cities</h2>
              </div>
              {playHistory?.cityStats && playHistory.cityStats.length > 0 ? (
                <div className="space-y-3">
                  {playHistory.cityStats.map((item, index) => (
                    <div key={item.city} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</span>
                        <span className="font-medium">{item.city}</span>
                      </div>
                      <span className="text-muted-foreground">{item.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No city data available yet
                </p>
              )}
            </Card>
          </div>

          {/* Demographics & Devices */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Age Groups */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Age Groups</h2>
              {playHistory?.ageGroupStats && playHistory.ageGroupStats.length > 0 ? (
                <div className="space-y-4">
                  {playHistory.ageGroupStats.map((group) => (
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
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No age group data available yet
                </p>
              )}
            </Card>

            {/* Devices */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Smartphone className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Devices</h2>
              </div>
              {playHistory?.deviceStats && playHistory.deviceStats.length > 0 ? (
                <div className="space-y-4">
                  {playHistory.deviceStats.map((device) => (
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
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No device data available yet
                </p>
              )}
            </Card>

            {/* Traffic Sources */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Traffic Sources</h2>
              {playHistory?.trafficStats && playHistory.trafficStats.length > 0 ? (
                <div className="space-y-4">
                  {playHistory.trafficStats.map((source) => (
                    <div key={source.source}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium capitalize">{source.source.replace('_', ' ')}</span>
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
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No traffic source data available yet
                </p>
              )}
            </Card>
          </div>

          {/* Total Comments */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-muted text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{analytics?.total_comments || 0}</h3>
                <p className="text-sm text-muted-foreground">Total Comments</p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default SongAnalytics;