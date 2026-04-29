import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors, s, spacing } from '../../constant/theme';
import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import AppHeader from '../../components/AppHeader';
import { clearOldNotifications, markAllAsRead } from '../../redux/slices/notificationSlice';
import { BellIcon } from '../../assets/AppIcons';

const { width } = Dimensions.get('window');

const NotificationScreen = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.history);

  useEffect(() => {
    // Clear notifications older than 24h when opening the screen
    dispatch(clearOldNotifications());
    // Mark as read when seen
    return () => dispatch(markAllAsRead());
  }, [dispatch]);

  const renderItem = ({ item }) => {
    const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
      <View style={[styles.notificationCard, !item.read && styles.unreadCard]}>
        <View style={styles.iconCircle}>
          <AppText style={{ fontSize: s(16) }}>🍴</AppText>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.notifHeader}>
            <AppText variant="subtitle" style={styles.notifTitle}>{item.title}</AppText>
            <AppText variant="caption" color={colors.gray}>{time}</AppText>
          </View>
          <AppText variant="body" color={colors.gray} style={styles.notifBody}>{item.body}</AppText>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
    );
  };

  return (
    <ScreenContainer header={<AppHeader title="Notifications" showBack />}>
      <View style={styles.container}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <BellIcon />
            <AppText variant="subtitle" style={styles.emptyTitle}>No notifications today</AppText>
            <AppText variant="caption" color={colors.gray} style={styles.emptySubtitle}>
              We'll notify you when it's time to cook!
            </AppText>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  listContent: { padding: s(20) },
  notificationCard: { flexDirection: 'row', padding: s(16), backgroundColor: '#F8FAFC', borderRadius: s(20), marginBottom: s(15), borderLeftWidth: 4, borderLeftColor: colors.primary + '40', position: 'relative' },
  unreadCard: { backgroundColor: colors.primary + '05', borderLeftColor: colors.primary },
  iconCircle: { width: s(40), height: s(40), borderRadius: s(20), backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  textContainer: { flex: 1, marginLeft: s(15) },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: s(4) },
  notifTitle: { fontSize: s(14), fontWeight: '900', color: colors.dark },
  notifBody: { fontSize: s(12), lineHeight: s(18) },
  unreadDot: { width: s(8), height: s(8), borderRadius: s(4), backgroundColor: colors.primary, position: 'absolute', top: s(15), right: s(15) },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: s(50) },
  emptyTitle: { marginTop: s(20), fontWeight: '900', color: colors.dark },
  emptySubtitle: { textAlign: 'center', marginTop: s(8) }
});

export default NotificationScreen;
