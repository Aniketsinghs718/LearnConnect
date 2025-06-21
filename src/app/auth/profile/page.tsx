"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { User, Mail, Building2, GraduationCap, Calendar, BookOpen, Save, LogOut, Lock, Eye, EyeOff, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import FormSearch from "@/components/ui/FormSearch";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

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

const colleges = [
  "Veermata Jijabai Technological Institut (VJTI), Matunga, Mumbai",
  "Sardar Patel College of Engineering, Andheri",
  "Svkm's Shri Bhagubhai Mafatlal Polytechnic & College of Engineering",
  "Dr. Babasaheb Ambedkar Technological University, Lonere",
  "Usha Mittal Institute of Technology SNDT Women's University, Mumbai",
  "Institute of Chemical Technology, Matunga, Mumbai",
  "Manjara Charitable Trust's Rajiv Gandhi Institute of Technology, Mumbai",
  "Vidyalankar Institute of Technology, Wadala, Mumbai",
  "Thakur Shyamnarayan Engineering College, Mumbai",
  "Jawahar Education Society's Annasaheb Chudaman Patil College of Engineering,Kharghar, Navi Mumbai",
  "Saraswati Education Society, Yadavrao Tasgaonkar Institute of Engineering & Technology, Karjat",
  "Mahavir Education Trust's Shah & Anchor Kutchhi Engineering College, Mumbai",
  "Saraswati Education Society's Saraswati College of Engineering,Kharghar Navi Mumbai",
  "M.G.M.'s College of Engineering and Technology, Kamothe, Navi Mumbai",
  "Thakur College of Engineering and Technology, Kandivali, Mumbai",
  "Thadomal Shahani Engineering College, Bandra, Mumbai",
  "Anjuman-I-Islam's M.H. Saboo Siddik College of Engineering, Byculla, Mumbai",
  "Fr. Conceicao Rodrigues College of Engineering, Bandra,Mumbai",
  "Vivekanand Education Society's Institute of Technology, Chembur, Mumbai",
  "N.Y.S.S.'s Datta Meghe College of Engineering, Airoli, Navi Mumbai",
  "Padmabhushan Vasantdada Patil Pratishthans College of Engineering, Sion,Mumbai",
  "Bharati Vidyapeeth College of Engineering, Navi Mumbai",
  "Terna Engineering College, Nerul, Navi Mumbai",
  "Smt. Indira Gandhi College of Engineering, Navi Mumbai",
  "Shivajirao S. Jondhale College of Engineering, Dombivali,Mumbai",
  "Vidyavardhini's College of Engineering and Technology, Vasai",
  "Lokmanya Tilak College of Engineering, Kopar Khairane, Navi Mumbai",
  "Agnel Charities' FR. C. Rodrigues Institute of Technology, Vashi, Navi Mumbai",
  "Konkan Gyanpeeth College of Engineering, Karjat",
  "Shri Vile Parle Kelvani Mandal's Dwarkadas J. Sanghvi College of Engineering, Vile Parle,Mumbai",
  "Hope Foundation and research center's Finolex Academy of Management and Technology, Ratnagiri",
  "Rizvi Education Society's Rizvi College of Engineering, Bandra,Mumbai",
  "Rajendra Mane College of Engineering & Technology Ambav Deorukh",
  "Atharva College of Engineering,Malad(West),Mumbai",
  "St. Francis Institute of Technology,Borivali, Mumbai",
  "S.S.P.M.'s College of Engineering, Kankavli",
  "Mahatma Education Society's Pillai College of Engineering, New Panvel",
  "Don Bosco Institute of Technology, Mumbai",
  "Bharatiya Vidya Bhavan's Sardar Patel Institute of Technology, Andheri",
  "A.C. Patil College of Engineering, Navi Mumbai",
  "Anjuman-I-Islam's Kalsekar Technical Campus, New Panvel",
  "Bharati Vidyapeeth's College of Engineering, Navi Mumbai",
  "D.J. Sanghvi College of Engineering, Vile Parle",
  "G.H. Raisoni College of Engineering and Management, Pune",
  "ICPE - Institute of Chemical Technology, Mumbai",
  "Indira Gandhi Institute of Development & Research, Mumbai",
  "Jhulelal Institute of Technology, Nagpur",
  "K.C. College of Engineering, Thane",
  "L.S. Raheja College of Engineering, Bandra",
  "M.H. Saboo Siddik College of Engineering, Mumbai",
  "Mukesh Patel School of Technology Management & Engineering, Mumbai",
  "N.B. Navale Sinhgad College of Engineering, Pune",
  "Oriental Institute of Science & Technology, Bhopal",
  "P.E.S. Modern College of Engineering, Pune",
  "Rajiv Gandhi Institute of Technology, Mumbai",
  "Sinhgad College of Engineering, Pune",
  "Symbiosis Institute of Technology, Pune",
  "Theem College of Engineering, Boisar",
  "Universal College of Engineering, Vasai",
  "Vivekanand Education Society's Institute of Technology, Mumbai",
  "Watumull Institute of Electronics Engineering & Computer Technology, Mumbai",
  "Xavier Institute of Engineering, Mumbai",
  "Yashwantrao Chavan College of Engineering, Nagpur",
  "Zeal College of Engineering & Research, Pune",
  "Other"
];

function ProfilePage() {
  const { profile: userProfile } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const router = useRouter();

  useEffect(() => {
    if (userProfile) {
      setProfile(userProfile);
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate phone number (should be 10 digits)
    if (profile.phone && !/^\d{10}$/.test(profile.phone)) {
      setError("Phone number must be exactly 10 digits");
      setLoading(false);
      return;
    }
    
    const { error: updateError } = await supabase
      .from("users")
      .update({
        name: profile.name,
        college: profile.college,
        branch: profile.branch,
        year: profile.year,
        semester: profile.semester,
        phone: profile.phone || "",
      })
      .eq("id", profile.id);
      
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setSuccess("Profile updated successfully!");
    setLoading(false);
  };

  const handlePasswordUpdateClick = () => {
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    handlePasswordUpdate(fakeEvent);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPassword
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess("Password updated successfully!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      // Clear all localStorage data
      localStorage.removeItem("userProfile");
      localStorage.removeItem("selectedBranch");
      localStorage.removeItem("selectedYear");
      localStorage.removeItem("selectedSemester");
      localStorage.removeItem("marketplace_cache_v3");
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Force redirect to homepage
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      window.location.href = '/';
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">No profile found</h2>
          <p className="text-gray-400">Please log in to access your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout
      title="Your Profile"
      subtitle="Update your academic information and preferences"
    >
      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-6 right-6 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/80 hover:text-white bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-full border border-red-500/20 backdrop-blur-sm transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
      </motion.div>

      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleUpdate}
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
            value={profile.name || ""}
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
            value={profile.email || ""}
            onChange={() => {}} // No-op since it's disabled
            icon={Mail}
            disabled
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormInput
            name="phone"
            type="tel"
            placeholder="Phone Number (10 digits)"
            value={profile.phone || ""}
            onChange={handleChange}
            icon={Phone}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormSearch
            name="college"
            value={profile.college || ""}
            onChange={handleChange}
            icon={Building2}
            placeholder="Select your college"
            options={colleges}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormSelect
            name="branch"
            value={profile.branch || ""}
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
            value={profile.year || ""}
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
            value={profile.semester || ""}
            onChange={handleChange}
            icon={BookOpen}
            placeholder="Choose your semester"
            options={semesters}
            required
          />
        </motion.div>

        {/* Password Change Section */}
        <motion.div variants={itemVariants} className="pt-6">
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Change Password
          </motion.h3>
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <FormInput
            name="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            icon={Lock}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-20"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <FormInput
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            icon={Lock}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-20"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-2 space-y-3">
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            icon={Save}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
          
          {(passwordData.newPassword || passwordData.confirmPassword) && (
            <Button
              type="button"
              onClick={handlePasswordUpdateClick}
              disabled={loading || !passwordData.newPassword || !passwordData.confirmPassword}
              loading={loading}
              icon={Lock}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? "Updating Password..." : "Update Password"}
            </Button>
          )}
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
}

function ProfilePageWrapper() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}

export default ProfilePageWrapper;