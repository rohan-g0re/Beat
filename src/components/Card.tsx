/**
 * Card Component - Reusable card matching Figma Frame 1:19 Screen 2
 * Used for routines, days, exercises, and workout cards
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme/colors';
import { spacing, borderRadius } from '@theme/spacing';
import { typography } from '@theme/typography';

export type CardVariant = 'routine' | 'day' | 'exercise' | 'workout';

interface CardProps {
  title: string;
  subtitle?: string;
  image?: ImageSourcePropType | string;
  tags?: string[];
  variant?: CardVariant;
  onPress?: () => void;
  disabled?: boolean;
  showEditIcon?: boolean;
  onEditPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  image,
  tags = [],
  variant = 'routine',
  onPress,
  disabled = false,
  showEditIcon = false,
  onEditPress,
}) => {
  const hasImage = !!image;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || !onPress}
    >
      {hasImage && (
        <View style={styles.imageContainer}>
          <Image
            source={typeof image === 'string' ? { uri: image } : image}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}

      <View style={[styles.content, hasImage && styles.contentWithImage]}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Edit Icon */}
      {showEditIcon && onEditPress && (
        <Pressable
          style={styles.editButton}
          onPress={(e) => {
            e.stopPropagation();
            onEditPress();
          }}
          hitSlop={8}
        >
          <Ionicons name="pencil" size={20} color={colors.primary[500]} />
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    borderRadius: 4,
    marginBottom: spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  editButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: '#2C2C2E',
    borderRadius: borderRadius.md,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#2C2C2E',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: spacing.md,
  },
  contentWithImage: {
    paddingTop: spacing.sm,
  },
  textContainer: {
    marginBottom: spacing.sm,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    color: '#8E8E93',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
});

