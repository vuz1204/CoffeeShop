import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import {MyTheme, useTheme} from '../theme/MyTheme';
import HeaderIcon from '../components/HeaderIcon';
import auth, {firebase} from '@react-native-firebase/auth';

const SettingScreen = ({navigation}: any) => {
  const {theme, toggleTheme} = useTheme();

  const backHandler = () => {
    navigation.pop();
  };

  const handleSignOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const changePassword = () => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser && currentUser.email) {
      firebase
        .auth()
        .sendPasswordResetEmail(currentUser.email)
        .then(() => {
          Alert.alert('Password reset email sent');
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    } else {
      Alert.alert('User email not available');
    }
  };

  return (
    <View
      style={[
        styles.Container,
        {
          backgroundColor:
            theme === 'light' ? '#F7F8FA' : COLORS.primaryBlackHex,
        },
      ]}>
      <View style={styles.imageHeaderBarContainerWithBack}>
        <TouchableOpacity
          onPress={() => {
            backHandler();
          }}>
          <HeaderIcon
            name="left"
            color={COLORS.primaryLightGreyHex}
            size={FONTSIZE.size_16}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.TextSetting,
            {
              color: theme === 'light' ? COLORS.primaryBlackHex : '#F7F8FA',
            },
          ]}>
          Setting
        </Text>
        <View style={{width: 30}}></View>
      </View>
      {/* Thông tin cá nhân */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme === 'light' ? 'grey' : 'white',
            },
          ]}>
          Thông tin cá nhân
        </Text>
        <View
          style={[
            styles.infoBlock,
            {
              backgroundColor:
                theme === 'light' ? COLORS.secondaryLightGreyHex : 'white',
            },
          ]}>
          <Text style={{color: 'black'}}>Họ và tên: Nguyễn Văn Vũ</Text>
          <Text style={{color: 'black'}}>Mã sinh viên: PH33438</Text>
          <Text style={{color: 'black'}}>Lớp: MD18306</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme === 'light' ? 'grey' : 'white',
            },
          ]}>
          Thông tin điện thoại
        </Text>
        <View
          style={[
            styles.infoBlock,
            {
              backgroundColor:
                theme === 'light' ? COLORS.secondaryLightGreyHex : 'white',
            },
          ]}>
          <Text style={{color: 'black'}}>Loại điện thoại: LG</Text>
          <Text style={{color: 'black'}}>
            Cấu hình: Chip snapdragon, RAM 4GB, Bộ nhớ trong 64GB
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme === 'light' ? 'grey' : 'white',
            },
          ]}>
          Thiết lập riêng
        </Text>
        <View
          style={[
            styles.infoBlock,
            {
              backgroundColor:
                theme === 'light' ? COLORS.secondaryLightGreyHex : 'white',
            },
          ]}>
          <TouchableOpacity onPress={toggleTheme} style={styles.button}>
            <Text style={styles.buttonText}>Đổi theme</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOut} style={styles.button}>
            <Text style={styles.buttonText}>Đăng xuất</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={changePassword} style={styles.button}>
            <Text style={styles.buttonText}>Đổi mật khẩu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    padding: SPACING.space_15,
  },
  TextSetting: {
    fontSize: FONTSIZE.size_24,
    fontFamily: FONTFAMILY.poppins_semibold,
  },
  section: {
    marginTop: SPACING.space_20,
    marginBottom: SPACING.space_15,
  },
  sectionTitle: {
    fontSize: FONTSIZE.size_20,
    fontWeight: 'bold',
    marginBottom: SPACING.space_10,
  },
  infoBlock: {
    padding: SPACING.space_10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_20,
    borderRadius: 8,
    marginBottom: SPACING.space_10,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.poppins_semibold,
  },
  imageHeaderBarContainerWithBack: {
    flexDirection: 'row',
    marginTop: SPACING.space_15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
