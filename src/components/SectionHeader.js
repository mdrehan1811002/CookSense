import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, s, spacing } from '../constant/theme';
import AppText from './AppText';

/**
 * SectionHeader - Header for sections with a title and an optional action link.
 * Enhanced with premium styling and accent bars.
 */
const SectionHeader = ({ title, actionLabel = "See All", onActionPress, style }) => {
  return (
    <View style={[styles.sectionHeader, style]}>
      <View style={styles.titleWrapper}>
        <View style={styles.accentBar} />
        <AppText style={styles.titleText}>{title}</AppText>
      </View>
      {onActionPress && (
        <TouchableOpacity onPress={onActionPress} activeOpacity={0.6}>
          <AppText color={colors.primary} style={styles.actionText}>{actionLabel}</AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(15),
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accentBar: {
    width: s(4),
    height: s(20),
    backgroundColor: colors.primary,
    borderRadius: s(2),
    marginRight: s(10),
  },
  titleText: {
    fontSize: s(18),
    fontWeight: '900',
    color: colors.dark,
    letterSpacing: -0.5,
  },
  actionText: {
    fontWeight: '800',
    fontSize: s(12),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});

export default SectionHeader;
