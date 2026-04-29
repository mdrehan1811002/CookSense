import React, { memo } from 'react';
import { Text, I18nManager } from 'react-native';
import { scale, fonts, variants } from '../constant/theme';

const AppText = ({
  children,
  style,
  variant = 'body',
  size,
  type,
  color,
  numberOfLines,
  center = false,
  uppercase = false,
  selectable = false,
  accessibilityLabel,
  testID,
  maxFontSizeMultiplier = 1.5,
  ...props
}) => {
  const v = variants[variant] || variants.body;

  const finalSize = size || v.size;
  const finalFont = type || v.font;
  const finalColor = color || v.color;

  return (
    <Text
      allowFontScaling
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      selectable={selectable}
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      testID={testID}
      style={[
        {
          fontSize: scale(finalSize),
          fontFamily: fonts[finalFont] || fonts.regular,
          color: finalColor,
          textAlign: center ? 'center' : 'left',
          textTransform: uppercase ? 'uppercase' : 'none',
          writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
          flexShrink: 1,
          flexWrap: 'wrap',
          lineHeight: scale(finalSize) * 1.4,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default memo(AppText);
