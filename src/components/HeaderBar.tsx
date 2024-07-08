import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import HeaderIcon from './HeaderIcon';
import HeaderProfile from './HeaderProfile';
import {useNavigation} from '@react-navigation/native';
import {MyTheme, useTheme} from '../theme/MyTheme';

interface HeaderBarProps {
  title?: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({title}) => {
  const navigation = useNavigation();
  const {theme, toggleTheme} = useTheme();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Setting');
        }}>
        <HeaderIcon
          name="menu"
          color={
            theme === 'light'
              ? '#FFFFFF'
              : COLORS.primaryLightGreyHex
          }
          size={FONTSIZE.size_16}
        />
      </TouchableOpacity>
      <Text style={styles.headerText}>{title}</Text>
      <HeaderProfile />
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  headerContainer: {
    padding: SPACING.space_30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryLightGreyHex,
  },
});
