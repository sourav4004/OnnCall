import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Professional } from '../types';
import { AppIcon } from './AppIcon';

interface ProfessionalCardProps {
  pro: Professional;
  onSelect: (pro: Professional) => void;
  onBookNow: (pro: Professional) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (proId: string) => void;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  pro,
  onSelect,
  onBookNow,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onSelect(pro)}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(pro.name)}</Text>
          </View>
          {pro.isVerified && (
            <View style={styles.verifiedBadge}>
              <AppIcon name="check" size={10} className="text-white" />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.infoWrapper}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {pro.name}
            </Text>
            {onToggleFavorite && (
              <TouchableOpacity
                onPress={() => onToggleFavorite(pro.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.favButton}
              >
                <AppIcon
                  name="heart"
                  size={16}
                  className={isFavorite ? 'fill-[#E11D48] text-[#E11D48]' : 'text-[#A3A3A3]'}
                />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.specialtyText} numberOfLines={1}>
            {pro.role}
          </Text>

          {/* Rating, Experience & Distance */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <AppIcon name="star" size={13} className="text-[#EAB308] fill-[#EAB308]" />
              <Text style={styles.metaText}>{pro.rating}</Text>
              <Text style={styles.metaSubText}>({pro.reviewsCount})</Text>
            </View>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.metaSubText}>{pro.experienceYears} yrs exp</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.metaSubText}>{pro.distanceKm} km</Text>
          </View>
        </View>
      </View>

      {/* Pricing & CTA */}
      <View style={styles.footerRow}>
        <View>
          <Text style={styles.priceLabel}>Starting from</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>₹{pro.hourlyRate}</Text>
            <Text style={styles.priceUnit}>/ visit</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={(e) => {
            e.stopPropagation?.();
            onBookNow(pro);
          }}
          style={styles.bookButton}
        >
          <Text style={styles.bookButtonText}>Book Slot</Text>
          <AppIcon name="chevron-right" size={14} className="text-white" />
        </TouchableOpacity>
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
    alignItems: 'flex-start',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1E7A34',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  infoWrapper: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
    flex: 1,
  },
  favButton: {
    padding: 2,
    marginLeft: 6,
  },
  specialtyText: {
    fontSize: 12.5,
    color: '#6B7280',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
  },
  metaSubText: {
    fontSize: 11.5,
    color: '#6B7280',
  },
  dot: {
    fontSize: 10,
    color: '#9CA3AF',
    marginHorizontal: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  priceLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 1,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
  priceUnit: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 2,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 4,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
