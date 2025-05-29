"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import Alert from "@/components/ui/Alert";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  college: string;
  branch: string;
  year: string;
  semester: string;
}

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Handle login
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    
    // Fetch user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (userError) {
      setError(userError.message);
      setLoading(false);
      return;
    }
    
    localStorage.setItem('userProfile', JSON.stringify(userData));
    setLoading(false);
    router.push('/');
  };

  // Handle register
  const handleRegister = async (formData: RegisterFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: data.user?.id,
        name: formData.name,
        email: formData.email,
        college: formData.college,
        branch: formData.branch,
        year: formData.year,
        semester: formData.semester,
      },
    ]);
    
    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }
    
    setSuccess('Registration successful! You can now sign in with your credentials.');
    setLoading(false);
    setMode('login');
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