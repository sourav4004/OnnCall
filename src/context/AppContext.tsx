import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ServiceCategory,
  Professional,
  Booking,
  ChatThread,
  Address,
  AppNotification,
  CreateBookingPayload,
} from '../types';
import { serviceApi } from '../services/api';
import { bugDetector } from '../services/bugDetector';

interface AppContextValue {
  categories: ServiceCategory[];
  professionals: Professional[];
  addresses: Address[];
  currentAddress: Address;
  bookings: Booking[];
  chats: ChatThread[];
  notifications: AppNotification[];
  savedProIds: string[];
  isLoading: boolean;
  toastMessage: string | null;

  showToast: (msg: string) => void;
  setCurrentAddress: (addr: Address) => void;
  toggleFavoritePro: (proId: string) => void;
  createBooking: (payload: CreateBookingPayload) => Promise<Booking | null>;
  cancelBooking: (bookingId: string) => Promise<void>;
  submitReview: (bookingId: string, rating: number, note: string) => Promise<void>;
  sendMessage: (proId: string, text: string) => Promise<void>;
  createAddress: (addr: Omit<Address, 'id'>) => Promise<Address | null>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [currentAddress, setCurrentAddressState] = useState<Address>({
    id: 'default',
    label: 'Home',
    type: 'home',
    line1: 'Saket, New Delhi',
    city: 'New Delhi',
    pincode: '110017',
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [savedProIds, setSavedProIds] = useState<string[]>(['pro-painter-1', 'pro-plumber-1']);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      bugDetector.init();
      const [catsRes, prosRes, addrsRes, booksRes, chatsRes, notifsRes] = await Promise.all([
        serviceApi.getCategories(),
        serviceApi.getProfessionals(),
        serviceApi.getAddresses(),
        serviceApi.getBookings(),
        serviceApi.getChats(),
        serviceApi.getNotifications(),
      ]);

      if (catsRes.success) setCategories(catsRes.data);
      if (prosRes.success) setProfessionals(prosRes.data);
      if (addrsRes.success) {
        setAddresses(addrsRes.data);
        if (addrsRes.data.length > 0) {
          setCurrentAddressState(addrsRes.data[0]);
        }
      }
      if (booksRes.success) setBookings(booksRes.data);
      if (chatsRes.success) setChats(chatsRes.data);
      if (notifsRes.success) setNotifications(notifsRes.data);
    } catch (err: any) {
      console.error('Failed to bootstrap app data:', err);
      bugDetector.reportBug({
        category: 'RUNTIME_EXCEPTION',
        message: 'Failed to bootstrap initial app data: ' + (err.message || String(err)),
        error: { name: err.name, message: err.message, stack: err.stack },
        suggestedFix: 'Verify backend API endpoints are responding and network connectivity is intact.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleFavoritePro = (proId: string) => {
    setSavedProIds((prev) => {
      if (prev.includes(proId)) {
        showToast('Removed from saved professionals');
        return prev.filter((id) => id !== proId);
      } else {
        showToast('Saved to your favorites!');
        return [...prev, proId];
      }
    });
  };

  const createBooking = async (payload: CreateBookingPayload): Promise<Booking | null> => {
    const res = await serviceApi.createBooking(payload);
    if (res.success && res.data) {
      setBookings((prev) => [res.data, ...prev]);
      showToast(`Order Confirmed! ${res.data.id}`);
      return res.data;
    } else {
      showToast(res.message || 'Booking failed');
      return null;
    }
  };

  const cancelBooking = async (bookingId: string) => {
    const res = await serviceApi.cancelBooking(bookingId);
    if (res.success) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
      showToast('Booking cancelled');
    }
  };

  const submitReview = async (bookingId: string, rating: number, note: string) => {
    const res = await serviceApi.submitReview(bookingId, rating, note);
    if (res.success) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, ratingGiven: rating, reviewNote: note } : b
        )
      );
      showToast('Thank you for rating your expert!');
    }
  };

  const sendMessage = async (proId: string, text: string) => {
    // Optimistic UI update
    const optimisticMsg = {
      id: `m-${Date.now()}`,
      sender: 'user' as const,
      text,
      timestamp: 'Just now',
    };

    setChats((prev) => {
      const existing = prev.find((c) => c.proId === proId);
      if (existing) {
        return prev.map((c) =>
          c.proId === proId
            ? {
                ...c,
                lastMessage: text,
                lastTime: 'Just now',
                messages: [...c.messages, optimisticMsg],
              }
            : c
        );
      } else {
        const pro = professionals.find((p) => p.id === proId);
        return [
          {
            proId,
            proName: pro ? pro.name : 'Professional',
            proRole: pro ? pro.role : 'Technician',
            lastMessage: text,
            lastTime: 'Just now',
            unreadCount: 0,
            messages: [optimisticMsg],
          },
          ...prev,
        ];
      }
    });

    await serviceApi.sendMessage(proId, text);

    // Realistic auto-reply simulation in prototyping mode
    setTimeout(() => {
      const reply = {
        id: `m-reply-${Date.now()}`,
        sender: 'pro' as const,
        text: 'Noted! I have all necessary tools and will be on time.',
        timestamp: 'Just now',
      };
      setChats((prev) =>
        prev.map((c) =>
          c.proId === proId
            ? {
                ...c,
                lastMessage: reply.text,
                lastTime: 'Just now',
                messages: [...c.messages, reply],
              }
            : c
        )
      );
    }, 1200);
  };

  const createAddress = async (addr: Omit<Address, 'id'>): Promise<Address | null> => {
    const res = await serviceApi.createAddress(addr);
    if (res.success && res.data) {
      setAddresses((prev) => [res.data, ...prev]);
      setCurrentAddressState(res.data);
      showToast('Address saved!');
      return res.data;
    }
    return null;
  };

  return (
    <AppContext.Provider
      value={{
        categories,
        professionals,
        addresses,
        currentAddress,
        bookings,
        chats,
        notifications,
        savedProIds,
        isLoading,
        toastMessage,
        showToast,
        setCurrentAddress: setCurrentAddressState,
        toggleFavoritePro,
        createBooking,
        cancelBooking,
        submitReview,
        sendMessage,
        createAddress,
        refreshData: loadData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
