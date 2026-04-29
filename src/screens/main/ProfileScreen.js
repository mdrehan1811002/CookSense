import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { colors, s } from '../../constant/theme';
import AppText from '../../components/AppText';
import ScreenContainer from '../../components/ScreenContainer';
import AppHeader from '../../components/AppHeader';
import { ChevronIcon, UserIcon, SettingsIcon } from '../../assets/AppIcons';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const menuItems = [
    { id: 1, title: 'App Settings', icon: <SettingsIcon />, onPress: () => alert('Settings updated!') },
    { id: 2, title: 'Help & Support', icon: '❓', onPress: () => alert('Support team will contact you!') },
  ];

  return (
    <ScreenContainer header={<AppHeader title="Profile" />}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Simple & Clean Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <UserIcon />
          </View>
          <AppText variant="title" style={styles.userName}>Master Chef</AppText>
          <AppText variant="caption" color={colors.gray}>chef.magic@cooksense.com</AppText>
        </View>

        {/* Minimal Menu */}
        <View style={styles.menuContainer}>
          {menuItems.map(item => (
            <TouchableOpacity key={item.id} style={styles.menuItem} activeOpacity={0.7} onPress={item.onPress}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIconBox}>
                  {typeof item.icon === 'string' ? <AppText>{item.icon}</AppText> : item.icon}
                </View>
                <AppText variant="body" style={styles.menuTitle}>{item.title}</AppText>
              </View>
              <ChevronIcon />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7} onPress={() => alert('Logged out!')}>
          <AppText variant="body" color={colors.danger} style={styles.logoutText}>Log Out</AppText>
        </TouchableOpacity>

      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: { padding: s(20) },
  profileHeader: { alignItems: 'center', marginBottom: s(40), marginTop: s(20) },
  avatarContainer: { width: s(90), height: s(90), borderRadius: s(45), backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: s(15) },
  userName: { fontSize: s(20), fontWeight: '900', color: colors.dark },
  menuContainer: { backgroundColor: '#F8FAFC', borderRadius: s(20), padding: s(10), marginBottom: s(30) },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: s(15), paddingHorizontal: s(15) },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIconBox: { width: s(36), height: s(36), borderRadius: s(10), backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', marginRight: s(15) },
  menuTitle: { fontWeight: '700', fontSize: s(14) },
  logoutBtn: { paddingVertical: s(15), alignItems: 'center', backgroundColor: colors.danger + '10', borderRadius: s(15) },
  logoutText: { fontWeight: '800' }
});

export default ProfileScreen;
