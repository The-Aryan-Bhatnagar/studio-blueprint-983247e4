import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAdminUsers, useDeleteContent } from "@/hooks/useAdminData";
import { Users, Mail, Calendar, UserCheck, Clock, Trash2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const UserManagement = () => {
  const { data: users, isLoading } = useAdminUsers();
  const deleteContent = useDeleteContent();

  const recentUsers = users?.slice(0, 10) || [];

  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteContent.mutate({ table: "profiles", id: userId });
    }
  };

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage all users on the platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users?.length || 0}</div>
            <p className="text-xs text-green-500 mt-1">↑ 12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            <UserCheck className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New This Month</CardTitle>
            <Calendar className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {users?.filter(u => {
                const created = new Date(u.created_at);
                const now = new Date();
                const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
                return created > monthAgo;
              }).length || 0}
            </div>
            <p className="text-xs text-blue-500 mt-1">In the last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Users</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Latest user registrations</p>
          </div>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <span className="font-medium">{user.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">user@music.com</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {Array.isArray(user.user_roles) && user.user_roles.length > 0 
                        ? user.user_roles[0].role 
                        : "user"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
