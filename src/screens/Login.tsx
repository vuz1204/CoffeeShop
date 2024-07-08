import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../theme/theme';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {MyTheme, useTheme} from '../theme/MyTheme';

const LoginScreen = (props: any) => {
  const {navigation} = props;
  const [userInput, setUserInput] = useState({email: '', password: ''});

  const handleSignIn = async () => {
    try {
      await auth().signInWithEmailAndPassword(
        userInput.email,
        userInput.password,
      );
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '514681117807-ukdpu3e6aq53i9tt0tu22a80f7mojrft.apps.googleusercontent.com',
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await onGoogleButtonPress();
      navigation.navigate('TabNavigator');
    } catch (error) {
      console.error(error);
    }
  };

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error(error);
    }
  };

  const {theme, toggleTheme} = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme === 'light' ? '#F7F8FA' : COLORS.primaryBlackHex,
        },
      ]}>
      <Image
        source={require('../assets/app_images/logo.png')}
        style={styles.containerImg}
      />
      <Text
        style={[
          styles.welcomeText,
          {
            color: theme === 'light' ? 'black' : 'white',
          },
        ]}>
        Welcome to coffee shop !!
      </Text>
      <Text style={styles.loginText}>Login to continue</Text>
      <TextInput
        style={[
          styles.textInput,
          {
            color: theme === 'light' ? 'black' : 'white',
          },
        ]}
        placeholder="Email Address"
        placeholderTextColor={
          theme === 'light' ? 'black' : COLORS.primaryWhiteHex
        }
        onChangeText={email => setUserInput({...userInput, email})}
        value={userInput.email}
        keyboardType="email-address"
      />
      <TextInput
        style={[
          styles.textInput,
          {
            color: theme === 'light' ? 'black' : 'white',
            marginTop: 20,
          },
        ]}
        placeholder="Password"
        placeholderTextColor={
          theme === 'light' ? 'black' : COLORS.primaryWhiteHex
        }
        onChangeText={password => setUserInput({...userInput, password})}
        value={userInput.password}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.buttonLogin} onPress={handleSignIn}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonLoginWithGoogle}
        onPress={handleGoogleSignIn}>
        <Image
          style={styles.ImageSocial}
          source={{
            uri: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png',
          }}
        />
        <Text style={styles.textLoginWithGoogle}>Sign in with Google</Text>
      </TouchableOpacity>
      <View style={styles.containerRegisterAndReset}>
        <Text style={styles.textBefore}>Don't have account? click </Text>
        <Text
          style={styles.textAfter}
          onPress={() => navigation.navigate('Register')}>
          Register
        </Text>
      </View>
      <View style={[styles.containerRegisterAndReset, {marginTop: 20}]}>
        <Text style={styles.textBefore}>You have an account? click </Text>
        <Text style={styles.textAfter}>Reset</Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  containerImg: {
    width: 142,
    height: 142,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginTop: 50,
  },
  welcomeText: {
    fontFamily: 'Popins',
    alignSelf: 'center',
    fontWeight: '700',
    fontSize: 16,
    marginTop: 10,
  },
  loginText: {
    fontFamily: 'Popins',
    color: 'grey',
    alignSelf: 'center',
    fontWeight: '700',
    fontSize: 12,
    marginTop: 20,
  },
  textInput: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1d212a',
    marginTop: 40,
    color: 'white',
    paddingLeft: 14,
  },
  buttonLogin: {
    height: 57,
    backgroundColor: '#e46d37',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  signInText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
  buttonLoginWithGoogle: {
    height: 57,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    flexDirection: 'row',
  },
  ImageSocial: {
    width: 30,
    height: 30,
    marginEnd: 10,
  },
  textLoginWithGoogle: {
    color: 'black',
    fontWeight: 'bold',
  },
  containerRegisterAndReset: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
  },
  textBefore: {
    color: 'grey',
  },
  textAfter: {
    color: '#D17842',
  },
});
