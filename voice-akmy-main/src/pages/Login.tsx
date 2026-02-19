import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Megaphone, LogIn, Mail, Lock, Eye, EyeOff, User, IdCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import IntroAnimation from '@/components/IntroAnimation';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [role, setRole] = useState<UserRole>('student');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, signInWithGoogle, setDummyUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        navigate('/dashboard');
      } else {
        navigate('/admin');
      }
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    if (role !== 'student' && !userId.trim()) {
      toast({
        title: 'User ID Required',
        description: 'Please enter your official User ID for admin/management roles.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await signInWithGoogle(role, role !== 'student' ? userId : undefined);
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Set dummy user and navigate based on role
    setDummyUser(role, role !== 'student' ? userId : undefined);
  };

  if (showIntro) {
    return <IntroAnimation onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-voice-deep">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(263_70%_50%_/_0.3),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(280_80%_60%_/_0.25),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(330_80%_60%_/_0.15),_transparent_60%)]" />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-voice-purple/20 blur-3xl"
          animate={{ 
            x: [0, 50, 0], 
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-voice-violet/15 blur-3xl"
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 40, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="glass-card border-white/10 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-2">
            {/* Logo */}
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <div className="relative p-4 rounded-2xl gradient-bg voice-glow">
                <Megaphone className="h-10 w-10 text-primary-foreground" />
              </div>
            </motion.div>
            
            <div>
              <CardTitle className="text-3xl font-display font-bold gradient-text">VOICE</CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Your platform to be heard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-foreground">I am a</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger className="bg-background/50 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="student">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Student
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <IdCard className="h-4 w-4" />
                      Admin (Staff/HOD)
                    </div>
                  </SelectItem>
                  <SelectItem value="management">
                    <div className="flex items-center gap-2">
                      <IdCard className="h-4 w-4" />
                      Management
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* User ID for Admin/Management */}
            {role !== 'student' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label className="text-foreground">Official User ID</Label>
                <Input
                  placeholder="Enter your official ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="bg-background/50 border-white/20"
                />
                <p className="text-xs text-muted-foreground">
                  This ID will be visible and cannot be hidden for accountability.
                </p>
              </motion.div>
            )}

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card/70 px-2 text-muted-foreground">or continue with email</span>
              </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div className="space-y-2">
                <Label className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-white/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-background/50 border-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </form>

            {/* Google Login */}
            <Button
              variant="outline"
              className="w-full bg-background/50 border-white/20 hover:bg-white/10"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardContent>

          <CardFooter className="pt-0">
            <p className="text-xs text-center text-muted-foreground w-full">
              <span className="text-primary">Note:</span> Your username is for identification only. 
              It will never be linked to your votes.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
