import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageSquarePlus, TrendingUp, Users } from 'lucide-react';
import Header from '@/components/Header';
import IssueCard from '@/components/IssueCard';
import IssueFilters from '@/components/IssueFilters';
import { useIssues } from '@/hooks/useIssues';
import { useAuth } from '@/contexts/AuthContext';
import { IssueCategory, IssueStatus } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard: React.FC = () => {
  const { issues, loading, toggleVote } = useIssues();
  const { user } = useAuth();
  
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'votes'>('recent');

  const filteredIssues = useMemo(() => {
    let result = [...issues];

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(issue => issue.categoryId === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(issue => issue.status === statusFilter);
    }

    // Apply sorting
    if (sortBy === 'votes') {
      result.sort((a, b) => b.votes.length - a.votes.length);
    } else {
      result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return result;
  }, [issues, categoryFilter, statusFilter, sortBy]);

  const stats = useMemo(() => ({
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    solved: issues.filter(i => i.status === 'solved').length,
    totalVotes: issues.reduce((acc, i) => acc + i.votes.length, 0),
  }), [issues]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(263_70%_50%_/_0.1),_transparent_50%)]" />
        <div className="container py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Welcome back, <span className="gradient-text">{user?.displayName?.split(' ')[0]}</span>
            </h1>
            <p className="text-muted-foreground">
              Browse community issues, vote on what matters, and make your voice heard.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
          >
            {[
              { label: 'Total Issues', value: stats.total, icon: MessageSquarePlus },
              { label: 'Pending', value: stats.pending, icon: TrendingUp },
              { label: 'Solved', value: stats.solved, icon: Users },
              { label: 'Total Votes', value: stats.totalVotes, icon: TrendingUp },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="p-4 rounded-xl bg-card border border-border/50 text-center"
              >
                <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold font-display">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-6">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <IssueFilters
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            sortBy={sortBy}
            onCategoryChange={setCategoryFilter}
            onStatusChange={setStatusFilter}
            onSortChange={setSortBy}
          />
        </motion.div>

        {/* Issues Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredIssues.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <MessageSquarePlus className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2">No issues found</h3>
            <p className="text-muted-foreground">
              {categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Be the first to raise an issue!'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue, i) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <IssueCard
                  issue={issue}
                  onVote={toggleVote}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
