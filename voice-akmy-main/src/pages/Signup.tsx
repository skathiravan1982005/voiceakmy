import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Megaphone, UserPlus, Mail, Lock, Eye, EyeOff, User, IdCard } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

const Signup: React.FC = () => {
  const [role, setRole] = useState<UserRole>('student');
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, signUpWithEmail } = useAuth();
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

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
      await signUpWithEmail(email, password, role, displayName, role !== 'student' ? userId : undefined);
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-voice-deep">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(263_70%_50%_/_0.3),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(280_80%_60%_/_0.25),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(330_80%_60%_/_0.15),_transparent_60%)]" />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-voice-violet/20 blur-3xl"
          animate={{ 
            x: [0, -50, 0], 
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-voice-purple/15 blur-3xl"
          animate={{ 
            x: [0, 40, 0], 
            y: [0, -40, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Signup Card */}
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
              <CardTitle className="text-3xl font-display font-bold gradient-text">Join VOICE</CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Create your account to get started
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-3">
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
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter your official ID"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="pl-10 bg-background/50 border-white/20"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This ID will be visible and cannot be hidden for accountability.
                  </p>
                </motion.div>
              )}

              {/* Display Name */}
              <div className="space-y-2">
                <Label className="text-foreground">Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-10 bg-background/50 border-white/20"
                    required
                  />
                </div>
              </div>

              {/* Email */}
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
                    required
                  />
                </div>
              </div>

              {/* Password */}
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
                    required
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label className="text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-background/50 border-white/20"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gradient-bg border-0" disabled={isLoading}>
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardContent>

          <CardFooter className="pt-0">
            <p className="text-xs text-center text-muted-foreground w-full">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
