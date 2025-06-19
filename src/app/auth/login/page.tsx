"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import Alert from "@/components/ui/Alert";
import PublicRoute from "@/components/auth/PublicRoute";
import { createUserProfile, ensureUserProfile } from "@/utils/userProfile";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  college: string;
  branch: string;
  year: string;
  semester: string;
}

function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Handle login
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Wait a moment for auth context to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try to get user profile, create if missing
      try {
        const userData = await ensureUserProfile(data.user.id, data.user.email || email);
        localStorage.setItem('userProfile', JSON.stringify(userData));
        
        // Show success and redirect after a delay
        setSuccess('Login successful! Redirecting to homepage...');
        setTimeout(() => {
          router.push('/');
        }, 1500);
        
        setLoading(false);
      } catch (profileError) {
        console.error('Profile error:', profileError);
        setError('Failed to load user profile. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred during login.');
      setLoading(false);
    }
  };

  // Handle register
  const handleRegister = async (formData: RegisterFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // First, create the auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError('Failed to create user account.');
        setLoading(false);
        return;
      }

      // Wait a moment for auth context to be available
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Create user profile
      try {
        await createUserProfile({
          id: data.user.id,
          name: formData.name,
          email: formData.email,
          college: formData.college,
          branch: formData.branch,
          year: formData.year,
          semester: formData.semester
        });
      } catch (insertError: any) {
        console.error('User insert error:', insertError);
        setError(`Registration failed: ${insertError.message}`);
        
        // If user profile creation fails, clean up auth user
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }
      
      // Sign out the user so they can login manually
      await supabase.auth.signOut();
      
      setSuccess('Registration successful! Please check your email to verify your account, then sign in.');
      setLoading(false);
      setMode('login');
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred during registration.');
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={mode === 'login' ? 'Welcome Back' : 'Create Account'}
      subtitle={mode === 'login'        ? 'Sign in to continue to LearnConnect' 
        : 'Join LearnConnect to access your academic resources'
      }
    >      {error && (
        <Alert type="error" message={error} />
      )}
      
      {success && (
        <Alert type="success" message={success} />
      )}

      {mode === 'login' ? (
        <LoginForm
          onSubmit={handleLogin}
          loading={loading}
          error={error}
        />
      ) : (
        <RegisterForm
          onSubmit={handleRegister}
          loading={loading}
          error={error}
          success={success}
        />
      )}

      <div className="mt-8 text-center">
        {mode === 'login' ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400"
          >
            Don&apos;t have an account?{' '}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 font-semibold transition-all duration-300"
              onClick={() => { 
                setMode('register'); 
                setError(''); 
                setSuccess(''); 
              }}
            >
              Sign up
            </motion.button>
          </motion.p>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400"
          >
            Already have an account?{' '}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 font-semibold transition-all duration-300"
              onClick={() => { 
                setMode('login'); 
                setError(''); 
                setSuccess(''); 
              }}
            >
              Sign in
            </motion.button>
          </motion.p>
        )}
      </div>
    </AuthLayout>
  );
}

function AuthPageWrapper() {
  return (
    <PublicRoute>
      <AuthPage />
    </PublicRoute>
  );
}

export default AuthPageWrapper;