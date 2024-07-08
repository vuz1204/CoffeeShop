import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { COLORS } from '../theme/theme';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';

const SplashScreen = (props: any) => {
  const { navigation } = props;
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setUser(user);
      if (initializing) setInitializing(false);
      if (!initializing) {
        const timer = setTimeout(() => {
          navigation.navigate(user ? 'TabNavigator' : 'Login');
        }, 3000);
        return () => clearTimeout(timer);
      }
    });

    return unsubscribe;
  }, [initializing, navigation]);

  if (initializing) return null;

  return (
    <View style={styles.Container}>
      <Image
        style={styles.Image}
        source={require('../assets/app_images/logo.png')}
      />
      <Text style={styles.studentInfo}>Họ tên: Nguyễn Văn Vũ</Text>
      <Text style={styles.studentInfo}>MSSV: PH33438</Text>
      <Text style={styles.studentInfo}>Lớp: MD18306</Text>
      <Text style={styles.coffeeShopInfo}>
        Chào mừng bạn đến với Coffee Shop - nơi bạn có thể thưởng thức những ly
        cà phê ngon và các món đồ uống hấp dẫn.
      </Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryWhiteHex,
  },
  Image: {
    width: 300,
    height: 300,
    marginVertical: 15,
  },
  studentInfo: {
    fontSize: 18,
    marginVertical: 10,
  },
  coffeeShopInfo: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
});
