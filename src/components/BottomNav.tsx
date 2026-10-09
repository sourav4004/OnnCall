import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TabType } from '../types';
import { AppIcon } from './AppIcon';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadChatCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadChatCount,
}) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'marketplace', label: 'Marketplace', icon: 'wrench' },
    { id: 'bookings', label: 'Bookings', icon: 'calendar' },
    { id: 'inbox', label: 'Inbox', icon: 'chat' },
    { id: 'profile', label: 'Profile', icon: 'user' },
  ];

  return (
    <View style={styles.navContainer}>
      <View style={styles.tabGrid}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
              style={styles.tabButton}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
            >
              <View style={styles.iconWrapper}>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: isActive ? '#111111' : 'transparent',
                    },
                  ]}
                >
                  <AppIcon
                    name={tab.icon}
                    size={20}
                    className={isActive ? 'text-white' : 'text-[#888888]'}
                  />
                </View>
                {tab.id === 'inbox' && unreadChatCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadChatCount}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? '#111111' : '#888888',
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  tabGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: 430,
    alignSelf: 'center',
    width: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    minHeight: 46,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    transitionDuration: '150ms',
  } as any,
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 3,
    letterSpacing: -0.2,
  },
});
