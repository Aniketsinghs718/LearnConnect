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
    // Optionally redirect to login page after successful registration
    setTimeout(() => {
      router.push('/auth/login');
    }, 2000);
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