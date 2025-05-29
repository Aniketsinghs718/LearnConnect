// Registration form component
"use client";
import { useState } from "react";
import { UserPlus, User, Mail, Lock, Building2, GraduationCap, Calendar, BookOpen, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const colleges = [
  "IIT Bombay",
  "Veermata Jijabai Technological Institute (VJTI)",
  "Sardar Patel Institute of Technology (SPIT)",
  "Thadomal Shahani Engineering College (TSEC)",
  "Dwarkadas J. Sanghvi College of Engineering (DJSCE)",
  "K. J. Somaiya College of Engineering (KJSCE)",
  "Fr. Conceicao Rodrigues College of Engineering (CRCE)",
  "SIES Graduate School of Technology",
  "Ramrao Adik Institute of Technology (RAIT)",
  "Datta Meghe College of Engineering",
  "Pillai College of Engineering",
  "Terna Engineering College",
  "Lokmanya Tilak College of Engineering",
  "Shah & Anchor Kutchhi Engineering College",
  "Vishwatmak Om Gurudev College of Engineering",
];

const branches = [
  { value: "comps", label: "Computer Science" },
  { value: "mech", label: "Mechanical Engineering" },
  { value: "excp", label: "Electronics & Computer Engineering" },
  { value: "it", label: "Information Technology" },
  { value: "extc", label: "Electronics & Telecommunication Engineering" },
  { value: "rai", label: "Robotics & Automation Engineering" },
  { value: "cce", label: "Computer and Communication Engineering" },
  { value: "csbs", label: "Computer Science and Business Systems" },
  { value: "aids", label: "Artificial Intelligence and Data Science" },
];

const years = [
  { value: "fy", label: "First Year" },
  { value: "sy", label: "Second Year" },
  { value: "ty", label: "Third Year" },
  { value: "ly", label: "Fourth Year" },
];

const semesters = [
  { value: "odd", label: "Odd Semester" },
  { value: "even", label: "Even Semester" },
];

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  college: string;
  branch: string;
  year: string;
  semester: string;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  loading: boolean;
  error: string;
  success: string;
}

export default function RegisterForm({ onSubmit, loading, error, success }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '', email: '', password: '', college: '', branch: '', year: '', semester: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        staggerChildren: 0.08,
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
      className="space-y-4"
    >
      {error && (
        <motion.div variants={itemVariants}>
          <Alert type="error" message={error} />
        </motion.div>
      )}
      {success && (
        <motion.div variants={itemVariants}>
          <Alert type="success" message={success} />
        </motion.div>
      )}
      
      <motion.div variants={itemVariants}>
        <FormInput
          name="name"
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          icon={User}
          required
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <FormInput
          name="email"
          type="email"
          placeholder="Email Address"
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
          placeholder="Create Password"
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
      
      <motion.div variants={itemVariants}>
        <FormSelect
          name="college"
          value={formData.college}
          onChange={handleChange}
          icon={Building2}
          placeholder="Choose your college"
          options={colleges}
          required
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <FormSelect
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          icon={GraduationCap}
          placeholder="Choose your branch"
          options={branches}
          required
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <FormSelect
          name="year"
          value={formData.year}
          onChange={handleChange}
          icon={Calendar}
          placeholder="Choose your year"
          options={years}
          required
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <FormSelect
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          icon={BookOpen}
          placeholder="Choose your semester"
          options={semesters}
          required
        />
      </motion.div>
      
      <motion.div variants={itemVariants} className="pt-2">
        <Button
          type="submit"
          disabled={loading}
          loading={loading}
          icon={UserPlus}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </motion.div>
    </motion.form>
  );
}
