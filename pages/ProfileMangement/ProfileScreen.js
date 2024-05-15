import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, Linking  } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./ProfileCss/ProfileScreenCss";
import CloseAccount from "./CloseAccount";
import { Account, Setting, Alert, HelpCenter, TermAndCondition, PrivacyPolicy, LogOut, Closeaccount } from "../../assets/img/Constant"
import { globalStyle } from "../../assets/css/globalStyle"

const ProfileScreen = () => {
  const [userAttributes, setUserAttributes] = useState({});
  const navigation = useNavigation();
  const handleCloseAccount = () => {
    navigation.navigate(CloseAccount)
  }
  const handleSetting = () => {
    navigation.navigate("SettingMain")
  }
  const handleAlerts = () => {
    navigation.navigate("ManageAlerts")
  }
  const handleTermsConditions = () => {
    navigation.navigate("TermsAndConditions")
  }
  const handlePrivacy = () => {
    navigation.navigate("PrivacyPolicy")
  }
  const handleAccount = () => {
    navigation.navigate("AccountMain")
  }
  const handleLogout = () => {
    AsyncStorage.clear();
    navigation.navigate("Login")
  }
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={globalStyle.alignItemsCenter}>
          <Ionicons name="chevron-back-outline" size={24} color="#FFF" />
          <Text style={{ color: "#FFF", fontSize: 24 }}>
            Profile
          </Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#040B11",
      },
      headerTintColor: "#FFF",
    });
  }, [navigation]);

  const handleViewProfile = () => {
    navigation.navigate("AccountMain")
  }
  const handleeditphoto = () => {
    navigation.navigate("EditPhoto")
  }
  const loadUserAttributes = async() => {
    const userAttribute = await AsyncStorage.getItem("userAttribute")
    setUserAttributes(JSON.parse(userAttribute))
  }

  useFocusEffect(
    useCallback(() => {
      loadUserAttributes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.profilePictureContainer}>
        {userAttributes.picture && userAttributes?.picture.charAt(0)=='h' ? (
          <TouchableOpacity onPress={handleeditphoto}>
            <Image
              source={{ uri: userAttributes.picture }}
              style={styles.profilePicture}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleeditphoto} style={[styles.initialsContainer, {backgroundColor:userAttributes?.picture?userAttributes?.picture:'#0F69FE'}]}>
            <Text style={styles.initials}>
              {userAttributes.given_name ? userAttributes.given_name.charAt(0).toUpperCase() : ''}
              {userAttributes.family_name ? userAttributes.family_name.charAt(0).toUpperCase() : ''}
            </Text>
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.name}>{userAttributes.given_name} {userAttributes.family_name}</Text>
          <Text onPress={handleViewProfile} style={styles.profile}>View profile</Text>
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <View style={styles.sectionIcon}>
          <Account />
        </View>
        <Text style={styles.sectionText} onPress={handleAccount}>Account</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.sectionContainer}>
        <View style={styles.sectionIcon}>
          <Setting />
        </View>
        <Text style={styles.sectionText} onPress={handleSetting}>Settings</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.sectionContainer}>
        <View style={styles.sectionIcon}>
          <Alert />
        </View>
        <Text style={styles.sectionText} onPress={handleAlerts}>Alerts</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.sectionContainer}>
        <View style={styles.sectionIcon}>
          <HelpCenter />
        </View>
        <Text style={styles.sectionText} onPress={() => Linking.openURL('https://capiwise.com')}>
          Help center
        </Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.sectionContainer}>
        <View style={styles.sectionIcon}>
          <TermAndCondition />
        </View>
        <Text style={styles.sectionText} onPress={handleTermsConditions}>Terms and conditions</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.sectionContainer}>
        <View style={styles.sectionIcon}>
          <PrivacyPolicy />
        </View>
        <Text style={styles.sectionText} onPress={handlePrivacy}>Privacy Policy</Text>
      </View>
      <View style={styles.horizontalLine} />
      <TouchableOpacity onPress={handleLogout}>
        <View onPress={handleLogout} style={styles.sectionContainer}>
          <View style={styles.sectionIcon}>
            <LogOut />
          </View>
          <Text onPress={handleLogout} style={styles.sectionText}>Log out</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.horizontalLine} />
      <View style={styles.sectionContainer}>
        <View style={styles.sectionIcon}>
          <Closeaccount />
        </View>
        <Text style={{ fontSize: 16, color: "#E2433B" }} onPress={handleCloseAccount}>
          Close your account
        </Text>
      </View>
    </View>
  );
};

export default ProfileScreen;
