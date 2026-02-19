import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Issue, IssueCategory, IssueStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const useIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Check if using dummy user (no Firebase connection needed)
    const isDummyUser = user?.uid?.startsWith('dummy-user-');
    
    if (isDummyUser) {
      // Load from localStorage for dummy users
      const storedIssues = localStorage.getItem('dummyIssues');
      if (storedIssues) {
        const parsed = JSON.parse(storedIssues).map((issue: any) => ({
          ...issue,
          createdAt: new Date(issue.createdAt),
          updatedAt: new Date(issue.updatedAt),
          adminUpdatedAt: issue.adminUpdatedAt ? new Date(issue.adminUpdatedAt) : undefined,
        }));
        setIssues(parsed);
      }
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'issues'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const issuesData: Issue[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        adminUpdatedAt: doc.data().adminUpdatedAt?.toDate(),
      })) as Issue[];
      
      setIssues(issuesData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching issues:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Helper to save dummy issues to localStorage
  const saveDummyIssues = (updatedIssues: Issue[]) => {
    localStorage.setItem('dummyIssues', JSON.stringify(updatedIssues));
    setIssues(updatedIssues);
  };

  const createIssue = async (data: {
    title: string;
    description: string;
    categoryId: IssueCategory;
    imageUrl?: string;
  }) => {
    if (!user) throw new Error('Must be logged in to create an issue');

    const isDummyUser = user.uid?.startsWith('dummy-user-');

    if (isDummyUser) {
      // Create issue locally for dummy users
      const newIssue: Issue = {
        id: 'issue-' + Date.now(),
        ...data,
        authorId: user.uid,
        authorName: user.displayName || 'Demo User',
        authorEmail: user.email || 'demo@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending' as IssueStatus,
        votes: [],
      };
      saveDummyIssues([newIssue, ...issues]);
      return;
    }

    await addDoc(collection(db, 'issues'), {
      ...data,
      authorId: user.uid,
      authorName: user.displayName,
      authorEmail: user.email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'pending' as IssueStatus,
      votes: [],
    });
  };

  const updateIssue = async (issueId: string, data: Partial<Issue>) => {
    const isDummyUser = user?.uid?.startsWith('dummy-user-');

    if (isDummyUser) {
      const updatedIssues = issues.map(issue =>
        issue.id === issueId
          ? { ...issue, ...data, updatedAt: new Date() }
          : issue
      );
      saveDummyIssues(updatedIssues);
      return;
    }

    const issueRef = doc(db, 'issues', issueId);
    await updateDoc(issueRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteIssue = async (issueId: string) => {
    const isDummyUser = user?.uid?.startsWith('dummy-user-');

    if (isDummyUser) {
      const updatedIssues = issues.filter(issue => issue.id !== issueId);
      saveDummyIssues(updatedIssues);
      return;
    }

    await deleteDoc(doc(db, 'issues', issueId));
  };

  const toggleVote = async (issueId: string) => {
    if (!user) throw new Error('Must be logged in to vote');
    
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;

    const isDummyUser = user.uid?.startsWith('dummy-user-');

    if (isDummyUser) {
      const hasVoted = issue.votes.includes(user.uid);
      const updatedIssues = issues.map(i =>
        i.id === issueId
          ? { ...i, votes: hasVoted ? i.votes.filter(v => v !== user.uid) : [...i.votes, user.uid] }
          : i
      );
      saveDummyIssues(updatedIssues);
      return;
    }

    const issueRef = doc(db, 'issues', issueId);
    const hasVoted = issue.votes.includes(user.uid);

    await updateDoc(issueRef, {
      votes: hasVoted ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });
  };

  const updateStatus = async (issueId: string, status: IssueStatus) => {
    const isDummyUser = user?.uid?.startsWith('dummy-user-');

    if (isDummyUser) {
      const updatedIssues = issues.map(issue =>
        issue.id === issueId
          ? { ...issue, status, updatedAt: new Date() }
          : issue
      );
      saveDummyIssues(updatedIssues);
      return;
    }

    const issueRef = doc(db, 'issues', issueId);
    await updateDoc(issueRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  };

  const addAdminNote = async (issueId: string, note: string) => {
    if (!user) throw new Error('Must be logged in to add notes');

    const isDummyUser = user.uid?.startsWith('dummy-user-');

    if (isDummyUser) {
      const updatedIssues = issues.map(issue =>
        issue.id === issueId
          ? {
              ...issue,
              adminNotes: note,
              adminUpdatedBy: user.displayName,
              adminUpdatedAt: new Date(),
              updatedAt: new Date(),
            }
          : issue
      );
      saveDummyIssues(updatedIssues);
      return;
    }
    
    const issueRef = doc(db, 'issues', issueId);
    await updateDoc(issueRef, {
      adminNotes: note,
      adminUpdatedBy: user.displayName,
      adminUpdatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  return {
    issues,
    loading,
    createIssue,
    updateIssue,
    deleteIssue,
    toggleVote,
    updateStatus,
    addAdminNote,
  };
};

export const useUserIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [votedIssues, setVotedIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const isDummyUser = user.uid?.startsWith('dummy-user-');

    if (isDummyUser) {
      const storedIssues = localStorage.getItem('dummyIssues');
      if (storedIssues) {
        const parsed: Issue[] = JSON.parse(storedIssues).map((issue: any) => ({
          ...issue,
          createdAt: new Date(issue.createdAt),
          updatedAt: new Date(issue.updatedAt),
          adminUpdatedAt: issue.adminUpdatedAt ? new Date(issue.adminUpdatedAt) : undefined,
        }));
        setIssues(parsed.filter(issue => issue.authorId === user.uid));
        setVotedIssues(parsed.filter(issue => issue.votes?.includes(user.uid)));
      }
      setLoading(false);
      return;
    }

    // Get user's created issues
    const createdQuery = query(
      collection(db, 'issues'),
      where('authorId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeCreated = onSnapshot(createdQuery, (snapshot) => {
      const issuesData: Issue[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Issue[];
      
      setIssues(issuesData);
    });

    // Get all issues to filter voted ones
    const allQuery = query(collection(db, 'issues'), orderBy('createdAt', 'desc'));
    
    const unsubscribeVoted = onSnapshot(allQuery, (snapshot) => {
      const votedData: Issue[] = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        }))
        .filter((issue: any) => issue.votes?.includes(user.uid)) as Issue[];
      
      setVotedIssues(votedData);
      setLoading(false);
    });

    return () => {
      unsubscribeCreated();
      unsubscribeVoted();
    };
  }, [user]);

  return { issues, votedIssues, loading };
};
