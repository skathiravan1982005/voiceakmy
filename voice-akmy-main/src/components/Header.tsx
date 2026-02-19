import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Megaphone, Home, Plus, Settings, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'management';
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2 group">
          <div className="relative p-2 rounded-xl gradient-bg group-hover:scale-105 transition-transform">
            <Megaphone className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold gradient-text">VOICE</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <Button
            variant={isActive(isAdmin ? '/admin' : '/dashboard') ? 'secondary' : 'ghost'}
            size="sm"
            asChild
          >
            <Link to={isAdmin ? '/admin' : '/dashboard'}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>

          {user?.role === 'student' && (
            <Button
              variant={isActive('/dashboard/issues/new') ? 'default' : 'outline'}
              size="sm"
              className={isActive('/dashboard/issues/new') ? 'gradient-bg border-0' : ''}
              asChild
            >
              <Link to="/dashboard/issues/new">
                <Plus className="h-4 w-4 mr-2" />
                Raise Issue
              </Link>
            </Button>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                  <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-popover" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.displayName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-primary capitalize">
                    {user?.role}
                    {user?.userId && ` · ${user.userId}`}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              {!isAdmin && (
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings & Activity
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};

export default Header;
