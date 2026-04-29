import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors, s, spacing, fonts } from '../constant/theme';
import AppText from './AppText';

/**
 * AppButton - A premium, customizable button component.
 * 
 * @param {Object} props
 * @param {String} props.title - Button text
 * @param {Function} props.onPress - Tap handler
 * @param {String} props.variant - 'primary' | 'outline' | 'ghost'
 * @param {Boolean} props.loading - Show loading spinner
 * @param {Boolean} props.disabled - Disable interaction
 * @param {Object} props.style - Custom container styles
 */
const AppButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  style,
  textStyle 
}) => {
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        isOutline && styles.outlineButton,
        isGhost && styles.ghostButton,
        disabled && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline || isGhost ? colors.primary : colors.white} />
      ) : (
        <AppText 
          style={[
            styles.text,
            isOutline && styles.outlineText,
            isGhost && styles.ghostText,
            textStyle
          ]}
        >
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: s(50),
    backgroundColor: colors.primary,
    borderRadius: s(12),
    justifyContent: 'center',
    alignItems: 'center',
    ...spacing.px(20),
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    color: colors.white,
    fontSize: s(16),
    fontFamily: fonts.semiBold,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  disabled: {
    backgroundColor: colors.lightGray,
    borderColor: colors.lightGray,
    shadowOpacity: 0,
  }
});

export default AppButton;
