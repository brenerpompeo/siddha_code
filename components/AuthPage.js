'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { StarsBackground } from '@/components/ui/stars-background';
import { Sparkles, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CustomButton as Button } from './custom-ui/CustomButton';
import { CustomInput as Input } from './custom-ui/CustomInput';
import { GlassCard } from './custom-ui/GlassCard';

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const supabase = createClient();
  
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      
      if (error) throw error;
      
      if (data.user && !data.user.confirmed_at) {
        setMessage('Check your email for the confirmation link!');
      } else {
        onAuthSuccess(data.user);
      }
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
      // Redirect happens automatically
    } catch (err) {
      setError(err.message || `Failed to sign in with ${provider}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4 relative overflow-hidden">
      <StarsBackground className="absolute inset-0 z-0 pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-pillar-spiritual flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Siddha Code</h1>
          <p className="text-white/50 mt-2">Sistema Operacional de Vida</p>
        </div>
        
        <GlassCard className="p-8 backdrop-blur-xl bg-white/[0.03] border-white/10">
          {/* Social Logins */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            <Button 
                variant="outline" 
                className="bg-white/5 border-white/10 hover:bg-white/10 text-white flex items-center justify-center gap-2"
                onClick={() => handleOAuthLogin('google')}
                disabled={loading}
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                Google
            </Button>
          </div>

          <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0f0f13] px-2 text-white/40">Ou continue com email</span>
              </div>
          </div>

          <div className="flex mb-6 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => { setMode('signin'); setError(''); setMessage(''); }}
              className={cn(
                'flex-1 py-2 rounded-md text-sm font-medium transition-all',
                mode === 'signin' ? 'bg-primary text-white' : 'text-white/60 hover:text-white'
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setMessage(''); }}
              className={cn(
                'flex-1 py-2 rounded-md text-sm font-medium transition-all',
                mode === 'signup' ? 'bg-primary text-white' : 'text-white/60 hover:text-white'
              )}
            >
              Sign Up
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          
          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-sm text-green-400">{message}</p>
            </div>
          )}
          
          <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
            <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            
            <div className="relative">
              <Input label="Password" type={showPassword ? 'text' : 'password'} icon={Lock} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-white/30 hover:text-white/60">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {mode === 'signup' && (
              <Input label="Confirm Password" type={showPassword ? 'text' : 'password'} icon={Lock} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            )}
            
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <Button type="button" variant="secondary" className="w-full" onClick={() => onAuthSuccess({ id: 'demo-user', email: 'demo@siddhacode.com' })}>
              <Sparkles className="w-4 h-4 mr-2" />
              Try Demo Mode
            </Button>
            <p className="text-xs text-white/30 text-center mt-2">Explore todas as funcionalidades</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
