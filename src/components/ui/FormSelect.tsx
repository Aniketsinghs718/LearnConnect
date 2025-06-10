"use client";
import { useState } from "react";
import { LucideIcon, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormSelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  icon: LucideIcon;
  placeholder: string;
  options: Array<{ value: string; label: string }> | string[];
  required?: boolean;
}

export default function FormSelect({
  name,
  value,
  onChange,
  icon: Icon,
  placeholder,
  options,
  required = false
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue: string) => {
    // Create a synthetic event to maintain compatibility
    const syntheticEvent = {
      target: {
        name,
        value: optionValue
      }
    } as React.ChangeEvent<HTMLSelectElement>;
    
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    
    const option = options.find(opt => 
      typeof opt === 'string' ? opt === value : opt.value === value
    );
    
    return typeof option === 'string' ? option : option?.label || value;
  };

  return (
    <div className="relative">
      {/* Hidden select for form submission */}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="sr-only"
        required={required}
        tabIndex={-1}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>

      {/* Custom dropdown */}
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
        
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`w-full bg-black/50 border border-gray-700/50 hover:border-gray-600 rounded-xl px-12 py-3 text-left text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm ${
            value ? 'text-white' : 'text-gray-400'
          }`}
        >
          <span className="block truncate">{getDisplayValue()}</span>
          <ChevronDown 
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute z-30 w-full mt-2 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl max-h-60 overflow-auto"
            >
              <div className="py-2">
                {options.map((option, index) => {
                  const optionValue = typeof option === 'string' ? option : option.value;
                  const optionLabel = typeof option === 'string' ? option : option.label;
                  const isSelected = value === optionValue;
                  
                  return (
                    <motion.button
                      key={optionValue}
                      type="button"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleSelect(optionValue)}
                      className={`w-full px-4 py-3 text-left hover:bg-purple-500/20 transition-colors duration-200 flex items-center justify-between group ${
                        isSelected ? 'bg-purple-500/30 text-white' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{optionLabel}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-purple-400" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
