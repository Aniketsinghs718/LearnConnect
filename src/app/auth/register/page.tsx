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
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const router = useRouter();

  // Handle register
  const handleRegister = async (formData: RegisterFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    setShowEmailConfirmation(false);
    
    try {
      // Create the auth user with metadata - the database trigger will handle profile creation
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

      // Check if email confirmation is required
      if (!data.session) {
        setShowEmailConfirmation(true);
        setSuccess('Account created successfully! Please check your email to confirm your account before signing in.');
        setLoading(false);
        
        // Redirect to login page after showing confirmation message
        setTimeout(() => {
          router.push('/auth/login?message=Please check your email and confirm your account to sign in.');
        }, 3000); // 3 seconds to read the message
        return;
      }

      // If user is immediately signed in (no email confirmation required)
      setSuccess('Registration successful! Redirecting to login page...');
      setLoading(false);
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push('/auth/login?message=Registration successful! You can now sign in.');
      }, 1500); // Shorter delay for immediate success
      
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
        showEmailConfirmation={showEmailConfirmation}
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