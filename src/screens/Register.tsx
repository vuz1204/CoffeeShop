import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {COLORS} from '../theme/theme';
import auth from '@react-native-firebase/auth';
import {MyTheme, useTheme} from '../theme/MyTheme';

const RegisterScreen = (props: any) => {
  const {navigation} = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const handleRegister = async () => {
    if (password !== retypePassword) {
      setErrorPassword('Passwords do not match');
      return;
    }

    try {
      await auth().createUserWithEmailAndPassword(email, password);
      navigation.goBack();
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
      <Text style={styles.registerText}>Register to continue</Text>
      <TextInput
        style={[
          styles.textInput,
          {
            color: theme === 'light' ? 'black' : 'white',
          },
        ]}
        placeholder="Email"
        placeholderTextColor={
          theme === 'light' ? 'black' : COLORS.primaryWhiteHex
        }
        onChangeText={text => setEmail(text)}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={[
          styles.textInput,
          {
            color: theme === 'light' ? 'black' : 'white',
          },
        ]}
        placeholder="Password"
        placeholderTextColor={
          theme === 'light' ? 'black' : COLORS.primaryWhiteHex
        }
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      <TextInput
        style={[
          styles.textInput,
          {
            color: theme === 'light' ? 'black' : 'white',
          },
        ]}
        placeholder="Re-type password"
        placeholderTextColor={
          theme === 'light' ? 'black' : COLORS.primaryWhiteHex
        }
        onChangeText={text => setRetypePassword(text)}
        value={retypePassword}
        secureTextEntry={true}
      />
      {errorPassword ? (
        <Text style={styles.errorText}>{errorPassword}</Text>
      ) : null}
      <TouchableOpacity style={styles.buttonRegister} onPress={handleRegister}>
        <Text style={styles.signUpText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.containerSignIn}>
        <Text style={styles.textBefore}>Forgot Password? click </Text>
        <Text
          style={styles.textAfter}
          onPress={() => {
            navigation.goBack();
          }}>
          Sign in
        </Text>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
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
    color: 'white',
    alignSelf: 'center',
    fontWeight: '700',
    fontSize: 16,
    marginTop: 10,
  },
  registerText: {
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
    borderColor: COLORS.secondaryGreyHex,
    marginTop: 20,
    color: 'white',
    paddingLeft: 14,
  },
  buttonRegister: {
    height: 55,
    backgroundColor: COLORS.primaryOrangeHex,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
  containerSignIn: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  textBefore: {
    color: 'grey',
  },
  textAfter: {
    color: COLORS.primaryOrangeHex,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
