import React, { memo } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Svg, { Path } from 'react-native-svg';
import { colors, s, spacing } from '../constant/theme';
import AppText from './AppText';
import AppImage from './AppImage';
import { toggleFavorite } from '../redux/slices/userSlice';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 50) / 2;

/**
 * Standard Heart SVG for Cards
 */
const HeartSmall = ({ filled }) => (
  <Svg width={s(18)} height={s(18)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={filled ? "#FF4B4B" : "rgba(0,0,0,0.3)"}
      stroke={filled ? "#FF4B4B" : "#fff"}
      strokeWidth="2"
    />
  </Svg>
);

const RecipeCard = ({ item, onPress, style }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.user.favorites);
  const isFavorite = favorites.some(fav => fav.idMeal === item.idMeal);

  const handleFav = (e) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.9} 
      style={[styles.container, style]}
    >
      <View style={styles.imageContainer}>
        <AppImage 
          source={{ uri: item.strMealThumb }} 
          style={styles.image} 
          borderRadius={s(16)}
        />
        
        <TouchableOpacity style={styles.favIndicator} onPress={handleFav}>
          <HeartSmall filled={isFavorite} />
        </TouchableOpacity>

      </View>

      <View style={styles.info}>
        <AppText variant="body" numberOfLines={1} style={styles.title}>
          {item.strMeal}
        </AppText>
        <AppText variant="caption" color={colors.primary} style={styles.area}>
          {item.strArea || 'Popular'}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: s(20),
    ...spacing.mb(16),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  imageContainer: {
    width: '100%',
    height: s(150),
    borderRadius: s(16),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favIndicator: {
    position: 'absolute',
    top: s(10),
    right: s(10),
    width: s(34),
    height: s(34),
    borderRadius: s(17),
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 3,
  },
  badge: {
    position: 'absolute',
    bottom: s(10),
    left: s(10),
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: s(10),
    paddingVertical: s(4),
    borderRadius: s(12),
  },
  badgeText: {
    fontSize: s(10),
    fontWeight: 'bold',
  },
  info: {
    ...spacing.p(12),
  },
  title: {
    fontWeight: '800',
    fontSize: s(15),
    color: colors.dark,
    ...spacing.mb(4),
  },
  area: {
    fontSize: s(11),
    fontWeight: '700',
  }
});

export default memo(RecipeCard);
