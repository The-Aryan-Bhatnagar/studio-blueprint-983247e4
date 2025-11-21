import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MousePointerClick, DollarSign, TrendingUp, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useAdminAds } from "@/hooks/useAdminData";

const AdsDashboard = () => {
  const navigate = useNavigate();
  const { data: ads, isLoading } = useAdminAds();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Ads Management Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage advertising campaigns</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Impressions</CardTitle>
            <Eye className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.2M</div>
            <p className="text-xs text-emerald-500 mt-1">+22.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
            <MousePointerClick className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">48,234</div>
            <p className="text-xs text-emerald-500 mt-1">+18.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ad Revenue</CardTitle>
            <DollarSign className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$28,450</div>
            <p className="text-xs text-emerald-500 mt-1">+12.7% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average CTR</CardTitle>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.02%</div>
            <p className="text-xs text-emerald-500 mt-1">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Ad Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Active Ad Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Summer Festival Promo</TableCell>
                <TableCell>245K</TableCell>
                <TableCell>9.8K</TableCell>
                <TableCell>$4,890</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">New Album Launch</TableCell>
                <TableCell>189K</TableCell>
                <TableCell>7.2K</TableCell>
                <TableCell>$3,600</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Artist Spotlight</TableCell>
                <TableCell>156K</TableCell>
                <TableCell>5.9K</TableCell>
                <TableCell>$2,950</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">Paused</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Premium Subscription</TableCell>
                <TableCell>312K</TableCell>
                <TableCell>12.5K</TableCell>
                <TableCell>$6,250</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdsDashboard;
