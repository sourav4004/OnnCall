import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import {
  TabType,
  ServiceCategory,
  Professional,
  Booking,
  ChatThread,
  CreateBookingPayload,
} from './types';
import { BottomNav } from './components/BottomNav';
import { BottomSheet } from './components/BottomSheet';
import { AppIcon } from './components/AppIcon';

// Main Screens
import { HomeTab } from './screens/HomeTab';
import { MarketplaceTab } from './screens/MarketplaceTab';
import { BookingsTab } from './screens/BookingsTab';
import { InboxTab } from './screens/InboxTab';
import { ProfileTab } from './screens/ProfileTab';

// Sub Screens
import { CategoryDetailScreen } from './screens/CategoryDetailScreen';
import { ProProfileScreen } from './screens/ProProfileScreen';
import { BookingFlowScreen } from './screens/BookingFlowScreen';
import { BookingDetailScreen } from './screens/BookingDetailScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ProDashboardScreen } from './screens/ProDashboardScreen';
import { DistributorDashboardScreen } from './screens/DistributorDashboardScreen';
import { AuthOnboardingScreen } from './screens/AuthOnboardingScreen';

type ActiveView =
  | { type: 'auth' }
  | { type: 'tabs' }
  | { type: 'category'; category: ServiceCategory }
  | { type: 'pro_profile'; pro: Professional; category?: ServiceCategory }
  | {
      type: 'booking_flow';
      category: ServiceCategory;
      serviceId?: string;
      pro?: Professional;
    }
  | { type: 'booking_detail'; booking: Booking }
  | { type: 'chat'; thread: ChatThread }
  | { type: 'pro_dashboard' }
  | { type: 'distributor_dashboard' };

function MainApp() {
  const {
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
    setCurrentAddress,
    toggleFavoritePro,
    createBooking,
    cancelBooking,
    submitReview,
    sendMessage,
    createAddress,
  } = useApp();

  const [userSession, setUserSession] = useState<import('./types').UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('oncall_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [viewStack, setViewStack] = useState<ActiveView[]>(() => {
    const hasSession = localStorage.getItem('oncall_user_session');
    if (hasSession) {
      try {
        const parsed = JSON.parse(hasSession);
        if (parsed.role === 'provider') return [{ type: 'pro_dashboard' }];
        if (parsed.role === 'distributor') return [{ type: 'distributor_dashboard' }];
      } catch {}
    }
    // Customer Landing Page is our main entry page!
    return [{ type: 'tabs' }];
  });

  const handleAuthComplete = (session: import('./types').UserSession) => {
    setUserSession(session);
    localStorage.setItem('oncall_user_session', JSON.stringify(session));

    // Route screen based on user role
    if (session.role === 'provider') {
      setViewStack([{ type: 'pro_dashboard' }]);
    } else if (session.role === 'distributor') {
      setViewStack([{ type: 'distributor_dashboard' }]);
    } else {
      setViewStack([{ type: 'tabs' }]);
      setActiveTab('home');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('oncall_user_session');
    setUserSession(null);
    setViewStack([{ type: 'tabs' }]);
    setActiveTab('home');
    showToast('Logged out successfully.');
  };

  // Sheets & Modals
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [isNotifsSheetOpen, setIsNotifsSheetOpen] = useState(false);
  const [isEmergencySheetOpen, setIsEmergencySheetOpen] = useState(false);
  const [isSavedProsSheetOpen, setIsSavedProsSheetOpen] = useState(false);
  const [isAddressesSheetOpen, setIsAddressesSheetOpen] = useState(false);
  const [isHelpSheetOpen, setIsHelpSheetOpen] = useState(false);
  const [isSearchSheetOpen, setIsSearchSheetOpen] = useState(false);
  const [searchModalQuery, setSearchModalQuery] = useState('');

  // Add Address Modal
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrLine, setNewAddrLine] = useState('');

  const currentView = viewStack[viewStack.length - 1];

  const pushView = (view: ActiveView) => {
    setViewStack((prev) => [...prev, view]);
  };

  const popView = () => {
    if (viewStack.length > 1) {
      setViewStack((prev) => prev.slice(0, prev.length - 1));
    }
  };

  const handleConfirmBooking = async (newBookingData: Partial<Booking>) => {
    const payload: CreateBookingPayload = {
      catId: newBookingData.catId || 'painter',
      serviceId: newBookingData.serviceId || 'p-room',
      serviceName: newBookingData.serviceName || 'Full Room Painting',
      proId: newBookingData.proId || 'pro-painter-1',
      proName: newBookingData.proName || 'Amit Verma',
      proRole: newBookingData.proRole || 'Master Painter',
      date: newBookingData.date || 'Tomorrow, Oct 9',
      timeSlot: newBookingData.timeSlot || '10:00 AM',
      address: newBookingData.address || currentAddress,
      paymentMethod: newBookingData.paymentMethod || 'upi',
      price: newBookingData.price || 1499,
      platformFee: 20,
    };

    const created = await createBooking(payload);
    if (created) {
      setViewStack([{ type: 'tabs' }, { type: 'booking_detail', booking: created }]);
      setActiveTab('bookings');
    }
  };

  const handleOpenChatWithPro = (proId: string, proName: string, proRole: string) => {
    let thread = chats.find((c) => c.proId === proId);
    if (!thread) {
      thread = {
        proId,
        proName,
        proRole,
        lastMessage: 'Chat started',
        lastTime: 'Just now',
        unreadCount: 0,
        messages: [
          {
            id: `m-init-${Date.now()}`,
            sender: 'pro',
            text: `Hello! I am ${proName}. How can I assist you with your booking?`,
            timestamp: 'Just now',
          },
        ],
      };
    }
    pushView({ type: 'chat', thread });
  };

  const unreadChatsCount = chats.reduce((acc, curr) => acc + curr.unreadCount, 0);
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E5E5E8] flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-[#111111] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5E5E8] flex justify-center items-start sm:py-6 text-[#111111]">
      {/* Mobile Frame Container (Strict 414px - 430px Viewport) */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[880px] bg-white sm:rounded-[40px] shadow-2xl sm:border-[8px] sm:border-[#1C1C1E] flex flex-col overflow-hidden relative">
        {/* Top Status Bar Decorator */}
        <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 bg-white select-none shrink-0 z-30">
          <span className="text-[12px] font-bold tracking-tight">09:41</span>
          <div className="w-20 h-4 bg-black rounded-full" />
          <div className="flex items-center gap-1.5 text-[11px] font-bold">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Dynamic View Router */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {currentView.type === 'auth' && (
            <AuthOnboardingScreen
              onComplete={handleAuthComplete}
              onToast={showToast}
            />
          )}

          {currentView.type === 'tabs' && (
            <>
              {activeTab === 'home' && (
                <HomeTab
                  categories={categories}
                  professionals={professionals}
                  bookings={bookings}
                  savedProIds={savedProIds}
                  userSession={userSession}
                  currentLocationName={currentAddress?.line1?.split(',')[0] || 'Saket, Delhi'}
                  onSelectCategory={(cat) => pushView({ type: 'category', category: cat })}
                  onSelectPro={(pro) =>
                    pushView({
                      type: 'pro_profile',
                      pro,
                      category: categories.find((c) => c.id === pro.catId),
                    })
                  }
                  onBookPro={(pro) =>
                    pushView({
                      type: 'booking_flow',
                      category: categories.find((c) => c.id === pro.catId) || categories[0],
                      pro,
                    })
                  }
                  onSelectBooking={(b) => pushView({ type: 'booking_detail', booking: b })}
                  onBookPackage={(category, serviceId) =>
                    pushView({
                      type: 'booking_flow',
                      category,
                      serviceId,
                    })
                  }
                  onToggleFavorite={toggleFavoritePro}
                  onOpenNotifications={() => setIsNotifsSheetOpen(true)}
                  onOpenLocationPicker={() => setIsLocationSheetOpen(true)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onQuickEmergency={() => setIsEmergencySheetOpen(true)}
                  onSearchClick={() => setIsSearchSheetOpen(true)}
                  onOpenAuth={() => pushView({ type: 'auth' })}
                  onSwitchToProvider={() => {
                    setViewStack([{ type: 'pro_dashboard' }]);
                    showToast('Switched to Service Provider mode');
                  }}
                  unreadNotifsCount={unreadNotifsCount}
                />
              )}

              {activeTab === 'marketplace' && (
                <MarketplaceTab
                  categories={categories}
                  professionals={professionals}
                  savedProIds={savedProIds}
                  onSelectCategory={(cat) => pushView({ type: 'category', category: cat })}
                  onSelectPro={(pro) =>
                    pushView({
                      type: 'pro_profile',
                      pro,
                      category: categories.find((c) => c.id === pro.catId),
                    })
                  }
                  onBookPro={(pro) =>
                    pushView({
                      type: 'booking_flow',
                      category: categories.find((c) => c.id === pro.catId) || categories[0],
                      pro,
                    })
                  }
                  onToggleFavorite={toggleFavoritePro}
                />
              )}

              {activeTab === 'bookings' && (
                <BookingsTab
                  bookings={bookings}
                  onSelectBooking={(b) => pushView({ type: 'booking_detail', booking: b })}
                  onExploreServices={() => setActiveTab('marketplace')}
                  onCallPro={(name) => showToast(`Calling ${name}...`)}
                />
              )}

              {activeTab === 'inbox' && (
                <InboxTab
                  threads={chats}
                  onOpenChat={(thread) => pushView({ type: 'chat', thread })}
                  onExploreServices={() => setActiveTab('marketplace')}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileTab
                  userSession={userSession || undefined}
                  addresses={addresses}
                  onOpenAddresses={() => setIsAddressesSheetOpen(true)}
                  onOpenSavedPros={() => setIsSavedProsSheetOpen(true)}
                  onOpenHelpSupport={() => setIsHelpSheetOpen(true)}
                  onOpenEmergency={() => setIsEmergencySheetOpen(true)}
                  onSwitchToProMode={() => pushView({ type: 'pro_dashboard' })}
                  onOpenPrivacyTerms={(title) => showToast(`Opening ${title}...`)}
                  onToast={showToast}
                  onLogout={handleLogout}
                />
              )}

              <BottomNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                unreadChatCount={unreadChatsCount}
              />
            </>
          )}

          {currentView.type === 'category' && (
            <CategoryDetailScreen
              category={currentView.category}
              professionals={professionals}
              savedProIds={savedProIds}
              onBack={popView}
              onBookService={(cat, svcId) =>
                pushView({ type: 'booking_flow', category: cat, serviceId: svcId })
              }
              onSelectPro={(pro) =>
                pushView({ type: 'pro_profile', pro, category: currentView.category })
              }
              onBookPro={(pro) =>
                pushView({ type: 'booking_flow', category: currentView.category, pro })
              }
              onToggleFavorite={toggleFavoritePro}
            />
          )}

          {currentView.type === 'pro_profile' && (
            <ProProfileScreen
              pro={currentView.pro}
              category={currentView.category}
              isFavorite={savedProIds.includes(currentView.pro.id)}
              onBack={popView}
              onBookNow={(pro) =>
                pushView({
                  type: 'booking_flow',
                  category:
                    currentView.category ||
                    categories.find((c) => c.id === pro.catId) ||
                    categories[0],
                  pro,
                })
              }
              onMessagePro={(pro) =>
                handleOpenChatWithPro(pro.id, pro.name, pro.role)
              }
              onCallPro={(name) => showToast(`Calling ${name}...`)}
              onToggleFavorite={toggleFavoritePro}
            />
          )}

          {currentView.type === 'booking_flow' && (
            <BookingFlowScreen
              category={currentView.category}
              serviceId={currentView.serviceId}
              professional={currentView.pro}
              availablePros={professionals.filter((p) => p.catId === currentView.category.id)}
              addresses={addresses}
              onBack={popView}
              onConfirmBooking={handleConfirmBooking}
              onAddNewAddress={() => setIsAddAddressModalOpen(true)}
            />
          )}

          {currentView.type === 'booking_detail' && (
            <BookingDetailScreen
              booking={currentView.booking}
              onBack={popView}
              onMessagePro={(proId, name, role) => handleOpenChatWithPro(proId, name, role)}
              onCallPro={(name) => showToast(`Calling ${name}...`)}
              onCancelBooking={(bookingId) => {
                cancelBooking(bookingId);
                popView();
              }}
              onRescheduleBooking={() => showToast('Select new slot in calendar')}
              onSubmitReview={(bookingId, rating, note) => {
                submitReview(bookingId, rating, note);
              }}
              onToast={showToast}
            />
          )}

          {currentView.type === 'chat' && (
            <ChatScreen
              thread={currentView.thread}
              onBack={popView}
              onSendMessage={(proId, text) => sendMessage(proId, text)}
              onCallPro={(name) => showToast(`Calling ${name}...`)}
            />
          )}

          {currentView.type === 'pro_dashboard' && (
            <ProDashboardScreen
              userSession={userSession || undefined}
              onExit={() => {
                setViewStack([{ type: 'tabs' }]);
                setActiveTab('home');
              }}
              onLogout={handleLogout}
              onToast={showToast}
            />
          )}

          {currentView.type === 'distributor_dashboard' && (
            <DistributorDashboardScreen
              userSession={
                userSession || {
                  phoneNumber: '+91 98765 43210',
                  fullName: 'Metro Supplies Admin',
                  role: 'distributor',
                  isVerified: true,
                  city: 'New Delhi',
                  avatarInitials: 'MS',
                  businessName: 'Metro Hardware & Paints Wholesale',
                }
              }
              onExit={() => {
                setViewStack([{ type: 'tabs' }]);
                setActiveTab('home');
              }}
              onLogout={handleLogout}
              onToast={showToast}
            />
          )}
        </div>

        {/* Global Toast */}
        {toastMessage && (
          <div className="absolute bottom-20 left-4 right-4 z-50 p-3.5 bg-[#111111] text-white rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
            <AppIcon name="check" size={18} className="text-[#4ADE80] shrink-0" />
            <span className="text-[13px] font-semibold flex-1">{toastMessage}</span>
          </div>
        )}

        {/* BOTTOM SHEETS */}
        {/* Location Sheet */}
        <BottomSheet
          isOpen={isLocationSheetOpen}
          onClose={() => setIsLocationSheetOpen(false)}
          title="Select Service Location"
          subtitle="Showing verified professionals near you"
        >
          <div className="space-y-3">
            <button
              onClick={() => {
                showToast('Using your current GPS location: Saket, Delhi');
                setIsLocationSheetOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-[#F5F5F5] border border-[#E5E5E5] text-left hover:bg-[#EFEFEF] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#111111]">
                <AppIcon name="pin" size={16} />
              </div>
              <div className="flex-1">
                <span className="text-[13.5px] font-bold text-[#111111] block">
                  Use Current Location
                </span>
                <span className="text-[11.5px] text-[#6B6B6B]">GPS: Saket, South Delhi</span>
              </div>
            </button>

            <div className="pt-2">
              <span className="text-[11.5px] font-bold uppercase text-[#888888] tracking-wider block mb-2">
                Saved Places
              </span>
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setCurrentAddress(addr);
                      showToast(`Location switched to ${addr.label}`);
                      setIsLocationSheetOpen(false);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      currentAddress?.id === addr.id
                        ? 'border-[#111111] bg-white ring-1 ring-[#111111]'
                        : 'border-[#E5E5E5] bg-white hover:border-[#CCCCCC]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#F5F5F5] flex items-center justify-center text-[#111111] shrink-0 mt-0.5">
                      <AppIcon name={addr.type === 'home' ? 'home' : 'work'} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[13.5px] font-bold text-[#111111]">{addr.label}</h4>
                        {currentAddress?.id === addr.id && (
                          <span className="text-[11px] font-bold text-[#1E7A34]">Active</span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#6B6B6B] truncate mt-0.5">
                        {addr.line1}, {addr.city}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setIsLocationSheetOpen(false);
                setIsAddAddressModalOpen(true);
              }}
              className="w-full h-11 rounded-xl border border-[#E5E5E5] text-[13px] font-bold text-[#111111] flex items-center justify-center gap-1.5 hover:bg-[#F5F5F5]"
            >
              <AppIcon name="plus" size={15} /> Add New Address
            </button>
          </div>
        </BottomSheet>

        {/* Global Search Sheet */}
        <BottomSheet
          isOpen={isSearchSheetOpen}
          onClose={() => setIsSearchSheetOpen(false)}
          title="Search Services"
        >
          <div className="space-y-4">
            <div className="relative">
              <AppIcon
                name="search"
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]"
              />
              <input
                type="text"
                value={searchModalQuery}
                onChange={(e) => setSearchModalQuery(e.target.value)}
                placeholder="Search painter, carpenter, plumber, ac..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-[14px] text-[#111111] focus:outline-hidden focus:border-[#111111]"
                autoFocus
              />
            </div>

            {searchModalQuery.trim() ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar pt-1">
                {/* Matching Categories */}
                {categories.filter((c) =>
                  c.name.toLowerCase().includes(searchModalQuery.toLowerCase()) ||
                  c.tagline.toLowerCase().includes(searchModalQuery.toLowerCase())
                ).length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider block mb-2">
                      Matching Categories
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {categories
                        .filter((c) =>
                          c.name.toLowerCase().includes(searchModalQuery.toLowerCase()) ||
                          c.tagline.toLowerCase().includes(searchModalQuery.toLowerCase())
                        )
                        .map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setIsSearchSheetOpen(false);
                              pushView({ type: 'category', category: c });
                            }}
                            className="flex items-center gap-2 p-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F9F9F9] text-left"
                          >
                            <div className="w-7 h-7 rounded-lg bg-[#F5F5F5] flex items-center justify-center text-[#111111]">
                              <AppIcon name={c.icon} size={15} />
                            </div>
                            <span className="text-[12.5px] font-bold text-[#111111]">{c.name}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Matching Packages */}
                {(() => {
                  const matchingServices: { category: ServiceCategory; service: import('./types').ServiceItem }[] = [];
                  categories.forEach((cat) => {
                    cat.services.forEach((s) => {
                      if (
                        s.name.toLowerCase().includes(searchModalQuery.toLowerCase()) ||
                        s.desc.toLowerCase().includes(searchModalQuery.toLowerCase())
                      ) {
                        matchingServices.push({ category: cat, service: s });
                      }
                    });
                  });

                  if (matchingServices.length === 0) return null;
                  return (
                    <div>
                      <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider block mb-2">
                        Matching Packages ({matchingServices.length})
                      </span>
                      <div className="space-y-2">
                        {matchingServices.map(({ category, service }) => (
                          <div
                            key={service.id}
                            onClick={() => {
                              setIsSearchSheetOpen(false);
                              pushView({
                                type: 'booking_flow',
                                category,
                                serviceId: service.id,
                              });
                            }}
                            className="p-3 rounded-xl border border-[#E5E5E5] bg-white hover:border-[#111111] cursor-pointer transition-all flex items-center justify-between gap-3 shadow-2xs"
                          >
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                                {category.name}
                              </span>
                              <h4 className="text-[13px] font-bold text-[#111111] truncate">
                                {service.name}
                              </h4>
                              <p className="text-[11px] text-[#666666] line-clamp-1">
                                {service.desc}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[14px] font-black text-[#111111] block">
                                ₹{service.price}
                              </span>
                              <span className="text-[11px] font-bold text-[#1E7A34]">
                                Book Now →
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Matching Professionals */}
                {(() => {
                  const matchingPros = professionals.filter(
                    (p) =>
                      p.name.toLowerCase().includes(searchModalQuery.toLowerCase()) ||
                      p.role.toLowerCase().includes(searchModalQuery.toLowerCase())
                  );
                  if (matchingPros.length === 0) return null;
                  return (
                    <div>
                      <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider block mb-2">
                        Matching Experts ({matchingPros.length})
                      </span>
                      <div className="space-y-2">
                        {matchingPros.map((pro) => (
                          <div
                            key={pro.id}
                            onClick={() => {
                              setIsSearchSheetOpen(false);
                              pushView({
                                type: 'pro_profile',
                                pro,
                                category: categories.find((c) => c.id === pro.catId),
                              });
                            }}
                            className="p-2.5 rounded-xl border border-[#E5E5E5] bg-white hover:border-[#111111] cursor-pointer transition-all flex items-center justify-between gap-2.5 shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] flex items-center justify-center text-[13px] font-bold text-[#111111] shrink-0">
                                {pro.name
                                  .split(' ')
                                  .map((w) => w[0])
                                  .join('')
                                  .slice(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                  <h4 className="text-[13px] font-bold text-[#111111] truncate">
                                    {pro.name}
                                  </h4>
                                  <span className="w-3.5 h-3.5 rounded-full bg-[#1E7A34] text-white flex items-center justify-center text-[8px] font-bold shrink-0">
                                    ✓
                                  </span>
                                </div>
                                <span className="text-[11px] text-[#666666] block truncate">
                                  {pro.role} · ⭐ {pro.rating}
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-[#111111] shrink-0">
                              View Profile →
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <>
                <div>
                  <span className="text-[11.5px] font-bold text-[#888888] uppercase tracking-wider block mb-2">
                    Popular Searches
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Room Painting',
                      'Water Leakage',
                      'Furniture Assembly',
                      'Ceiling Fan',
                      'AC Foam Jet',
                      'Wall Polish',
                    ].map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setIsSearchSheetOpen(false);
                          setActiveTab('marketplace');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-[12px] font-medium text-[#111111] hover:bg-[#EAEAEA]"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11.5px] font-bold text-[#888888] uppercase tracking-wider block mb-2">
                    Categories
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setIsSearchSheetOpen(false);
                          pushView({ type: 'category', category: c });
                        }}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F9F9F9] text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] flex items-center justify-center text-[#111111]">
                          <AppIcon name={c.icon} size={16} />
                        </div>
                        <span className="text-[13px] font-bold text-[#111111]">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </BottomSheet>

        {/* Notifications Sheet */}
        <BottomSheet
          isOpen={isNotifsSheetOpen}
          onClose={() => setIsNotifsSheetOpen(false)}
          title="Notifications"
          subtitle="Updates on your scheduled home services"
        >
          <div className="space-y-2.5">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-3.5 rounded-2xl bg-[#F9F9F9] border border-[#EBEBEB] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-[13.5px] font-bold text-[#111111]">{notif.title}</h4>
                  <span className="text-[11px] text-[#888888]">{notif.timestamp}</span>
                </div>
                <p className="text-[12px] text-[#6B6B6B] leading-relaxed">
                  {notif.description}
                </p>
              </div>
            ))}
          </div>
        </BottomSheet>

        {/* Emergency Assistance Sheet */}
        <BottomSheet
          isOpen={isEmergencySheetOpen}
          onClose={() => setIsEmergencySheetOpen(false)}
          title="Emergency Help Desk"
          subtitle="Priority response within 30 minutes"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#FBEAEA] border border-[#F5C2C2] text-[#C23B3B] space-y-1">
              <h4 className="text-[14px] font-bold">24x7 Urgent Support</h4>
              <p className="text-[12px] leading-relaxed">
                For major pipe bursts, electrical sparking, or severe refrigerant gas leaks, our emergency dispatch units are available round the clock.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  showToast('Connecting to Emergency Plumber Hotline...');
                  setIsEmergencySheetOpen(false);
                }}
                className="w-full h-12 rounded-xl bg-[#111111] text-white text-[13.5px] font-bold flex items-center justify-center gap-2 hover:bg-black"
              >
                <AppIcon name="droplet" size={18} />
                Call Emergency Plumber
              </button>

              <button
                onClick={() => {
                  showToast('Connecting to Emergency Electrician Hotline...');
                  setIsEmergencySheetOpen(false);
                }}
                className="w-full h-12 rounded-xl border border-[#111111] text-[#111111] text-[13.5px] font-bold flex items-center justify-center gap-2 hover:bg-[#F5F5F5]"
              >
                <AppIcon name="zap" size={18} />
                Call Emergency Electrician
              </button>
            </div>
          </div>
        </BottomSheet>

        {/* Saved Pros Sheet */}
        <BottomSheet
          isOpen={isSavedProsSheetOpen}
          onClose={() => setIsSavedProsSheetOpen(false)}
          title="Saved Professionals"
          subtitle="Your favorite technicians for one-tap rebooking"
        >
          <div className="space-y-3">
            {professionals
              .filter((p) => savedProIds.includes(p.id))
              .map((pro) => (
                <div
                  key={pro.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-[#E5E5E5] bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] font-bold text-[#111111] flex items-center justify-center">
                      {pro.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-[13.5px] font-bold text-[#111111]">{pro.name}</h4>
                        {pro.isVerified && (
                          <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-[#E9F6EC] text-[#1E7A34]">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-[11.5px] text-[#6B6B6B]">{pro.role}</p>
                      <span className="text-[11px] text-[#888888] flex items-center gap-1 mt-0.5">
                        <AppIcon name="star" size={12} className="fill-[#EAB308] text-[#EAB308]" />
                        {pro.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsSavedProsSheetOpen(false);
                      pushView({
                        type: 'booking_flow',
                        category:
                          categories.find((c) => c.id === pro.catId) || categories[0],
                        pro,
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#111111] text-white text-[12px] font-bold"
                  >
                    Book
                  </button>
                </div>
              ))}
          </div>
        </BottomSheet>

        {/* Addresses Sheet */}
        <BottomSheet
          isOpen={isAddressesSheetOpen}
          onClose={() => setIsAddressesSheetOpen(false)}
          title="Manage Saved Addresses"
        >
          <div className="space-y-3">
            {addresses.map((a) => (
              <div
                key={a.id}
                className="p-3.5 rounded-2xl border border-[#E5E5E5] bg-white flex items-center justify-between"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] flex items-center justify-center text-[#111111] shrink-0 mt-0.5">
                    <AppIcon name={a.type === 'home' ? 'home' : 'work'} size={16} />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#111111]">{a.label}</h4>
                    <p className="text-[12px] text-[#6B6B6B]">
                      {a.line1}, {a.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                setIsAddressesSheetOpen(false);
                setIsAddAddressModalOpen(true);
              }}
              className="w-full h-11 rounded-xl bg-[#111111] text-white text-[13px] font-bold flex items-center justify-center gap-1.5"
            >
              <AppIcon name="plus" size={16} /> Add Address
            </button>
          </div>
        </BottomSheet>

        {/* Help & Support Sheet */}
        <BottomSheet
          isOpen={isHelpSheetOpen}
          onClose={() => setIsHelpSheetOpen(false)}
          title="Help & Customer Support"
        >
          <div className="space-y-3">
            {[
              {
                q: 'How does the 30-day rework warranty work?',
                a: 'If any paint starts peeling or pipe joints leak within 30 days of service, our technician will visit and resolve it free of charge.',
              },
              {
                q: 'Are materials included in painting and carpentry?',
                a: 'For painting, standard primer and 2 coats of emulsion are included in package prices. Any additional wooden planks or designer wall stencils are billed as requested.',
              },
              {
                q: 'Can I reschedule after booking?',
                a: 'Yes, you can reschedule freely up to 2 hours before the technician arrives from your Bookings tab.',
              },
            ].map((faq, i) => (
              <div key={i} className="p-3 rounded-2xl bg-[#F9F9F9] border border-[#EBEBEB] space-y-1">
                <h4 className="text-[13px] font-bold text-[#111111]">{faq.q}</h4>
                <p className="text-[12px] text-[#6B6B6B] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </BottomSheet>

        {/* Add Address Modal */}
        {isAddAddressModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-5 w-full max-w-sm space-y-4 animate-in zoom-in-95">
              <h3 className="text-[17px] font-bold text-[#111111]">Add New Address</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[12px] font-semibold text-[#6B6B6B] block mb-1">
                    Address Label (e.g. My Studio, Parents' House)
                  </label>
                  <input
                    type="text"
                    value={newAddrLabel}
                    onChange={(e) => setNewAddrLabel(e.target.value)}
                    placeholder="e.g. Vacation Home"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-[13.5px] focus:outline-hidden focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-[#6B6B6B] block mb-1">
                    Street Address & Flat Number
                  </label>
                  <textarea
                    value={newAddrLine}
                    onChange={(e) => setNewAddrLine(e.target.value)}
                    placeholder="Flat 102, Building 4, Vasant Kunj, New Delhi"
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] text-[13.5px] focus:outline-hidden focus:border-[#111111]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setIsAddAddressModalOpen(false)}
                  className="h-11 rounded-xl border border-[#E5E5E5] text-[13px] font-bold text-[#6B6B6B]"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!newAddrLine.trim()) {
                      showToast('Please enter an address');
                      return;
                    }
                    await createAddress({
                      label: newAddrLabel.trim() || 'Other',
                      type: 'other',
                      line1: newAddrLine.trim(),
                      city: 'New Delhi',
                      pincode: '110070',
                    });
                    setIsAddAddressModalOpen(false);
                    setNewAddrLabel('');
                    setNewAddrLine('');
                  }}
                  className="h-11 rounded-xl bg-[#111111] text-white text-[13px] font-bold"
                >
                  Save Address
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
