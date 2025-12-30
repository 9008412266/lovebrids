import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, User, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Gender } from '@/types';

interface PersonalDetailsProps {
  onSubmit: (data: PersonalDetailsData) => void;
  onBack: () => void;
}

export interface PersonalDetailsData {
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  city: string;
  country: string;
}

const PersonalDetails = ({ onSubmit, onBack }: PersonalDetailsProps) => {
  const [data, setData] = useState<PersonalDetailsData>({
    fullName: '',
    dateOfBirth: '',
    gender: 'male',
    city: '',
    country: '',
  });

  const isValid = data.fullName && data.dateOfBirth && data.city && data.country;

  const handleSubmit = () => {
    if (isValid) {
      onSubmit(data);
    }
  };

  return (
    <div className="flex flex-col min-h-full p-6 animate-fade-in">
      <Button variant="ghost" size="icon" onClick={onBack} className="self-start mb-4">
        <ArrowLeft size={24} />
      </Button>

      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Personal Details</h1>
          <p className="text-muted-foreground">Tell us about yourself</p>
        </div>

        <div className="space-y-4">
          {/* Full Name */}
          <div className="glass-card p-4">
            <label className="text-sm text-muted-foreground mb-2 block">Full Name</label>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <User className="text-muted-foreground" size={20} />
              <Input
                placeholder="Enter your full name"
                value={data.fullName}
                onChange={(e) => setData({ ...data, fullName: e.target.value })}
                className="flex-1 bg-transparent border-0 focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="glass-card p-4">
            <label className="text-sm text-muted-foreground mb-2 block">Date of Birth</label>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <Calendar className="text-muted-foreground" size={20} />
              <Input
                type="date"
                value={data.dateOfBirth}
                onChange={(e) => setData({ ...data, dateOfBirth: e.target.value })}
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-foreground"
              />
            </div>
          </div>

          {/* Gender Selection */}
          <div className="glass-card p-4">
            <label className="text-sm text-muted-foreground mb-3 block">Gender</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setData({ ...data, gender: 'male' })}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  data.gender === 'male'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-secondary text-muted-foreground hover:border-primary/50'
                }`}
              >
                <div className="text-2xl mb-1">👨</div>
                <span className="font-medium">Male</span>
              </button>
              <button
                onClick={() => setData({ ...data, gender: 'female' })}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  data.gender === 'female'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-secondary text-muted-foreground hover:border-primary/50'
                }`}
              >
                <div className="text-2xl mb-1">👩</div>
                <span className="font-medium">Female</span>
              </button>
            </div>
          </div>

          {/* Location */}
          <div className="glass-card p-4 space-y-3">
            <label className="text-sm text-muted-foreground block">Location</label>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <MapPin className="text-muted-foreground" size={20} />
              <Input
                placeholder="City"
                value={data.city}
                onChange={(e) => setData({ ...data, city: e.target.value })}
                className="flex-1 bg-transparent border-0 focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <MapPin className="text-muted-foreground" size={20} />
              <select
                value={data.country}
                onChange={(e) => setData({ ...data, country: e.target.value })}
                className="flex-1 bg-transparent text-foreground outline-none"
              >
                <option value="" className="bg-background">Select Country</option>
                <option value="India" className="bg-background">🇮🇳 India</option>
                <option value="USA" className="bg-background">🇺🇸 United States</option>
                <option value="UK" className="bg-background">🇬🇧 United Kingdom</option>
                <option value="UAE" className="bg-background">🇦🇪 UAE</option>
              </select>
            </div>
          </div>
        </div>

        <Button 
          variant="gradient" 
          size="lg" 
          className="w-full mt-6"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Continue
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default PersonalDetails;
