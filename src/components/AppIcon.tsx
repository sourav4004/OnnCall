import React from 'react';
import {
  Paintbrush,
  Hammer,
  Droplet,
  Zap,
  Wrench,
  Sparkles,
  Shield,
  Scissors,
  HelpCircle,
  Home,
  Briefcase,
  MapPin,
  Star,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  X,
  Plus,
  Send,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone,
  AlertTriangle,
  Heart,
  LogOut,
  User,
  Share2,
  Bell,
  Check,
  Flame,
  BadgeCheck,
  RefreshCw,
  Navigation,
  FileText,
  Truck,
  Store,
  Package,
  Camera,
  Upload
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const AppIcon: React.FC<IconProps> = ({ name, className = '', size = 20 }) => {
  switch (name) {
    case 'paint':
      return <Paintbrush size={size} className={className} />;
    case 'hammer':
      return <Hammer size={size} className={className} />;
    case 'droplet':
      return <Droplet size={size} className={className} />;
    case 'zap':
      return <Zap size={size} className={className} />;
    case 'wrench':
      return <Wrench size={size} className={className} />;
    case 'sparkles':
      return <Sparkles size={size} className={className} />;
    case 'shield':
      return <Shield size={size} className={className} />;
    case 'scissors':
      return <Scissors size={size} className={className} />;
    case 'home':
      return <Home size={size} className={className} />;
    case 'work':
    case 'briefcase':
      return <Briefcase size={size} className={className} />;
    case 'pin':
      return <MapPin size={size} className={className} />;
    case 'star':
      return <Star size={size} className={className} />;
    case 'clock':
      return <Clock size={size} className={className} />;
    case 'phone':
      return <Phone size={size} className={className} />;
    case 'chat':
    case 'message':
      return <MessageSquare size={size} className={className} />;
    case 'check':
      return <Check size={size} className={className} />;
    case 'check-circle':
      return <CheckCircle2 size={size} className={className} />;
    case 'chevron-right':
      return <ChevronRight size={size} className={className} />;
    case 'chevron-left':
      return <ChevronLeft size={size} className={className} />;
    case 'arrow-left':
      return <ArrowLeft size={size} className={className} />;
    case 'search':
      return <Search size={size} className={className} />;
    case 'filter':
      return <SlidersHorizontal size={size} className={className} />;
    case 'close':
    case 'x':
      return <X size={size} className={className} />;
    case 'plus':
      return <Plus size={size} className={className} />;
    case 'send':
      return <Send size={size} className={className} />;
    case 'calendar':
      return <Calendar size={size} className={className} />;
    case 'card':
      return <CreditCard size={size} className={className} />;
    case 'cash':
      return <Banknote size={size} className={className} />;
    case 'upi':
      return <Smartphone size={size} className={className} />;
    case 'alert':
      return <AlertTriangle size={size} className={className} />;
    case 'heart':
      return <Heart size={size} className={className} />;
    case 'logout':
      return <LogOut size={size} className={className} />;
    case 'user':
      return <User size={size} className={className} />;
    case 'bell':
      return <Bell size={size} className={className} />;
    case 'share':
      return <Share2 size={size} className={className} />;
    case 'flame':
      return <Flame size={size} className={className} />;
    case 'badge-check':
      return <BadgeCheck size={size} className={className} />;
    case 'refresh':
      return <RefreshCw size={size} className={className} />;
    case 'navigate':
      return <Navigation size={size} className={className} />;
    case 'file':
      return <FileText size={size} className={className} />;
    case 'truck':
      return <Truck size={size} className={className} />;
    case 'store':
      return <Store size={size} className={className} />;
    case 'package':
      return <Package size={size} className={className} />;
    case 'camera':
      return <Camera size={size} className={className} />;
    case 'upload':
      return <Upload size={size} className={className} />;
    default:
      return <HelpCircle size={size} className={className} />;
  }
};
