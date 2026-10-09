export interface ServiceItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  duration: string;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  catId: string;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  distanceKm: number;
  experienceYears: number;
  hourlyRate: number;
  isAvailableToday: boolean;
  locality: string;
  languages: string[];
  isVerified: boolean;
  responseTime: string;
  bio: string;
  skills: string[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  startingPrice: number;
  services: ServiceItem[];
}

export interface Address {
  id: string;
  label: string;
  type: 'home' | 'work' | 'other';
  line1: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Booking {
  id: string;
  catId: string;
  serviceId: string;
  serviceName: string;
  proId: string;
  proName: string;
  proRole: string;
  date: string;
  timeSlot: string;
  address: Address;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  price: number;
  platformFee: number;
  paymentMethod: 'upi' | 'card' | 'cash';
  createdAt: string;
  ratingGiven?: number;
  reviewNote?: string;
  timelineStep: number; // 0..5
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'pro';
  text: string;
  timestamp: string;
}

export interface ChatThread {
  proId: string;
  proName: string;
  proRole: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'booking' | 'alert' | 'system';
}

export type TabType = 'home' | 'marketplace' | 'bookings' | 'inbox' | 'profile';

export type UserRole = 'customer' | 'provider' | 'distributor';

export interface UserSession {
  phoneNumber: string;
  fullName: string;
  role: UserRole;
  isVerified: boolean;
  city: string;
  avatarInitials: string;
  businessName?: string;
  serviceCategory?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface CreateBookingPayload {
  catId: string;
  serviceId: string;
  serviceName: string;
  proId: string;
  proName: string;
  proRole: string;
  date: string;
  timeSlot: string;
  address: Address;
  paymentMethod: 'upi' | 'card' | 'cash';
  price: number;
  platformFee: number;
}
