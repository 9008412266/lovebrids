-- Create enums for the application
CREATE TYPE public.user_role AS ENUM ('caller', 'host', 'admin');
CREATE TYPE public.user_status AS ENUM ('active', 'blocked', 'pending');
CREATE TYPE public.availability_status AS ENUM ('online', 'busy', 'offline');
CREATE TYPE public.verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.transaction_type AS ENUM ('recharge', 'deduction', 'reward', 'commission', 'gst', 'platform_fee', 'withdrawal');
CREATE TYPE public.session_type AS ENUM ('voice', 'video');
CREATE TYPE public.order_status AS ENUM ('pending', 'completed', 'failed');

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female')),
  city TEXT,
  country TEXT,
  avatar_url TEXT,
  status user_status DEFAULT 'active',
  availability availability_status DEFAULT 'offline',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- KYC/Verification details
CREATE TABLE public.kyc_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  document_type TEXT,
  document_url TEXT,
  selfie_url TEXT,
  verification_status verification_status DEFAULT 'pending',
  rejection_reason TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Wallets table
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance DECIMAL(12,2) DEFAULT 0.00 CHECK (balance >= 0),
  total_recharged DECIMAL(12,2) DEFAULT 0.00,
  total_spent DECIMAL(12,2) DEFAULT 0.00,
  total_earned DECIMAL(12,2) DEFAULT 0.00,
  total_withdrawn DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Wallet transactions
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  transaction_type transaction_type NOT NULL,
  description TEXT,
  reference_id UUID,
  balance_after DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Recharge orders
CREATE TABLE public.recharge_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  base_amount DECIMAL(12,2) NOT NULL,
  platform_fee DECIMAL(12,2) NOT NULL,
  gst_amount DECIMAL(12,2) NOT NULL,
  total_paid DECIMAL(12,2) NOT NULL,
  bonus_percent DECIMAL(5,2) DEFAULT 0,
  bonus_amount DECIMAL(12,2) DEFAULT 0,
  credits_received DECIMAL(12,2) NOT NULL,
  offer_tag TEXT,
  status order_status DEFAULT 'pending',
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Host pricing settings
CREATE TABLE public.host_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  voice_rate_per_minute DECIMAL(8,2) DEFAULT 5.00,
  video_rate_per_minute DECIMAL(8,2) DEFAULT 8.00,
  languages TEXT[] DEFAULT ARRAY['Hindi'],
  category TEXT DEFAULT 'Confidence',
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 4.5,
  total_calls INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Call sessions
CREATE TABLE public.call_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  host_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_type session_type NOT NULL,
  rate_per_minute DECIMAL(8,2) NOT NULL,
  host_rate_per_minute DECIMAL(8,2) NOT NULL,
  admin_rate_per_minute DECIMAL(8,2) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER DEFAULT 0,
  total_cost DECIMAL(12,2) DEFAULT 0,
  host_earnings DECIMAL(12,2) DEFAULT 0,
  admin_commission DECIMAL(12,2) DEFAULT 0,
  status TEXT DEFAULT 'active',
  end_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Admin settlements
CREATE TABLE public.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  bank_account TEXT,
  bank_name TEXT,
  ifsc_code TEXT,
  upi_id TEXT,
  status order_status DEFAULT 'pending',
  settlement_reference TEXT,
  settled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Withdrawal requests (for hosts)
CREATE TABLE public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  bank_account TEXT,
  bank_name TEXT,
  ifsc_code TEXT,
  upi_id TEXT,
  status order_status DEFAULT 'pending',
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recharge_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Function to check if host is verified
CREATE OR REPLACE FUNCTION public.is_host_verified(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.kyc_details
    WHERE user_id = _user_id AND verification_status = 'approved'
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Callers can view verified host profiles"
ON public.profiles FOR SELECT
USING (
  public.has_role(auth.uid(), 'caller') AND 
  gender = 'female' AND 
  public.is_host_verified(user_id)
);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for kyc_details
CREATE POLICY "Users can view their own KYC"
ON public.kyc_details FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KYC"
ON public.kyc_details FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own KYC"
ON public.kyc_details FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all KYC"
ON public.kyc_details FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update KYC status"
ON public.kyc_details FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for wallets
CREATE POLICY "Users can view their own wallet"
ON public.wallets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet"
ON public.wallets FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all wallets"
ON public.wallets FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for wallet_transactions
CREATE POLICY "Users can view their own transactions"
ON public.wallet_transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
ON public.wallet_transactions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for recharge_orders
CREATE POLICY "Users can view their own orders"
ON public.recharge_orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
ON public.recharge_orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
ON public.recharge_orders FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for host_settings
CREATE POLICY "Hosts can view their own settings"
ON public.host_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Hosts can update their own settings"
ON public.host_settings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Hosts can insert their own settings"
ON public.host_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Callers can view verified host settings"
ON public.host_settings FOR SELECT
USING (public.has_role(auth.uid(), 'caller') AND public.is_host_verified(user_id));

CREATE POLICY "Admins can view all host settings"
ON public.host_settings FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for call_sessions
CREATE POLICY "Users can view their own sessions"
ON public.call_sessions FOR SELECT
USING (auth.uid() = caller_id OR auth.uid() = host_id);

CREATE POLICY "Admins can view all sessions"
ON public.call_sessions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for settlements
CREATE POLICY "Admins can manage settlements"
ON public.settlements FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for withdrawal_requests
CREATE POLICY "Hosts can view their own withdrawals"
ON public.withdrawal_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Hosts can create withdrawal requests"
ON public.withdrawal_requests FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'host'));

CREATE POLICY "Admins can manage all withdrawals"
ON public.withdrawal_requests FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger function to create wallet and assign role on profile creation
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role_value user_role;
BEGIN
  -- Determine role based on gender
  IF NEW.gender = 'male' THEN
    user_role_value := 'caller';
  ELSIF NEW.gender = 'female' THEN
    user_role_value := 'host';
  ELSE
    user_role_value := 'caller';
  END IF;

  -- Create user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, user_role_value);

  -- Create wallet
  INSERT INTO public.wallets (user_id)
  VALUES (NEW.user_id);

  -- Create host settings if host
  IF user_role_value = 'host' THEN
    INSERT INTO public.host_settings (user_id)
    VALUES (NEW.user_id);
    
    -- Create pending KYC record
    INSERT INTO public.kyc_details (user_id)
    VALUES (NEW.user_id);
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger for new profile
CREATE TRIGGER on_profile_created
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_profile();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update timestamp triggers
CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_wallets_timestamp
BEFORE UPDATE ON public.wallets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_kyc_timestamp
BEFORE UPDATE ON public.kyc_details
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_host_settings_timestamp
BEFORE UPDATE ON public.host_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Enable realtime for availability status updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;