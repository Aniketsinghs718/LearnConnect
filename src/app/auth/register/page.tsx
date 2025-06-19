"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthLayout from "@/components/layout/AuthLayout";
import RegisterForm from "@/components/forms/RegisterForm";
import Alert from "@/components/ui/Alert";
import PublicRoute from "@/components/auth/PublicRoute";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  college: string;
  branch: string;
  year: string;
  semester: string;
}

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Handle register
  const handleRegister = async (formData: RegisterFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // First, create the auth user with metadata
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            college: formData.college,
            branch: formData.branch,
            year: formData.year,
            semester: formData.semester
          }
        }
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

      // The trigger will automatically create the profile from metadata
      // But let's also manually ensure it's created with all data
      try {
        const { error: insertError } = await supabase.from('users').upsert([
          {
            id: data.user.id,
            name: formData.name,
            email: formData.email,
            college: formData.college,
            branch: formData.branch,
            year: formData.year,
            semester: formData.semester,
          },
        ]);
        
        if (insertError) {
          console.error('Profile creation error:', insertError);
          // Don't fail the registration if profile creation fails
          // The trigger should handle it
        }
      } catch (profileError) {
        console.error('Manual profile creation failed:', profileError);
        // Continue anyway, trigger should handle it
      }
      
      setSuccess('Registration successful! You can now sign in with your credentials.');
      setLoading(false);
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred during registration.');
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join LearnConnect to access your academic resources"
    >
      {error && (
        <Alert type="error" message={error} />
      )}
      
      {success && (
        <Alert type="success" message={success} />
      )}

      <RegisterForm
        onSubmit={handleRegister}
        loading={loading}
        error={error}
        success={success}
      />

      <div className="mt-8 text-center">
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
            onClick={() => router.push('/auth/login')}
          >
            Sign in
          </motion.button>
        </motion.p>
      </div>
    </AuthLayout>
  );
}

function RegisterPageWrapper() {
  return (
    <PublicRoute>
      <RegisterPage />
    </PublicRoute>
  );
}

export default RegisterPageWrapper;