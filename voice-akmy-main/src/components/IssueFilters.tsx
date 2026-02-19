import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES, IssueCategory, IssueStatus } from '@/types';

interface IssueFiltersProps {
  categoryFilter: IssueCategory | 'all';
  statusFilter: IssueStatus | 'all';
  sortBy: 'recent' | 'votes';
  onCategoryChange: (value: IssueCategory | 'all') => void;
  onStatusChange: (value: IssueStatus | 'all') => void;
  onSortChange: (value: 'recent' | 'votes') => void;
}

const IssueFilters: React.FC<IssueFiltersProps> = ({
  categoryFilter,
  statusFilter,
  sortBy,
  onCategoryChange,
  onStatusChange,
  onSortChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters:</span>
      </div>

      {/* Category Filter */}
      <Select value={categoryFilter} onValueChange={(v) => onCategoryChange(v as IssueCategory | 'all')}>
        <SelectTrigger className="w-[160px] bg-background">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as IssueStatus | 'all')}>
        <SelectTrigger className="w-[140px] bg-background">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="solved">Solved</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex-1" />

      {/* Sort */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowUpDown className="h-4 w-4" />
        <span className="font-medium">Sort:</span>
      </div>
      <Select value={sortBy} onValueChange={(v) => onSortChange(v as 'recent' | 'votes')}>
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="recent">Recently Uploaded</SelectItem>
          <SelectItem value="votes">Highest Voting</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default IssueFilters;
