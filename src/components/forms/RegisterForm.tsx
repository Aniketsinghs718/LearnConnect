// Registration form component
"use client";
import React, { useState, useEffect } from "react";
import { UserPlus, User, Mail, Lock, Building2, GraduationCap, Calendar, BookOpen, Eye, EyeOff, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";
import FormSearch from "../ui/FormSearch";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

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
  "K J Somaiya Institute of Engineering and Information Technology, Sion, Mumbai",
  "Excelsior Education Society's K.C. College of Engineering and Management Studies and Research, Kopri, Thane (E)",
  "S.I.E.S. Graduate School of Technology, Nerul, Navi Mumbai",
  "WATUMULL INSTITUTE OF ELECTRONICS ENGINEERING & COMPUTER TECHNOLOGY, ULHASNAGAR",
  "Xavier Institute Of Engineering C/O Xavier Technical Institute, Mahim, Mumbai",
  "Bhartiya Vidya Bhavan's Sardar Patel Institute of Technology , Andheri, Mumbai",
  "Gharda Foundation's Gharda Institute of Technology,Khed, Ratnagiri",
  "Vighnaharata Trust's Shivajirao S. Jondhale College of Engineering & Technology, Shahapur, Asangaon, Dist Thane",
  "Aldel Education Trust's St. John College of Engineering & Management, Vevoor, Palghar",
  "Koti Vidya Charitable Trust's Smt. Alamuri Ratnamala Institute of Engineering and Technology, Sapgaon, Tal. Shahapur",
  "Yadavrao Tasgaonkar College of Engineering & Management",
  "Vishnu Waman Thakur Charitable Trust's VIVA Institute of Technology, Virar",
  "Haji Jamaluddin Thim Trust's Theem College of Engineering, At. Villege Betegaon, Boisar",
  "Mahatma Education Society's Pillai HOC College of Engineering & Technology, Tal. Khalapur. Dist. Raigad",
  "Leela Education Society, G.V. Acharya Institute of Engineering and Technology, Shelu, Karjat",
  "Vidya Prasarak Mandal's College of Engineering, Thane",
  "Pravin Rohidas Patil College of Engineering & Technology",
  "Bharat College of Engineering, Kanhor, Badlapur(W)",
  "Dilkap Research Institute Of Engineering and Management Studies, At.Mamdapur, Post- Neral, Tal- Karjat, Mumbai",
  "Shree L.R. Tiwari College of Engineering, Mira Road, Mumbai",
  "B.R. Harne College of Engineering & Technology, Karav, Tal-Ambernath.",
  "Anjuman-I-Islam's Kalsekar Technical Campus, Panvel",
  "Metropolitan Institute of Technology & Management, Sukhalwad, Sindhudurg.",
  "Vishwatmak Jangli Maharaj Ashram Trust (Kokamthan), Atma Malik Institute Of Technology & Research",
  "G.M.Vedak Institute of Technology, Tala, Raigad.",
  "Universal College of Engineering,Kaman Dist. Palghar",
  "VPM's Maharshi Parshuram College of Engineering, Velneshwar, Ratnagiri.",
  "Ideal Institute of Technology, Wada, Dist.Thane",
  "Vishwaniketan's Institute of Management Entrepreneurship and Engineering Technology(i MEET), Khalapur Dist Raigad",
  "YASHWANTRAO BHONSALE INSTITUTE OF TECHNOLOGY",
  "New Horizon Institute of Technology & Management, Thane",
  "A. P. Shah Institute of Technology, Thane",
  "Chhartrapati Shivaji Maharaj Institute of Technology, Shedung, Panvel",
  "Indala College Of Engineering, Bapsai Tal.Kalyan",
  "Devi Mahalaxmi College of Engineering and Technology"
];

// Email validation function
const validateEmail = (email: string): { isValid: boolean; message: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }
  
  const allowedDomains = [
    // Popular email providers
    'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'live.com',
    // College domains
    'ltce.in', 'vjti.ac.in', 'spit.ac.in', 'tsec.edu', 'djsce.ac.in',
    'somaiya.edu', 'crce.ac.in', 'siesgst.ac.in', 'rait.ac.in',
    'dmce.ac.in', 'pce.ac.in', 'ternaengg.ac.in', 'ltce.in',
    'shahandanchor.com', 'vomgce.org.in'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (!allowedDomains.includes(domain)) {
    return { 
      isValid: false, 
      message: "Please use an official email from Gmail, Outlook, Yahoo, or your college domain" 
    };
  }
  
  return { isValid: true, message: "" };
};

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
  showEmailConfirmation?: boolean;
}

export default function RegisterForm({ 
  onSubmit, 
  loading, 
  error, 
  success, 
  showEmailConfirmation = false 
}: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '', email: '', password: '', college: '', branch: '', year: '', semester: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailValidation, setEmailValidation] = useState({ isValid: true, message: "" });
  const [redirectCountdown, setRedirectCountdown] = useState(0);

  // Countdown effect for redirect
  useEffect(() => {
    if ((success && showEmailConfirmation) || (success && !showEmailConfirmation)) {
      const initialTime = showEmailConfirmation ? 3 : 2;
      setRedirectCountdown(initialTime);
      
      const countdown = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [success, showEmailConfirmation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before submission
    const emailCheck = validateEmail(formData.email);
    setEmailValidation(emailCheck);
    
    if (!emailCheck.isValid) {
      return;
    }
    
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate email on change
    if (name === 'email') {
      const emailCheck = validateEmail(value);
      setEmailValidation(emailCheck);
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
          <Alert 
            type="success" 
            message={
              redirectCountdown > 0 
                ? `${success} Redirecting to login page in ${redirectCountdown} seconds...`
                : success
            } 
          />
        </motion.div>
      )}
      
      {showEmailConfirmation && (
        <motion.div 
          variants={itemVariants}
          className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start space-x-3"
        >
          <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-blue-400 font-medium text-sm">Email Confirmation Required</h4>
            <p className="text-blue-300/80 text-xs mt-1">
              We've sent a confirmation email to your address. Please check your inbox and click the confirmation link to activate your account.
            </p>
            {redirectCountdown > 0 && (
              <p className="text-blue-300/60 text-xs mt-2">
                Redirecting to login page in {redirectCountdown} seconds...
              </p>
            )}
          </div>
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
        {!emailValidation.isValid && emailValidation.message && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-xs mt-2 flex items-center space-x-1"
          >
            <span>⚠️</span>
            <span>{emailValidation.message}</span>
          </motion.p>
        )}
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
        <FormSearch
          name="college"
          value={formData.college}
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
          disabled={loading || !emailValidation.isValid}
          loading={loading}
          icon={UserPlus}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </motion.div>
    </motion.form>
  );
}
