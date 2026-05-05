import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;



// 📏 Scaling Functions
export const scale = (size) => {
  const newSize = size * (width / guidelineBaseWidth);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};



export const verticalScale = (size) => {
  const newSize = size * (height / guidelineBaseHeight);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// 🎯 Short-hand Helpers
export const s = (size) => scale(size);
export const vs = (size) => verticalScale(size);
export const fs = (size) => scale(size);

// 🎨 Theme Colors
export const colors = {
  black: '#000',
  dark: '#111827',
  gray: '#6B7280',
  lightGray: '#9CA3AF',
  primary: '#2874F0',
  danger: '#DC2626',
  white: '#FFFFFF',
  border: '#E5E7EB',
  background: '#F9FAFB',
};

// 🔡 Fonts
export const fonts = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
};

// 📝 Text Variants
export const variants = {
  title: { size: 18, font: 'bold', color: colors.black },
  subtitle: { size: 16, font: 'semiBold', color: colors.gray },
  body: { size: 14, font: 'regular', color: colors.dark },
  caption: { size: 12, font: 'medium', color: colors.lightGray },
  button: { size: 14, font: 'semiBold', color: colors.white },
  link: { size: 14, font: 'medium', color: colors.primary },
  error: { size: 12, font: 'medium', color: colors.danger },
};

// 🛠 Spacing Helpers (Margins & Paddings)
export const spacing = {
  // Margins
  m: (val) => ({ margin: scale(val) }),
  mt: (val) => ({ marginTop: scale(val) }),
  mb: (val) => ({ marginBottom: scale(val) }),
  ml: (val) => ({ marginLeft: scale(val) }),
  mr: (val) => ({ marginRight: scale(val) }),
  ms: (val) => ({ marginStart: scale(val) }),
  me: (val) => ({ marginEnd: scale(val) }),
  mx: (val) => ({ marginHorizontal: scale(val) }),
  my: (val) => ({ marginVertical: scale(val) }),

  // Paddings
  p: (val) => ({ padding: scale(val) }),
  pt: (val) => ({ paddingTop: scale(val) }),
  pb: (val) => ({ paddingBottom: scale(val) }),
  pl: (val) => ({ paddingLeft: scale(val) }),
  pr: (val) => ({ paddingRight: scale(val) }),
  ps: (val) => ({ paddingStart: scale(val) }),
  pe: (val) => ({ paddingEnd: scale(val) }),
  px: (val) => ({ paddingHorizontal: scale(val) }),
  py: (val) => ({ paddingVertical: scale(val) }),
};

// 📱 Device Info
export const device = {
  width,
  height,
  isSmallDevice: width < 375,
};
