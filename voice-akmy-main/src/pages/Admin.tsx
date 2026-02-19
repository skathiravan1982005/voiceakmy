import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, TrendingUp, CheckCircle, ArrowUpDown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import { useIssues } from '@/hooks/useIssues';
import { useAuth } from '@/contexts/AuthContext';
import { getCategoryLabel, IssueStatus } from '@/types';
import { formatDistanceToNow, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Admin: React.FC = () => {
  const { issues, loading, updateStatus, addAdminNote } = useIssues();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [sortBy, setSortBy] = useState<'recent' | 'votes'>('recent');
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [reportNote, setReportNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedIssues = useMemo(() => {
    const sorted = [...issues];
    if (sortBy === 'votes') {
      sorted.sort((a, b) => b.votes.length - a.votes.length);
    } else {
      sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    return sorted;
  }, [issues, sortBy]);

  const stats = useMemo(() => ({
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    solved: issues.filter(i => i.status === 'solved').length,
    totalVotes: issues.reduce((acc, i) => acc + i.votes.length, 0),
  }), [issues]);

  const handleStatusChange = async (issueId: string, status: IssueStatus) => {
    try {
      await updateStatus(issueId, status);
      toast({
        title: 'Status Updated',
        description: `Issue marked as ${status}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedIssue || !reportNote.trim()) return;

    setIsSubmitting(true);
    try {
      await addAdminNote(selectedIssue, reportNote.trim());
      toast({
        title: 'Report Saved',
        description: 'Your update has been added to the issue.',
      });
      setSelectedIssue(null);
      setReportNote('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save report',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and respond to community issues
              </p>
            </div>
            <Badge variant="outline" className="text-sm py-1 px-3">
              {user?.role === 'management' ? 'Management' : 'Admin'}
              {user?.userId && ` · ${user.userId}`}
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl gradient-bg">
                    <FileText className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold font-display">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-orange-500">
                    <TrendingUp className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold font-display">{stats.pending}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-500">
                    <CheckCircle className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold font-display">{stats.solved}</p>
                    <p className="text-sm text-muted-foreground">Solved</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-voice-violet">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold font-display">{stats.totalVotes}</p>
                    <p className="text-sm text-muted-foreground">Total Votes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Issues Table */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display">All Issues</CardTitle>
                <CardDescription>Review and manage submitted issues</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'recent' | 'votes')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="recent">Recently Uploaded</SelectItem>
                    <SelectItem value="votes">Highest Voting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground py-8 text-center">Loading...</p>
              ) : sortedIssues.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  No issues submitted yet.
                </p>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-center">Votes</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedIssues.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell>
                            <div className="max-w-[250px]">
                              <p className="font-medium truncate">{issue.title}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                by {issue.authorName}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{getCategoryLabel(issue.categoryId)}</TableCell>
                          <TableCell className="text-center font-medium">
                            {issue.votes.length}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(issue.createdAt, 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={issue.status}
                              onValueChange={(v) => handleStatusChange(issue.id, v as IssueStatus)}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover">
                                <SelectItem value="pending">
                                  <span className="text-orange-500">Pending</span>
                                </SelectItem>
                                <SelectItem value="solved">
                                  <span className="text-green-500">Solved</span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog
                              open={selectedIssue === issue.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  setSelectedIssue(issue.id);
                                  setReportNote(issue.adminNotes || '');
                                } else {
                                  setSelectedIssue(null);
                                  setReportNote('');
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Report
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-card">
                                <DialogHeader>
                                  <DialogTitle className="font-display">
                                    Add Report/Update
                                  </DialogTitle>
                                  <DialogDescription>
                                    Add an official update or report for: <strong>{issue.title}</strong>
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label>Admin Notes</Label>
                                    <Textarea
                                      placeholder="Enter your official update or report..."
                                      value={reportNote}
                                      onChange={(e) => setReportNote(e.target.value)}
                                      rows={5}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      This will be visible to all students on the issue card.
                                    </p>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedIssue(null);
                                      setReportNote('');
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    className="gradient-bg border-0"
                                    onClick={handleSubmitReport}
                                    disabled={isSubmitting || !reportNote.trim()}
                                  >
                                    {isSubmitting ? 'Saving...' : 'Save Report'}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;
