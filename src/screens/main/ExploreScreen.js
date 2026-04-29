import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  Dimensions,
  Platform,
  StatusBar,
  ScrollView
} from 'react-native';
import { useDispatch } from 'react-redux';
import { colors, s, spacing } from '../../constant/theme';
import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import RecipeCard from '../../components/RecipeCard';
import RecipeSkeleton from '../../components/RecipeSkeleton';
import AppBottomSheet from '../../components/AppBottomSheet';
import { 
  useGetCategoriesQuery, 
  useLazyGetRecipesByCategoryQuery,
  useLazyGetRecipesByRegionQuery,
  apiSlice 
} from '../../redux/api/apiSlice';
import { useTimeContext } from '../../hooks/useTimeContext';
import { LocationService } from '../../services/locationService';
import { FilterIcon, WhiteCheckIcon } from '../../assets/AppIcons';

const { width } = Dimensions.get('window');

const ExploreScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const timeContext = useTimeContext();
  const bottomSheetRef = useRef();
  
  const [activeCategory, setActiveCategory] = useState('Chicken');
  const [activeRegion, setActiveRegion] = useState('Indian');
  const [activeTime, setActiveTime] = useState(timeContext.label || 'Morning');
  const [activeTab, setActiveTab] = useState('Time');
  const [allRecipes, setAllRecipes] = useState([]);
  const [displayRecipes, setDisplayRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: categories } = useGetCategoriesQuery();
  const [triggerCategory] = useLazyGetRecipesByCategoryQuery();
  const [triggerRegion] = useLazyGetRecipesByRegionQuery();

  const PAGE_SIZE = 10;
  const regions = useMemo(() => ['Indian', 'Italian', 'American', 'Chinese', 'French', 'Japanese', 'Mexican', 'British', 'Canadian'], []);
  const times = useMemo(() => [
    { label: 'Morning', value: 'Breakfast' },
    { label: 'Midday', value: 'Chicken' },
    { label: 'Evening', value: 'Pasta' }
  ], []);

  const regionMap = useMemo(() => ({
    'India': 'Indian', 'Italy': 'Italian', 'United States': 'American',
    'Canada': 'Canadian', 'Mexico': 'Mexican', 'China': 'Chinese',
    'Japan': 'Japanese', 'France': 'French', 'United Kingdom': 'British',
  }), []);

  const applyFilters = useCallback(async () => {
    setLoading(true);
    try {
      const timeVal = times.find(t => t.label === activeTime)?.value || 'Breakfast';
      
      const [resReg, resCat, resTime] = await Promise.all([
        triggerRegion(activeRegion),
        triggerCategory(activeCategory),
        triggerCategory(timeVal)
      ]);

      const dataReg = resReg.data || [];
      const dataCat = resCat.data || [];
      const dataTime = resTime.data || [];

      const allMeals = [...dataReg, ...dataCat, ...dataTime];
      const mealCounts = {};
      const mealMap = {};

      allMeals.forEach(meal => {
        mealCounts[meal.idMeal] = (mealCounts[meal.idMeal] || 0) + 1;
        mealMap[meal.idMeal] = meal;
      });

      const sortedIds = Object.keys(mealCounts).sort((a, b) => mealCounts[b] - mealCounts[a]);
      const finalData = sortedIds.map(id => mealMap[id]);

      setAllRecipes(finalData);
      setDisplayRecipes(finalData.slice(0, PAGE_SIZE));
      setPage(1);
    } catch (error) {
      console.error('Filter Error:', error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeRegion, activeTime, times, triggerCategory, triggerRegion]);

  useEffect(() => {
    const initExplore = async () => {
      setLoading(true);
      try {
        const hasPermission = await LocationService.requestPermission();
        let countryRegion = 'Indian';
        if (hasPermission) {
          const coords = await LocationService.getCurrentLocation();
          const loc = await LocationService.getLocationName(coords.latitude, coords.longitude);
          const parts = loc.split(', ');
          const countryName = parts[parts.length - 1];
          countryRegion = regionMap[countryName] || 'Indian';
        }
        setActiveRegion(countryRegion);
        setActiveTime(timeContext.label || 'Morning');
        applyFilters();
      } catch (error) {
        applyFilters();
      }
    };
    initExplore();
  }, []);

  const handleReset = () => {
    setActiveCategory('Chicken');
    setActiveRegion('Indian');
    setActiveTime(timeContext.label || 'Morning');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(apiSlice.util.resetApiState());
    await applyFilters();
    setRefreshing(false);
  };

  const loadMore = () => {
    if (displayRecipes.length < allRecipes.length) {
      const nextPage = page + 1;
      const nextItems = allRecipes.slice(0, nextPage * PAGE_SIZE);
      setDisplayRecipes(nextItems);
      setPage(nextPage);
    }
  };

  const renderSkeletons = () => (
    <View style={styles.skeletonGrid}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <RecipeSkeleton key={i} style={styles.card} />
      ))}
    </View>
  );

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <AppText variant="title" style={styles.headerTitle}>Explore</AppText>
            <AppText variant="caption" color={colors.gray} numberOfLines={1}>
               {activeTime} • {activeRegion} • {activeCategory}
            </AppText>
          </View>
          <TouchableOpacity 
            style={styles.filterBtn} 
            onPress={() => bottomSheetRef.current?.open()}
          >
            <FilterIcon />
            { (activeRegion !== 'Indian' || activeCategory !== 'Chicken') && <View style={styles.headerBadge} /> }
          </TouchableOpacity>
        </View>

        {loading && page === 1 ? (
          renderSkeletons()
        ) : (
          <FlatList
            data={displayRecipes}
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
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
            }
          />
        )}

        <AppBottomSheet 
          ref={bottomSheetRef} 
          title="Explore Filters" 
          onApply={applyFilters}
          onClear={handleReset}
        >
          <View style={styles.sheetLayout}>
            <View style={styles.sidebar}>
              <TouchableOpacity 
                style={[styles.sidebarTab, activeTab === 'Time' && styles.activeSidebarTab]}
                onPress={() => setActiveTab('Time')}
              >
                <AppText style={[styles.sidebarText, activeTab === 'Time' && styles.activeSidebarText]}>Meal Time</AppText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.sidebarTab, activeTab === 'Country' && styles.activeSidebarTab]}
                onPress={() => setActiveTab('Country')}
              >
                <AppText style={[styles.sidebarText, activeTab === 'Country' && styles.activeSidebarText]}>Region</AppText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.sidebarTab, activeTab === 'Category' && styles.activeSidebarTab]}
                onPress={() => setActiveTab('Category')}
              >
                <AppText style={[styles.sidebarText, activeTab === 'Category' && styles.activeSidebarText]}>Category</AppText>
              </TouchableOpacity>
            </View>

            <View style={styles.sheetContent}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(20) }}>
                {activeTab === 'Time' && (
                  <View>
                    <AppText variant="caption" color={colors.gray} style={styles.tabHeading}>Meal Periods</AppText>
                    {times.map(t => {
                      const isSelected = activeTime === t.label;
                      return (
                        <TouchableOpacity 
                          key={t.label} 
                          style={[styles.optionItem, isSelected && styles.activeOption]}
                          onPress={() => setActiveTime(t.label)}
                        >
                          <AppText style={[styles.optionText, isSelected && styles.activeOptionText]}>{t.label}</AppText>
                          {isSelected && <View style={styles.whiteCheckWrap}><WhiteCheckIcon /></View>}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {activeTab === 'Country' && (
                  <View>
                    <AppText variant="caption" color={colors.gray} style={styles.tabHeading}>Regional Cuisine</AppText>
                    {regions.map(reg => {
                      const isSelected = activeRegion === reg;
                      return (
                        <TouchableOpacity 
                          key={reg} 
                          style={[styles.optionItem, isSelected && styles.activeOption]}
                          onPress={() => setActiveRegion(reg)}
                        >
                          <AppText style={[styles.optionText, isSelected && styles.activeOptionText]}>{reg}</AppText>
                          {isSelected && <View style={styles.whiteCheckWrap}><WhiteCheckIcon /></View>}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {activeTab === 'Category' && (
                  <View>
                    <AppText variant="caption" color={colors.gray} style={styles.tabHeading}>Food Categories</AppText>
                    {categories?.map(cat => {
                      const isSelected = activeCategory === cat.strCategory;
                      return (
                        <TouchableOpacity 
                          key={cat.strCategory} 
                          style={[styles.optionItem, isSelected && styles.activeOption]}
                          onPress={() => setActiveCategory(cat.strCategory)}
                        >
                          <AppText style={[styles.optionText, isSelected && styles.activeOptionText]}>
                            {cat.strCategory}
                          </AppText>
                          {isSelected && <View style={styles.whiteCheckWrap}><WhiteCheckIcon /></View>}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </AppBottomSheet>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: s(24), 
    paddingTop: Platform.OS === 'ios' ? s(50) : (StatusBar.currentHeight || 0) + s(15),
    paddingBottom: s(15)
  },
  headerTitle: { fontSize: s(28), fontWeight: '900', color: colors.dark, letterSpacing: -0.5 },
  filterBtn: { width: s(40), height: s(40), borderRadius: s(20), backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  headerBadge: { position: 'absolute', top: s(8), right: s(8), width: s(8), height: s(8), borderRadius: s(4), backgroundColor: colors.primary, borderWidth: 1.5, borderColor: colors.white },
  listContent: { paddingHorizontal: s(20), paddingBottom: s(40) },
  row: { justifyContent: 'space-between' },
  card: { width: (width - 55) / 2, marginBottom: s(20) },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: s(20) },
  sheetLayout: { flex: 1, flexDirection: 'row' },
  sidebar: { width: s(100), backgroundColor: '#F8FAFC', borderRightWidth: 1, borderRightColor: '#F1F5F9' },
  sidebarTab: { paddingVertical: s(18), paddingHorizontal: s(15), borderLeftWidth: s(4), borderLeftColor: 'transparent' },
  activeSidebarTab: { backgroundColor: colors.white, borderLeftColor: colors.primary },
  sidebarText: { fontSize: s(12), fontWeight: '700', color: colors.gray },
  activeSidebarText: { color: colors.dark, fontWeight: '900' },
  sheetContent: { flex: 1, paddingHorizontal: s(15) },
  tabHeading: { marginTop: s(15), marginBottom: s(10), fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', fontSize: s(10), color: colors.gray },
  optionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: s(10), paddingHorizontal: s(12), marginBottom: s(6), borderRadius: s(12) },
  activeOption: { backgroundColor: colors.primary, elevation: 4 },
  optionText: { fontSize: s(14), fontWeight: '600', color: colors.dark },
  activeOptionText: { color: colors.white, fontWeight: '900' },
  whiteCheckWrap: { width: s(20), height: s(20), borderRadius: s(10), backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' }
});

export default ExploreScreen;
