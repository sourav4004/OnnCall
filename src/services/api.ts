import { apiClient, USE_MOCK_API } from './apiClient';
import {
  ServiceCategory,
  Professional,
  Booking,
  ChatThread,
  Address,
  AppNotification,
  ApiResponse,
  CreateBookingPayload,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PROFESSIONALS,
  INITIAL_ADDRESSES,
  INITIAL_BOOKINGS,
  INITIAL_CHATS,
  INITIAL_NOTIFICATIONS,
} from '../mockData';

// In-Memory / LocalStorage Mock Store for reliable client-side state
class MockStore {
  private getStorage<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(`oncall_mock_${key}`);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private setStorage<T>(key: string, val: T): void {
    try {
      localStorage.setItem(`oncall_mock_${key}`, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }

  getCategories(): ServiceCategory[] {
    return this.getStorage('categories', INITIAL_CATEGORIES);
  }

  getProfessionals(): Professional[] {
    return this.getStorage('professionals', INITIAL_PROFESSIONALS);
  }

  getAddresses(): Address[] {
    return this.getStorage('addresses', INITIAL_ADDRESSES);
  }

  saveAddress(newAddr: Address): Address[] {
    const list = [newAddr, ...this.getAddresses()];
    this.setStorage('addresses', list);
    return list;
  }

  getBookings(): Booking[] {
    return this.getStorage('bookings', INITIAL_BOOKINGS);
  }

  addBooking(booking: Booking): Booking[] {
    const list = [booking, ...this.getBookings()];
    this.setStorage('bookings', list);
    return list;
  }

  updateBooking(id: string, patch: Partial<Booking>): Booking[] {
    const list = this.getBookings().map((b) => (b.id === id ? { ...b, ...patch } : b));
    this.setStorage('bookings', list);
    return list;
  }

  getChats(): ChatThread[] {
    return this.getStorage('chats', INITIAL_CHATS);
  }

  saveChats(chats: ChatThread[]): void {
    this.setStorage('chats', chats);
  }

  getNotifications(): AppNotification[] {
    return this.getStorage('notifications', INITIAL_NOTIFICATIONS);
  }

  addNotification(notif: AppNotification): AppNotification[] {
    const list = [notif, ...this.getNotifications()];
    this.setStorage('notifications', list);
    return list;
  }
}

const mockStore = new MockStore();

// Artificial delay helper for realistic network simulation in mock mode
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const serviceApi = {
  // 1. Categories
  async getCategories(): Promise<ApiResponse<ServiceCategory[]>> {
    if (USE_MOCK_API) {
      await delay(120);
      return { success: true, data: mockStore.getCategories() };
    }
    return apiClient.get<ServiceCategory[]>('/categories');
  },

  // 2. Professionals
  async getProfessionals(categoryId?: string): Promise<ApiResponse<Professional[]>> {
    if (USE_MOCK_API) {
      await delay(150);
      let pros = mockStore.getProfessionals();
      if (categoryId && categoryId !== 'all') {
        pros = pros.filter((p) => p.catId === categoryId);
      }
      return { success: true, data: pros };
    }
    const query = categoryId ? `?category=${encodeURIComponent(categoryId)}` : '';
    return apiClient.get<Professional[]>(`/professionals${query}`);
  },

  // 3. Addresses
  async getAddresses(): Promise<ApiResponse<Address[]>> {
    if (USE_MOCK_API) {
      await delay(80);
      return { success: true, data: mockStore.getAddresses() };
    }
    return apiClient.get<Address[]>('/addresses');
  },

  async createAddress(address: Omit<Address, 'id'>): Promise<ApiResponse<Address>> {
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    if (USE_MOCK_API) {
      await delay(150);
      mockStore.saveAddress(newAddress);
      return { success: true, data: newAddress };
    }
    return apiClient.post<Address>('/addresses', address);
  },

  // 4. Bookings
  async getBookings(): Promise<ApiResponse<Booking[]>> {
    if (USE_MOCK_API) {
      await delay(150);
      return { success: true, data: mockStore.getBookings() };
    }
    return apiClient.get<Booking[]>('/bookings');
  },

  async createBooking(payload: CreateBookingPayload): Promise<ApiResponse<Booking>> {
    const bookingId = `OC-${Math.floor(10000 + Math.random() * 89999)}`;
    const newBooking: Booking = {
      ...payload,
      id: bookingId,
      status: 'confirmed',
      createdAt: 'Just now',
      timelineStep: 1,
    };

    if (USE_MOCK_API) {
      await delay(250);
      mockStore.addBooking(newBooking);

      // Create notification
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: 'Booking Confirmed!',
        description: `${newBooking.serviceName} with ${newBooking.proName} confirmed for ${newBooking.date}.`,
        timestamp: 'Just now',
        read: false,
        type: 'booking',
      };
      mockStore.addNotification(notif);

      return {
        success: true,
        data: newBooking,
        message: 'Booking created successfully',
      };
    }

    return apiClient.post<Booking>('/bookings', payload);
  },

  async cancelBooking(bookingId: string, reason = 'Customer request'): Promise<ApiResponse<Booking>> {
    if (USE_MOCK_API) {
      await delay(150);
      mockStore.updateBooking(bookingId, { status: 'cancelled' });
      const updated = mockStore.getBookings().find((b) => b.id === bookingId)!;
      return { success: true, data: updated, message: 'Booking cancelled' };
    }
    return apiClient.patch<Booking>(`/bookings/${bookingId}/cancel`, { reason });
  },

  async submitReview(bookingId: string, rating: number, note: string): Promise<ApiResponse<Booking>> {
    if (USE_MOCK_API) {
      await delay(150);
      mockStore.updateBooking(bookingId, { ratingGiven: rating, reviewNote: note });
      const updated = mockStore.getBookings().find((b) => b.id === bookingId)!;
      return { success: true, data: updated, message: 'Review recorded' };
    }
    return apiClient.post<Booking>(`/bookings/${bookingId}/reviews`, { rating, note });
  },

  // 5. Messaging & Chats
  async getChats(): Promise<ApiResponse<ChatThread[]>> {
    if (USE_MOCK_API) {
      await delay(100);
      return { success: true, data: mockStore.getChats() };
    }
    return apiClient.get<ChatThread[]>('/chats');
  },

  async sendMessage(proId: string, text: string): Promise<ApiResponse<ChatThread>> {
    if (USE_MOCK_API) {
      await delay(80);
      const chats = mockStore.getChats();
      const existing = chats.find((c) => c.proId === proId);
      const newMsg = {
        id: `m-${Date.now()}`,
        sender: 'user' as const,
        text,
        timestamp: 'Just now',
      };

      let updatedThread: ChatThread;
      if (existing) {
        updatedThread = {
          ...existing,
          lastMessage: text,
          lastTime: 'Just now',
          messages: [...existing.messages, newMsg],
        };
      } else {
        const pro = mockStore.getProfessionals().find((p) => p.id === proId);
        updatedThread = {
          proId,
          proName: pro ? pro.name : 'Professional',
          proRole: pro ? pro.role : 'Technician',
          lastMessage: text,
          lastTime: 'Just now',
          unreadCount: 0,
          messages: [newMsg],
        };
      }

      const updatedList = chats.some((c) => c.proId === proId)
        ? chats.map((c) => (c.proId === proId ? updatedThread : c))
        : [updatedThread, ...chats];

      mockStore.saveChats(updatedList);
      return { success: true, data: updatedThread };
    }
    return apiClient.post<ChatThread>(`/chats/${proId}/messages`, { text });
  },

  // 6. Notifications
  async getNotifications(): Promise<ApiResponse<AppNotification[]>> {
    if (USE_MOCK_API) {
      await delay(100);
      return { success: true, data: mockStore.getNotifications() };
    }
    return apiClient.get<AppNotification[]>('/notifications');
  },
};
