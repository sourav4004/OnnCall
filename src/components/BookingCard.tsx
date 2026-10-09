import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Booking } from '../types';
import { AppIcon } from './AppIcon';

interface BookingCardProps {
  booking: Booking;
  onClick: (booking: Booking) => void;
  onCallPro?: (proName: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onClick,
  onCallPro,
}) => {
  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'in_progress':
        return {
          label: 'In Progress',
          textColor: '#1E7A34',
          bgColor: '#E9F6EC',
          borderColor: 'rgba(30, 122, 52, 0.25)',
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          textColor: '#1E7A34',
          bgColor: '#E9F6EC',
          borderColor: 'rgba(30, 122, 52, 0.25)',
        };
      case 'completed':
        return {
          label: 'Completed',
          textColor: '#555555',
          bgColor: '#EFEFEF',
          borderColor: '#E0E0E0',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          textColor: '#C23B3B',
          bgColor: '#FBEAEA',
          borderColor: 'rgba(194, 59, 59, 0.25)',
        };
    }
  };

  const badge = getStatusBadge(booking.status);
  const addressText = typeof booking.address === 'string'
    ? booking.address
    : `${booking.address.line1}, ${booking.address.city}`;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onClick(booking)}
      style={styles.card}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.bookingId}>{booking.id}</Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: badge.bgColor,
              borderColor: badge.borderColor,
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: badge.textColor }]}>
            {badge.label}
          </Text>
        </View>
      </View>

      {/* Main Info */}
      <Text style={styles.serviceName} numberOfLines={1}>
        {booking.serviceName}
      </Text>
      <Text style={styles.proName} numberOfLines={1}>
        Assigned Pro: {booking.proName}
      </Text>

      {/* Details Row */}
      <View style={styles.metaContainer}>
        <View style={styles.metaRow}>
          <AppIcon name="calendar" size={13} className="text-[#6B7280]" />
          <Text style={styles.metaText}>
            {booking.date} · {booking.timeSlot}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <AppIcon name="pin" size={13} className="text-[#6B7280]" />
          <Text style={styles.metaText} numberOfLines={1}>
            {addressText}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footerRow}>
        <View>
          <Text style={styles.amountLabel}>Total Bill</Text>
          <Text style={styles.amountText}>₹{booking.price + booking.platformFee}</Text>
        </View>

        {onCallPro && booking.status !== 'cancelled' && (
          <TouchableOpacity
            style={styles.callButton}
            onPress={(e) => {
              e.stopPropagation?.();
              onCallPro(booking.proName);
            }}
          >
            <AppIcon name="phone" size={13} className="text-[#111111]" />
            <Text style={styles.callButtonText}>Contact Pro</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bookingId: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  proName: {
    fontSize: 12.5,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 8,
  },
  metaContainer: {
    gap: 4,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 11.5,
    color: '#4B5563',
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  amountLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  callButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
  },
});
