import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors, s, spacing } from '../constant/theme';
import AppText from './AppText';

/**
 * SearchBar - A reusable search trigger or input field.
 * Currently implemented as a button that navigates to the Search screen.
 * 
 * @param {Object} props
 * @param {String} props.placeholder - Text to display in the bar
 * @param {Function} props.onPress - Action when the bar is tapped
 */
const SearchBar = ({ placeholder = "Search your favorite recipes...", onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.searchBar} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconPlaceholder} />
      <AppText color={colors.lightGray}>{placeholder}</AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    height: s(52),
    backgroundColor: colors.white,
    ...spacing.mx(20),
    borderRadius: s(12),
    flexDirection: 'row',
    alignItems: 'center',
    ...spacing.px(15),
    ...spacing.mb(25),
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconPlaceholder: {
    width: s(20),
    height: s(20),
    borderRadius: s(4),
    backgroundColor: colors.border,
    ...spacing.me(12),
  }
});

export default SearchBar;
