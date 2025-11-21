import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { useAdminAds, useDeleteContent } from "@/hooks/useAdminData";

const AdsManagement = () => {
  const { data: ads, isLoading } = useAdminAds();
  const deleteContent = useDeleteContent();

  const handleDelete = async (adId: string) => {
    if (window.confirm("Are you sure you want to delete this ad?")) {
      await deleteContent.mutateAsync({ table: "ads", id: adId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeAds = ads?.filter((ad: any) => ad.is_active) || [];
  const inactiveAds = ads?.filter((ad: any) => !ad.is_active) || [];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ads Management</h1>
          <p className="text-muted-foreground">Control and monitor advertising campaigns</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Ad
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Ads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ads?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Ads</CardTitle>
            <Eye className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeAds.length}</div>
            <p className="text-xs text-emerald-500 mt-1">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Ads</CardTitle>
            <EyeOff className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inactiveAds.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Paused or ended</p>
          </CardContent>
        </Card>
      </div>

      {/* Ads Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Advertising Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No ads found. Create your first ad campaign.
                  </TableCell>
                </TableRow>
              ) : (
                ads?.map((ad: any) => (
                  <TableRow key={ad.id}>
                    <TableCell className="font-medium">{ad.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{ad.position}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          ad.priority === "high" 
                            ? "destructive" 
                            : ad.priority === "medium" 
                            ? "default" 
                            : "secondary"
                        }
                      >
                        {ad.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ad.is_active ? "default" : "secondary"}>
                        {ad.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {ad.start_date ? new Date(ad.start_date).toLocaleDateString() : "Not set"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {ad.end_date ? new Date(ad.end_date).toLocaleDateString() : "No end date"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(ad.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(ad.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdsManagement;
