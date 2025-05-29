// Login form component
"use client";
import { useState } from "react";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string;
}

export default function LoginForm({ onSubmit, loading, error }: LoginFormProps) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData.email, formData.password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <motion.div variants={itemVariants}>
          <Alert type="error" message={error} />
        </motion.div>
      )}
      
      <motion.div variants={itemVariants}>
        <FormInput
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          required
        />
      </motion.div>
      
      <motion.div variants={itemVariants} className="relative">
        <FormInput
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          icon={Lock}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-end">
        <button
          type="button"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Forgot password?
        </button>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          disabled={loading}
          loading={loading}
          icon={LogIn}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </motion.div>
    </motion.form>
  );
}
