import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { colors, s, spacing } from '../constant/theme';
import AppText from './AppText';

const BackIcon = () => (
  <Svg width={s(24)} height={s(24)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={colors.dark}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AppHeader = ({ title, showBack = false, rightElement }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <BackIcon />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.titleContainer}>
          <AppText variant="title" style={styles.title} numberOfLines={1}>{title}</AppText>
        </View>
        <View style={styles.rightContainer}>
          {rightElement || <View style={styles.spacer} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    // Account for StatusBar height when it's translucent
    paddingTop: Platform.OS === 'ios' ? s(45) : (StatusBar.currentHeight || 0),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  content: {
    height: s(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...spacing.px(15),
  },
  leftContainer: { width: s(40) },
  backBtn: { width: s(40), height: s(40), justifyContent: 'center', alignItems: 'flex-start' },
  titleContainer: { flex: 1, alignItems: 'center' },
  title: { fontSize: s(18), fontWeight: '800', color: colors.dark },
  rightContainer: { width: s(40), alignItems: 'flex-end', justifyContent: 'center' },
  spacer: { width: s(40) }
});

export default AppHeader;
