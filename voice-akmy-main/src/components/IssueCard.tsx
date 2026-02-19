import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThumbsUp, Clock, CheckCircle2, AlertCircle, Pencil } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Issue, getCategoryLabel, getCategoryColor } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface IssueCardProps {
  issue: Issue;
  onVote: (issueId: string) => void;
  onClick?: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onVote, onClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const hasVoted = user ? issue.votes.includes(user.uid) : false;
  const isPending = issue.status === 'pending';
  const isOwner = user && issue.authorId === user.uid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card 
        className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 border-border/50 cursor-pointer group"
        onClick={onClick}
      >
        {/* Image */}
        {issue.imageUrl && (
          <div className="relative h-40 overflow-hidden">
            <img
              src={issue.imageUrl}
              alt={issue.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <Badge variant="secondary" className={`${getCategoryColor(issue.categoryId)} text-white border-0`}>
              {getCategoryLabel(issue.categoryId)}
            </Badge>
            <Badge 
              variant={isPending ? 'outline' : 'default'}
              className={isPending ? 'border-orange-500 text-orange-500' : 'bg-green-500 text-white border-0'}
            >
              {isPending ? (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Solved
                </>
              )}
            </Badge>
          </div>
          <h3 className="font-display font-semibold text-lg mt-2 line-clamp-2 group-hover:text-primary transition-colors">
            {issue.title}
          </h3>
        </CardHeader>

        <CardContent className="flex-1 pb-3">
          <p className="text-sm text-muted-foreground line-clamp-3">{issue.description}</p>
          
          {/* Admin Notes */}
          {issue.adminNotes && (
            <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 text-xs text-primary font-medium mb-1">
                <AlertCircle className="h-3 w-3" />
                Admin Update
              </div>
              <p className="text-sm text-foreground line-clamp-2">{issue.adminNotes}</p>
              {issue.adminUpdatedBy && (
                <p className="text-xs text-muted-foreground mt-1">
                  — {issue.adminUpdatedBy}
                </p>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-3 border-t border-border/50">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Button
                variant={hasVoted ? 'default' : 'outline'}
                size="sm"
                className={hasVoted ? 'gradient-bg border-0' : 'hover:border-primary'}
                onClick={(e) => {
                  e.stopPropagation();
                  onVote(issue.id);
                }}
              >
                <ThumbsUp className={`h-4 w-4 mr-1 ${hasVoted ? '' : ''}`} />
                {issue.votes.length}
              </Button>
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:border-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/issues/${issue.id}/edit`);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(issue.createdAt, { addSuffix: true })}
            </span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default IssueCard;
