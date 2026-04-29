import React from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, s, spacing } from '../../constant/theme';
import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import AppHeader from '../../components/AppHeader';
import RecipeCard from '../../components/RecipeCard';
import { FavoriteIcon } from '../../assets/AppIcons';

const { width } = Dimensions.get('window');

const FavoritesScreen = ({ navigation }) => {
  const favorites = useSelector(state => state.user.favorites);

  return (
    <ScreenContainer header={<AppHeader title="My Favorites" />}>
      <View style={styles.container}>
        {favorites.length > 0 ? (
          <FlatList
            data={favorites}
            renderItem={({ item }) => (
              <RecipeCard 
                item={item} 
                onPress={() => navigation.navigate('Details', { id: item.idMeal })}
                style={styles.card}
              />
            )}
            keyExtractor={item => item.idMeal}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
              <FavoriteIcon 
                size={s(40)} 
                color={colors.primary} 
                filled={true} 
                strokeWidth="1.5"
              />
            </View>
            <AppText variant="subtitle" style={styles.emptyTitle}>No Favorites Yet</AppText>
            <AppText variant="body" color={colors.gray} center style={styles.emptyDesc}>
              Explore our delicious recipes and tap the heart icon to save your favorites here!
            </AppText>
            <TouchableOpacity 
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('HomeTab')}
            >
              <AppText color={colors.white} style={styles.btnText}>Explore Recipes</AppText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: s(20),
  },
  listContent: {
    paddingBottom: s(100),
    paddingTop: s(15),
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 55) / 2,
    marginBottom: s(18),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(40),
    paddingBottom: s(60),
  },
  iconCircle: {
    width: s(100),
    height: s(100),
    borderRadius: s(50),
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: s(25),
  },
  emptyTitle: {
    fontSize: s(20),
    fontWeight: '900',
    color: colors.dark,
    marginBottom: s(12),
  },
  emptyDesc: {
    textAlign: 'center',
    lineHeight: s(18),
    marginBottom: s(30),
  },
  exploreBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: s(30),
    paddingVertical: s(14),
    borderRadius: s(30),
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  btnText: {
    fontWeight: '800',
    fontSize: s(14),
  }
});

export default FavoritesScreen;
