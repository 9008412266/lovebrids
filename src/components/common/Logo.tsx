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
      <Heart size={sizes[size].icon} className="text-primary fill-current" />
      {showText && (
        <span className={`font-bold ${sizes[size].text} text-primary`}>
          Love Birds
        </span>
      )}
    </div>
  );
};

export default Logo;
