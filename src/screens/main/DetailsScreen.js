import React, { useMemo } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useGetRecipeDetailsQuery } from '../../redux/api/apiSlice';
import { colors, s, spacing } from '../../constant/theme';
import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import AppHeader from '../../components/AppHeader';
import AppImage from '../../components/AppImage';
import { toggleFavorite } from '../../redux/slices/userSlice';
import { FavoriteIcon } from '../../assets/AppIcons';

const { width } = Dimensions.get('window');

const DetailsScreen = ({ route, navigation }) => {
  const { id } = route.params || {};
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.user.favorites);
  const isFavorite = useMemo(() => favorites.some(item => item.idMeal === id), [favorites, id]);

  const { data: recipe, isLoading, error } = useGetRecipeDetailsQuery(id, {
    skip: !id,
  });

  const handleFavorite = () => {
    if (recipe) dispatch(toggleFavorite(recipe));
  };

  if (isLoading) {
    return (
      <ScreenContainer header={<AppHeader title="Recipe Detail" showBack />}>
        <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
      </ScreenContainer>
    );
  }

  if (error || !recipe) {
    return (
      <ScreenContainer header={<AppHeader title="Error" showBack />}>
        <View style={styles.center}><AppText color={colors.danger}>Failed to load recipe.</AppText></View>
      </ScreenContainer>
    );
  }

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`];
    if (ing && ing.trim()) ingredients.push(`${recipe[`strMeasure${i}`]} ${ing}`);
  }

  return (
    <ScreenContainer 
      header={
        <AppHeader 
          title="Recipe Detail" 
          showBack 
          rightElement={
            <TouchableOpacity onPress={handleFavorite} style={styles.headerFavBtn}>
              <FavoriteIcon 
                filled={isFavorite} 
                size={s(26)} 
                color={isFavorite ? "#FF4B4B" : colors.primary} 
                strokeWidth="2.5"
              />
            </TouchableOpacity>
          }
        />
      }
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <AppImage source={{ uri: recipe.strMealThumb }} style={styles.image} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.headerInfo}>
            <View style={styles.badge}>
              <AppText variant="caption" color={colors.white} style={styles.badgeText}>{recipe.strCategory}</AppText>
            </View>
            <AppText variant="title" style={styles.recipeTitle}>{recipe.strMeal}</AppText>
            <AppText variant="caption" color={colors.primary} style={styles.regionText}>
              Origin: {recipe.strArea}
            </AppText>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionIcon} />
              <AppText variant="subtitle" style={styles.sectionTitle}>Ingredients</AppText>
            </View>
            <View style={styles.ingredientsList}>
              {ingredients.map((item, index) => (
                <View key={index} style={styles.ingredientCard}>
                  <AppText variant="body" style={styles.ingredientText}>{item}</AppText>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionIcon} />
              <AppText variant="subtitle" style={styles.sectionTitle}>Instructions</AppText>
            </View>
            <View style={styles.instructionCard}>
              <AppText variant="body" style={styles.instructionsText}>{recipe.strInstructions}</AppText>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { width: '100%', height: s(350) },
  image: { width: '100%', height: '100%' },
  headerFavBtn: {
    width: s(40),
    height: s(40),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  content: {
    ...spacing.p(20),
    backgroundColor: colors.white,
    marginTop: s(-40),
    borderTopLeftRadius: s(40),
    borderTopRightRadius: s(40),
    minHeight: s(600),
  },
  headerInfo: { ...spacing.mb(20) },
  badge: { backgroundColor: colors.primary, alignSelf: 'flex-start', paddingHorizontal: s(12), paddingVertical: s(6), borderRadius: s(10), ...spacing.mb(10) },
  badgeText: { fontWeight: '800', fontSize: s(10), letterSpacing: 1 },
  recipeTitle: { fontSize: s(28), fontWeight: '900', color: colors.dark, lineHeight: s(34) },
  regionText: { fontWeight: '700', ...spacing.mt(5), fontSize: s(14) },
  divider: { height: 1, backgroundColor: '#F1F5F9', ...spacing.my(20) },
  section: { ...spacing.mb(30) },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', ...spacing.mb(15) },
  sectionIcon: { width: s(4), height: s(20), backgroundColor: colors.primary, borderRadius: s(2), ...spacing.mr(10) },
  sectionTitle: { fontSize: s(20), fontWeight: '800', color: colors.dark },
  ingredientsList: { flexDirection: 'row', flexWrap: 'wrap' },
  ingredientCard: { backgroundColor: '#F8FAFC', paddingHorizontal: s(15), paddingVertical: s(10), borderRadius: s(12), ...spacing.mr(10), ...spacing.mb(10), borderWidth: 1, borderColor: '#E2E8F0' },
  ingredientText: { color: colors.dark, fontSize: s(14), fontWeight: '600' },
  instructionCard: { backgroundColor: '#F8FAFC', ...spacing.p(20), borderRadius: s(20), borderWidth: 1, borderColor: '#E2E8F0' },
  instructionsText: { lineHeight: s(24), color: colors.dark, textAlign: 'justify', fontSize: s(15) }
});

export default DetailsScreen;
