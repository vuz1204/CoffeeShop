import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { COLORS } from '../theme/theme';
import LottieView from 'lottie-react-native';
import {MyTheme, useTheme} from '../theme/MyTheme';

interface PopUpAnimationProps {
  style: any;
  sourse: any;
}

const PopUpAnimation: React.FC<PopUpAnimationProps> = ({style, sourse}) => {
  const {theme, toggleTheme} = useTheme();

  return (
    <View style={[styles.lottieAnimationContainer, {backgroundColor: 
      theme === 'light' ? 'rgba(0,0,0,0.2)' : COLORS.secondaryBlackRGBA,
    }]}>
        <LottieView style={style} source={sourse} autoPlay loop={false} />
    </View>
  );
};

export default PopUpAnimation;

const styles = StyleSheet.create({
    lottieAnimationContainer:{
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        justifyContent: 'center',
    }
});
