export type UserRole = 'student' | 'admin' | 'management';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
  userId?: string; // Custom ID for admin/management
  createdAt: Date;
}

export type IssueStatus = 'pending' | 'solved';

export type IssueCategory = 
  | 'bug-report' 
  | 'feature-request' 
  | 'infrastructure' 
  | 'academic' 
  | 'facility' 
  | 'other';

export interface Issue {
  id: string;
  title: string;
  description: string;
  categoryId: IssueCategory;
  authorId: string;
  authorName: string;
  authorEmail: string;
  createdAt: Date;
  updatedAt: Date;
  status: IssueStatus;
  votes: string[]; // Array of user IDs who voted
  imageUrl?: string;
  adminNotes?: string;
  adminUpdatedBy?: string;
  adminUpdatedAt?: Date;
}

export const CATEGORIES: { id: IssueCategory; label: string; color: string }[] = [
  { id: 'bug-report', label: 'Bug Report', color: 'bg-red-500' },
  { id: 'feature-request', label: 'Feature Request', color: 'bg-blue-500' },
  { id: 'infrastructure', label: 'Infrastructure', color: 'bg-orange-500' },
  { id: 'academic', label: 'Academic', color: 'bg-green-500' },
  { id: 'facility', label: 'Facility', color: 'bg-purple-500' },
  { id: 'other', label: 'Other', color: 'bg-gray-500' },
];

export const getCategoryLabel = (id: IssueCategory): string => {
  return CATEGORIES.find(c => c.id === id)?.label || 'Other';
};

export const getCategoryColor = (id: IssueCategory): string => {
  return CATEGORIES.find(c => c.id === id)?.color || 'bg-gray-500';
};
