import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, ThumbsUp, BarChart3, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { useUserIssues, useIssues } from '@/hooks/useIssues';
import { getCategoryLabel } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { issues: myIssues, votedIssues, loading } = useUserIssues();
  const { deleteIssue } = useIssues();
  const { toast } = useToast();

  const stats = {
    issuesPosted: myIssues.length,
    totalVotes: myIssues.reduce((acc, issue) => acc + issue.votes.length, 0),
    votedOn: votedIssues.length,
  };

  const handleDelete = async (issueId: string) => {
    try {
      await deleteIssue(issueId);
      toast({
        title: 'Issue Deleted',
        description: 'Your issue has been removed.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete issue',
        variant: 'destructive',
      });
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
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-display font-bold mb-6">Settings & Activity</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl gradient-bg">
                    <MessageSquare className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold font-display">{stats.issuesPosted}</p>
                    <p className="text-sm text-muted-foreground">Issues Posted</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-voice-violet">
                    <ThumbsUp className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold font-display">{stats.totalVotes}</p>
                    <p className="text-sm text-muted-foreground">Total Votes on My Issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-voice-pink">
                    <BarChart3 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold font-display">{stats.votedOn}</p>
                    <p className="text-sm text-muted-foreground">Issues I've Voted On</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Posted Issues */}
          <Card className="border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="font-display">My Posted Issues</CardTitle>
              <CardDescription>Manage the issues you've created</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground py-8 text-center">Loading...</p>
              ) : myIssues.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  You haven't posted any issues yet.
                </p>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Votes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myIssues.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {issue.title}
                          </TableCell>
                          <TableCell>{getCategoryLabel(issue.categoryId)}</TableCell>
                          <TableCell>{issue.votes.length}</TableCell>
                          <TableCell>
                            <Badge
                              variant={issue.status === 'pending' ? 'outline' : 'default'}
                              className={
                                issue.status === 'pending'
                                  ? 'border-orange-500 text-orange-500'
                                  : 'bg-green-500 text-white'
                              }
                            >
                              {issue.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDistanceToNow(issue.createdAt, { addSuffix: true })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-card">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Issue?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete your issue.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(issue.id)}
                                      className="bg-destructive text-destructive-foreground"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Issues I've Voted On */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display">Issues I've Voted On</CardTitle>
              <CardDescription>Track the issues you've supported</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground py-8 text-center">Loading...</p>
              ) : votedIssues.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  You haven't voted on any issues yet.
                </p>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Total Votes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {votedIssues.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {issue.title}
                          </TableCell>
                          <TableCell>{getCategoryLabel(issue.categoryId)}</TableCell>
                          <TableCell>{issue.votes.length}</TableCell>
                          <TableCell>
                            <Badge
                              variant={issue.status === 'pending' ? 'outline' : 'default'}
                              className={
                                issue.status === 'pending'
                                  ? 'border-orange-500 text-orange-500'
                                  : 'bg-green-500 text-white'
                              }
                            >
                              {issue.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDistanceToNow(issue.createdAt, { addSuffix: true })}
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

export default Settings;
