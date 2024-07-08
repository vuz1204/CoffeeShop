import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS, SPACING} from '../theme/theme';
import {MyTheme, useTheme} from '../theme/MyTheme';

const HeaderProfile = () => {
  const {theme, toggleTheme} = useTheme();

  return (
    <View
      style={[
        styles.imageContainer,
        {
            borderColor:
            theme === 'light' ? '#d7d7d7' : COLORS.secondaryDarkGreyHex,
        },
      ]}>
      <Image
        source={require('../assets/app_images/avatar.png')}
        style={styles.image}
      />
    </View>
  );
};

export default HeaderProfile;

const styles = StyleSheet.create({
  imageContainer: {
    height: SPACING.space_36,
    width: SPACING.space_36,
    borderWidth: 2,
    borderRadius: SPACING.space_12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    height: SPACING.space_36,
    width: SPACING.space_36,
  },
});
