import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar,
  Platform,
  RefreshControl,
  Animated,
} from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { colors, s, spacing } from '../../constant/theme';
import AppText from '../../components/AppText';
import { useGetLatestRecipesQuery, useLazyGetRecipesByRegionQuery, useLazyGetRecipesByCategoryQuery, apiSlice } from '../../redux/api/apiSlice';
import { useTimeContext } from '../../hooks/useTimeContext';
import { useDispatch } from 'react-redux';
import ScreenContainer from '../../components/ScreenContainer';
import RecipeCard from '../../components/RecipeCard';
import SectionHeader from '../../components/SectionHeader';
import { LocationService } from '../../services/locationService';
import { notificationService } from '../../services/notificationService';
import { NotificationIcon, LocationIcon, SearchIcon } from '../../assets/AppIcons';

const { width } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? s(45) : (StatusBar.currentHeight || 0);
const HEADER_MAX_HEIGHT = s(165);
const HEADER_MIN_HEIGHT = STATUS_BAR_HEIGHT + s(60);
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const RecipeSkeleton = () => (
  <View style={styles.skeletonContainer}>
    <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.skeletonImage} />
    <View style={styles.skeletonInfo}>
      <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.skeletonTitle} />
      <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.skeletonSubtitle} />
    </View>
  </View>
);

const HomeScreen = ({ navigation }) => {
  const timeContext = useTimeContext();
  const [userLocation, setUserLocation] = useState('Loc...');
  const [refreshing, setRefreshing] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const dispatch = useDispatch();
  const [recommendedResults, setRecommendedResults] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  const [triggerRegionRecipes] = useLazyGetRecipesByRegionQuery();
  const [triggerCategoryRecipes] = useLazyGetRecipesByCategoryQuery();

  const scrollY = useRef(new Animated.Value(0)).current;

  const regionMap = useMemo(() => ({
    'India': 'Indian', 'Italy': 'Italian', 'United States': 'American',
    'Canada': 'Canadian', 'Mexico': 'Mexican', 'China': 'Chinese',
    'Japan': 'Japanese', 'France': 'French', 'United Kingdom': 'British',
  }), []);

  const fetchLocationAndData = useCallback(async (isManualRefresh = false) => {
    setRecLoading(true);
    try {
      const hasPermission = await LocationService.requestPermission();
      let currentRegion = 'Indian';
      if (hasPermission) {
        const coords = await LocationService.getCurrentLocation();
        const loc = await LocationService.getLocationName(coords.latitude, coords.longitude);
        const parts = loc.split(', ');
        const countryName = parts[parts.length - 1];
        setUserLocation(parts[0]);
        currentRegion = regionMap[countryName] || 'Indian';
      }

      // Use the category directly from timeContext
      const timeCategory = timeContext.category || 'Breakfast';

      const [regRes, catRes] = await Promise.all([
        triggerRegionRecipes(currentRegion, !isManualRefresh), // Use cache if not manual
        triggerCategoryRecipes(timeCategory, !isManualRefresh)
      ]);
      
      const regData = regRes.data || [];
      const catData = catRes.data || [];

      const regIds = new Set(regData?.map(m => m.idMeal) || []);
      const exactMatches = catData?.filter(m => regIds.has(m.idMeal)) || [];
      
      let finalResults = [...exactMatches];

      if (finalResults.length < 12 && catData) {
        const otherInCat = catData.filter(m => !finalResults.find(fr => fr.idMeal === m.idMeal));
        finalResults = [...finalResults, ...otherInCat.slice(0, 10)];
      }

      if (finalResults.length < 15 && regData) {
        const otherInReg = regData.filter(m => !finalResults.find(fr => fr.idMeal === m.idMeal));
        finalResults = [...finalResults, ...otherInReg.slice(0, 10)];
      }

      setRecommendedResults(finalResults.length > 0 ? finalResults : regData?.slice(0, 10) || []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setRecLoading(false);
    }
  }, [timeContext.category, regionMap, triggerRegionRecipes, triggerCategoryRecipes]);

  useEffect(() => {
    fetchLocationAndData().then(() => setIsDataLoaded(true));
  }, [fetchLocationAndData]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Refreshing API state clears persistent cache for fresh fetch
    dispatch(apiSlice.util.resetApiState());
    await fetchLocationAndData(true);
    setRefreshing(false);
  };

  // Watch for time period changes to auto-refresh
  useEffect(() => {
    if (isDataLoaded) {
      console.log('Time period changed, auto-refreshing...');
      fetchLocationAndData();
    }
  }, [timeContext.label, isDataLoaded]);

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
  };

  const { data: latestRecipes, isLoading: isLatestLoading } = useGetLatestRecipesQuery();

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const searchTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, s(15)],
    extrapolate: 'clamp',
  });

  return (
    <ScreenContainer>
      <StatusBar barStyle="dark-content" backgroundColor="white" translucent={false} />

      <Animated.View style={[
        styles.header,
        {
          transform: [{ translateY: headerTranslate }],
          zIndex: 1000,
          elevation: scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 8],
            extrapolate: 'clamp'
          })
        }
      ]}>
        <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
          <View style={styles.mainHeaderRow}>
            <View style={styles.greetingWrapper}>
              <AppText 
                numberOfLines={1} 
                adjustsFontSizeToFit={true}
                minimumFontScale={0.85}
                style={styles.hiChefText}
              >
                Hi Chef! <AppText style={{ color: colors.primary }}>{timeContext.greeting}</AppText> 👋
              </AppText>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap' }}>
                <AppText 
                  numberOfLines={1} 
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.9}
                  style={styles.descriptionText}
                >
                  Ready for some {timeContext.label.toLowerCase()} magic? ✨
                </AppText>
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  style={styles.liveIndicator}
                  onPress={() => {
                    const meal = timeContext.label;
                    notificationService.displayNotification(
                      `CookSense ${meal} Time! 👨‍🍳`,
                      `Ready for a perfect ${meal.toLowerCase()}? Check out our recommendations!`
                    );
                  }}
                >
                   <View style={styles.liveDot} />
                   <AppText style={styles.liveTimeText}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</AppText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.actionGroupRow}>
              <TouchableOpacity onPress={fetchLocationAndData} activeOpacity={0.7} style={styles.compactLocPill}>
                <LocationIcon />
                <AppText numberOfLines={1} adjustsFontSizeToFit={true} minimumFontScale={0.8} style={styles.pillCityName}>
                  {userLocation.toUpperCase()}
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.notifSmallBtn} onPress={handleNotificationPress}>
                <NotificationIcon />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.searchPillWrapper, { transform: [{ translateY: searchTranslateY }] }]}>
          <TouchableOpacity activeOpacity={0.9} style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
            <SearchIcon />
            <AppText color={colors.gray} style={styles.searchPlaceholder}>Search for recipes...</AppText>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollArea}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} progressViewOffset={HEADER_MAX_HEIGHT} />}
      >
        <View style={styles.contentBody}>
          <View style={styles.sectionWrap}>
            <SectionHeader
              title={`Recommended for ${timeContext.label}`}
              onActionPress={() => navigation.navigate('Explore')}
              style={{ paddingHorizontal: s(15) }}
            />
            {recLoading ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listPad}>
                {[1, 2, 3].map(i => <RecipeSkeleton key={i} />)}
              </ScrollView>
            ) : (
              <FlatList
                data={recommendedResults}
                renderItem={({ item }) => (
                  <RecipeCard item={item} onPress={() => navigation.navigate('Details', { id: item.idMeal })} style={styles.horizCard} />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listPad}
                keyExtractor={item => item.idMeal}
              />
            )}
          </View>

          <SectionHeader
            title="Fresh Collections"
            style={{ marginTop: s(30), paddingHorizontal: s(15) }}
            onActionPress={() => navigation.navigate('Explore')}
          />
          <View style={styles.recipeGrid}>
            {isLatestLoading ? (
              [1, 2, 3, 4, 5, 6].map(i => <RecipeSkeleton key={i} />)
            ) : (
              latestRecipes?.slice(5, 15).map(item => (
                <RecipeCard key={item.idMeal} item={item} onPress={() => navigation.navigate('Details', { id: item.idMeal })} style={styles.gridRecipe} />
              ))
            )}
          </View>
        </View>
      </Animated.ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: { position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_MAX_HEIGHT, backgroundColor: colors.white, paddingHorizontal: s(15), paddingTop: STATUS_BAR_HEIGHT + s(10) },
  headerContent: { marginBottom: s(12) },
  mainHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: s(6), flexWrap: 'nowrap' },
  greetingWrapper: { flex: 1, justifyContent: 'flex-start' },
  hiChefText: { fontSize: s(14), fontWeight: '900', color: colors.dark, flexShrink: 1 },
  actionGroupRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingTop: s(2), flexShrink: 0, minWidth: s(120) },
  compactLocPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: s(8), paddingVertical: s(4), borderRadius: s(15), borderWidth: 1, borderColor: '#E2E8F0', marginRight: s(6), flexShrink: 1, maxWidth: s(95) },
  pillCityName: { fontSize: s(8.5), fontWeight: '900', color: colors.dark, marginLeft: s(4), letterSpacing: 0.2 },
  notifSmallBtn: { width: s(32), height: s(32), borderRadius: s(16), backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', flexShrink: 0 },
  descriptionText: { fontSize: s(10), color: colors.gray, fontWeight: '700', marginTop: s(-1) },
  searchPillWrapper: { width: '100%', position: 'absolute', bottom: s(18), left: s(15), right: s(15) },
  searchBar: { height: s(48), backgroundColor: '#F8FAFC', borderRadius: s(10), paddingHorizontal: s(15), flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
  searchPlaceholder: { fontSize: s(12), fontWeight: '600', marginLeft: s(8), flex: 1 },
  scrollArea: { paddingTop: HEADER_MAX_HEIGHT + s(5), paddingBottom: s(40) },
  contentBody: { flex: 1 },
  sectionWrap: { marginTop: s(5) },
  listPad: { paddingHorizontal: s(15), paddingBottom: s(10) },
  horizCard: { width: s(240), marginRight: s(15) },
  chip: { backgroundColor: '#F8FAFC', paddingHorizontal: s(18), paddingVertical: s(8), borderRadius: s(25), marginRight: s(10), borderWidth: 1, borderColor: '#E2E8F0' },
  chipText: { fontWeight: '800', fontSize: s(11) },
  recipeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: s(15), marginTop: s(10) },
  gridRecipe: { width: (width - 45) / 2, marginBottom: s(18) },
  skeletonContainer: { width: s(240), marginRight: s(15), backgroundColor: colors.white, borderRadius: s(16), overflow: 'hidden' },
  skeletonImage: { width: '100%', height: s(120) },
  skeletonInfo: { padding: s(10) },
  skeletonTitle: { width: '80%', height: s(12), borderRadius: s(4), marginBottom: s(6) },
  skeletonSubtitle: { width: '40%', height: s(8), borderRadius: s(4) },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: s(6), paddingVertical: s(2), borderRadius: s(10), marginLeft: s(8), borderWidth: 0.5, borderColor: '#10B981' },
  liveDot: { width: s(4), height: s(4), borderRadius: s(2), backgroundColor: '#10B981', marginRight: s(4) },
  liveTimeText: { fontSize: s(8), fontWeight: '800', color: '#047857' }
});

export default HomeScreen;
