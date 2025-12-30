import { useState } from 'react';
import PhoneInput from './PhoneInput';
import OTPVerification from './OTPVerification';
import PersonalDetails, { PersonalDetailsData } from './PersonalDetails';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

type RegistrationStep = 'phone' | 'otp' | 'details';

const RegistrationFlow = () => {
  const [step, setStep] = useState<RegistrationStep>('phone');
  const [phone, setPhone] = useState('');
  const { setCurrentRole, setIsAuthenticated, setRegistrationData } = useApp();
  const navigate = useNavigate();

  const handlePhoneSubmit = (phoneNumber: string) => {
    setPhone(phoneNumber);
    setStep('otp');
  };

  const handleOTPVerify = (otp: string) => {
    // Mock verification
    console.log('OTP verified:', otp);
    setStep('details');
  };

  const handleDetailsSubmit = (data: PersonalDetailsData) => {
    setRegistrationData({
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      city: data.city,
      country: data.country,
      phone,
    });

    // Route based on gender
    const role = data.gender === 'male' ? 'caller' : 'host';
    setCurrentRole(role);
    setIsAuthenticated(true);

    if (role === 'caller') {
      navigate('/caller');
    } else {
      navigate('/host/verification');
    }
  };

  return (
    <div className="min-h-[700px]">
      {step === 'phone' && <PhoneInput onSubmit={handlePhoneSubmit} />}
      {step === 'otp' && (
        <OTPVerification
          phone={phone}
          onVerify={handleOTPVerify}
          onBack={() => setStep('phone')}
        />
      )}
      {step === 'details' && (
        <PersonalDetails
          onSubmit={handleDetailsSubmit}
          onBack={() => setStep('otp')}
        />
      )}
    </div>
  );
};

export default RegistrationFlow;
