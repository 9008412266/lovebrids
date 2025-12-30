import { Heart } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo = ({ size = 'md', showText = true }: LogoProps) => {
  const sizes = {
    sm: { icon: 24, text: 'text-xl' },
    md: { icon: 32, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-4xl' },
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 gradient-primary rounded-full blur-lg opacity-50 animate-pulse-slow" />
        <div className="relative gradient-primary p-2 rounded-full">
          <Heart size={sizes[size].icon} className="text-primary-foreground fill-current" />
        </div>
      </div>
      {showText && (
        <span className={`font-bold ${sizes[size].text} text-gradient`}>
          Love Birds
        </span>
      )}
    </div>
  );
};

export default Logo;
