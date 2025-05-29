// Card component for consistent layouts
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'md'
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-lg',
    lg: 'shadow-xl'
  };

  return (
    <div className={`bg-base-100 rounded-lg border border-border ${paddingClasses[padding]} ${shadowClasses[shadow]} ${className}`}>
      {children}
    </div>
  );
}
