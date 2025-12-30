// @/types/profile.ts
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  user_metadata?: {
    avatar_url?: string;
  };
}

export interface ProfileData {
  id: string;
  available_points: number;
  username: string;
  rank: string;
  cashback_percentage: number;
  referral_code?: string;
  avatar_url?: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  address: string;
  created_at: string;
  items?: OrderItem[];
  order_items?: any[];
}

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image?: string;
  created_at: string;
}

export interface BonusHistory {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  order_id?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  old_price?: number;
  image: string;
  category: string;
  description?: string;
  in_stock: boolean;
  rating?: number;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  favoriteCategory: string;
  averageOrder: number;
  completedOrders: number;
  canceledOrders: number;
}

export interface ReferralStats {
  totalReferrals: number;
  earnedFromReferrals: number;
  pendingReferrals: number;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  progress: number;
  unlocked_at?: string;
}

export interface Address {
  id: string;
  title: string;
  full_name: string;
  phone: string;
  city: string;
  street: string;
  building: string;
  apartment?: string;
  postal_code?: string;
  is_default: boolean;
  created_at: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  last_four: string;
  is_default: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  plan: string;
  status: string;
  ends_at: string;
}