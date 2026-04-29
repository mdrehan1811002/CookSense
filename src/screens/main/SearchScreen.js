import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  FlatList, 
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
  Keyboard,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash/debounce';
import { colors, s, spacing } from '../../constant/theme';
import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import RecipeCard from '../../components/RecipeCard';
import RecipeSkeleton from '../../components/RecipeSkeleton';
import { useLazySearchRecipesQuery, useLazyGetRecipesByCategoryQuery } from '../../redux/api/apiSlice';
import { addSearchTerm, removeSearchTerm, clearSearchHistory } from '../../redux/slices/searchSlice';
import { 
  BackIcon, 
  CloseIcon, 
  HistoryIcon, 
  SearchIllustration 
} from '../../assets/AppIcons';

const { width } = Dimensions.get('window');
const EMPTY_ARRAY = [];

const SearchScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const history = useSelector(state => state.search?.recentSearches || EMPTY_ARRAY);
  
  const [query, setQuery] = useState('');
  const [allResults, setAllResults] = useState([]);
  const [displayResults, setDisplayResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [triggerSearch] = useLazySearchRecipesQuery();
  const [triggerCategorySearch] = useLazyGetRecipesByCategoryQuery();

  const PAGE_SIZE = 10;
  const popularCategories = useMemo(() => [
    { name: 'Chicken', icon: '🍗' },
    { name: 'Dessert', icon: '🍰' },
    { name: 'Seafood', icon: '🐟' },
    { name: 'Pasta', icon: '🍝' },
    { name: 'Beef', icon: '🥩' },
    { name: 'Vegetarian', icon: '🥗' }
  ], []);

  const performSearch = async (text) => {
    let q = text.trim();
    if (!q) return;

    setLoading(true);
    setPage(1);
    try {
      const searchResult = await triggerSearch(q).unwrap();
      let data = searchResult || [];
      
      if (!data || data.length === 0) {
        const catResult = await triggerCategorySearch(q).unwrap();
        data = catResult || [];
      }

      setAllResults(data);
      setDisplayResults(data.slice(0, PAGE_SIZE));
      
      if (data.length > 0) {
        dispatch(addSearchTerm(q));
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((text) => performSearch(text), 500),
    [triggerSearch, triggerCategorySearch, dispatch]
  );

  const handleSearch = (text) => {
    setQuery(text);
    if (text.length > 0) {
      setLoading(true);
      debouncedSearch(text);
    } else {
      setAllResults([]);
      setDisplayResults([]);
      setLoading(false);
    }
  };

  const onSuggestionTap = (item) => {
    setQuery(item);
    performSearch(item);
    Keyboard.dismiss();
  };

  const renderRecentItem = (item, index) => (
    <View key={index} style={styles.recentItem}>
      <TouchableOpacity 
        style={styles.recentTextBtn}
        onPress={() => onSuggestionTap(item)}
      >
        <HistoryIcon />
        <AppText variant="body" style={styles.recentText}>{item}</AppText>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.removeItemBtn}
        onPress={() => dispatch(removeSearchTerm(item))}
      >
        <CloseIcon size={s(18)} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.searchHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <BackIcon />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Search dishes, ingredients..."
              placeholderTextColor="#94A3B8"
              value={query}
              onChangeText={handleSearch}
              autoFocus
              returnKeyType="search"
              onSubmitEditing={() => performSearch(query)}
            />
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : query.length > 0 ? (
              <TouchableOpacity onPress={() => { setQuery(''); setDisplayResults([]); }}>
                <CloseIcon color={colors.dark} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {loading && page === 1 ? (
          <View style={styles.skeletonGrid}>
            {[1, 2, 3, 4].map(i => <RecipeSkeleton key={i} style={styles.card} />)}
          </View>
        ) : query.length > 0 && displayResults.length === 0 ? (
          <View style={styles.emptyContainer}>
            <SearchIllustration />
            <AppText variant="subtitle" style={styles.emptyTitle}>No Results</AppText>
            <AppText variant="body" color={colors.gray} center>Try searching for "Chicken" or "Pasta"</AppText>
          </View>
        ) : query.length === 0 ? (
          <ScrollView style={styles.initialContent} showsVerticalScrollIndicator={false}>
            {history.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <AppText variant="subtitle" style={styles.sectionTitle}>Recent Searches</AppText>
                  <TouchableOpacity onPress={() => dispatch(clearSearchHistory())}>
                    <AppText variant="caption" color={colors.primary}>Clear All</AppText>
                  </TouchableOpacity>
                </View>
                <View style={styles.recentList}>
                  {history.map((item, index) => renderRecentItem(item, index))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <AppText variant="subtitle" style={styles.sectionTitle}>Popular Categories</AppText>
              <View style={styles.categoryGrid}>
                {popularCategories.map((cat, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.categoryCard}
                    onPress={() => onSuggestionTap(cat.name)}
                  >
                    <View style={styles.iconWrap}>
                      <AppText style={styles.categoryIcon}>{cat.icon}</AppText>
                    </View>
                    <AppText variant="caption" style={styles.categoryName}>{cat.name}</AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={displayResults}
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
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(15),
    paddingTop: Platform.OS === 'ios' ? s(50) : (StatusBar.currentHeight || 0) + s(10),
    paddingBottom: s(15),
  },
  backBtn: { width: s(40), height: s(40), justifyContent: 'center' },
  inputWrapper: { flex: 1, height: s(48), backgroundColor: '#F1F5F9', borderRadius: s(24), flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(20) },
  input: { flex: 1, fontSize: s(15), color: colors.dark, fontWeight: '600' },
  initialContent: { flex: 1, paddingHorizontal: s(20) },
  section: { marginTop: s(20), marginBottom: s(10) },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: s(15) },
  sectionTitle: { fontSize: s(17), fontWeight: '900', color: colors.dark },
  recentList: { backgroundColor: '#F8FAFC', borderRadius: s(15), padding: s(5) },
  recentItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingVertical: s(12),
    paddingHorizontal: s(15),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  recentTextBtn: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  recentText: { marginLeft: s(12), fontWeight: '600', color: colors.dark },
  removeItemBtn: { padding: s(5) },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: s(15) },
  categoryCard: { width: (width - 60) / 3, alignItems: 'center', marginBottom: s(20) },
  iconWrap: { width: s(60), height: s(60), borderRadius: s(30), backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: s(8) },
  categoryIcon: { fontSize: s(24) },
  categoryName: { fontWeight: '800', color: colors.dark },
  listContent: { paddingHorizontal: s(20), paddingTop: s(10), paddingBottom: s(40) },
  row: { justifyContent: 'space-between' },
  card: { width: (width - 55) / 2, marginBottom: s(20) },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: s(20), paddingTop: s(10) },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: s(40) },
  emptyTitle: { fontWeight: '800', marginTop: s(20) }
});

export default SearchScreen;
