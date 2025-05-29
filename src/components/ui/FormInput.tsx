"use client";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FormInputProps {
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function FormInput({
  name,
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  required = false,
  disabled = false,
  className = ""
}: FormInputProps) {
  return (
    <div className={`relative group ${className}`}>
      <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 z-10 ${
        disabled ? 'text-gray-500' : 'text-gray-400 group-focus-within:text-purple-400'
      }`} />
      <motion.input
        whileFocus={disabled ? {} : { scale: 1.02 }}
        transition={{ duration: 0.2 }}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border rounded-xl px-12 py-3 text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm ${
          disabled 
            ? 'bg-black/30 border-gray-700/30 cursor-not-allowed opacity-60' 
            : 'bg-black/50 border-gray-700/50 hover:border-gray-600 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20'
        }`}
        required={required}
      />
      {!disabled && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      )}
    </div>
  );
}
