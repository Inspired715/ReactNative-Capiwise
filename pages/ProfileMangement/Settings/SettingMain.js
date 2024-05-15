import React ,{useEffect} from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { SettingBellicon,SettingLanguage,SettingChangePassword,ArrowIcon} from "../../../assets/img/Constant"

const SettingMain = ({navigation}) => {
  //   const navigation = useNavigation();
  const handleCloseAccount = () => {
    // navigation.navigate(CloseAccount)
  };

  const handleNotification = () => {
    console.log("....")
    navigation.navigate("SettingNotifications")
  }

  const handleLanguage = () => {
    console.log("....")
    navigation.navigate("LannguageRegion")
  }

  const handlePassword = () => {
    console.log("....")
    navigation.navigate("SetNewPassword")
  }

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      // title: "Settings",
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#FFF', fontSize: 24  , marginLeft: -30}}>Settings</Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#040B11",
      },
      headerTintColor: "#FFF",
      // headerLeft: () => (
      //   <Ionicons
      //     name="chevron-back-outline"
      //     size={24}
      //     color="#FFF"
      //     onPress={() => navigation.goBack()}
      //   />
      // ),
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNotification}>
      <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={handleNotification}>
        {/* <Image 
          source={require("../../../assets/img/arrow.png")} // Replace with the path to your right-arrow icon image
          style={{ marginBottom: 10,
            width: 14,
            height: 14,
            marginRight: 2,}}
         
        /> */}
        <ArrowIcon/>
        </TouchableOpacity>
        <Text style={styles.sectionText}>Notifications</Text>
        {/* <Image 
          source={require("../../../assets/img/notifications_white.png")} // Replace with the path to your right-arrow icon image
          style={{marginBottom: 10,
            width: 17,
            height: 20,
            marginRight: 10,marginLeft:10}}
        /> */}
        <View  style={{marginBottom: 10,
            // width: 17,
            // height: 20,
            marginRight: 10,
            marginLeft:10
            }}>
        <SettingBellicon/>
        </View>
      </View>
      </TouchableOpacity>
      <View style={styles.horizontalLine} />

      <TouchableOpacity onPress={handleLanguage}>
      <View style={styles.sectionContainer}>
        <TouchableOpacity onPress={handleLanguage}>
        {/* <Image
          source={require("../../../assets/img/arrow.png")} // Replace with the path to your right-arrow icon image
          style={styles.arrowIcon}
        /> */}
         <ArrowIcon/>
        </TouchableOpacity>
        <Text style={styles.sectionText}>Language and region</Text>
        {/* <Image
          source={require("../../../assets/img/language.png")} // Replace with the path to your right-arrow icon image
          style={{marginBottom: 10,
            width: 16,
            height: 18,
            marginRight: 10,marginLeft:10}}
        /> */}
        <View 
         style={{marginBottom: 10,
          width: 16,
          height: 18,
          marginRight: 10,marginLeft:10}}
        >
          <SettingLanguage/>
        </View>
      </View>
      </TouchableOpacity>
      <View style={styles.horizontalLine} />

      <TouchableOpacity onPress={handlePassword}>
      <View style={styles.sectionContainer}>
        <TouchableOpacity onPress={handlePassword}>
        {/* <Image
          source={require("../../../assets/img/arrow.png")} // Replace with the path to your right-arrow icon image
          style={styles.arrowIcon}
        /> */}
        <ArrowIcon/>
        </TouchableOpacity>
        <Text style={styles.sectionText}>Change password</Text>
        {/* <Image
          source={require("../../../assets/img/change_pwd.png")} // Replace with the path to your right-arrow icon image
          style={{marginBottom: 10,
            width: 16,
            height: 18,
            marginRight: 10,marginLeft:10}}
        /> */}
        <View  style={{marginBottom: 10,
            width: 16,
            height: 18,
            marginRight: 10,marginLeft:10}}>
          <SettingChangePassword/>
        </View>
      </View>
      </TouchableOpacity>
      <View style={styles.horizontalLine} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040B11",
    paddingHorizontal: 10, // Set consistent padding for left and right
    paddingTop: 30, // Add padding to the top
    width:"100%"
  },
  profilePictureContainer: {
    flexDirection: "row", // Change to row to align items horizontally
    alignItems: "center", // Center the items vertically
    marginBottom: 20,
  },
  arrowIcon: {
    width:"100%",
    marginBottom: 10,
    width: 14,
    height: 14,
    paddingRight: 2, // Add some margin for space between the icon and text
  },
  profilePicture: {
    marginTop: 10,
    width: 60,
    height: 40,
    borderRadius: 35,
    marginRight: 10,
  },
  profileDetails: {
    width: 344,
    // marginRight:-10
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    color: "#FFF",
    textAlign: "center",
    // paddingRight:6
  },
  caption: {
    textAlign: "justify",
    fontSize: 10,
    fontWeight: "400",
    marginBottom: 20,
    color: "#FFF",
    width: 353,
    paddingRight: 18,
  },
  profile: {
    fontSize: 16,
    color: "#2EBD85",
  },
  sectionContainer: {
    width: "100%",
    // paddingLeft:-10,
    flexDirection: "row-reverse", // Change 'row' to 'row-reverse'
    alignItems: "center",
    marginLeft: 20,
    // paddingVertical: 10,
    marginTop: 20,
  },
  sectionIcon: {
    marginRight: 10, // Add some margin for space between the icon and text
  },
  sectionText: {
    textAlignVertical: "center",
    paddingRight: 30,
    marginTop: -5,
    marginBottom: 5,
    width: 300,
    color: "#FFF",
    fontSize: 14,
    flex: 1, // Allow text to take the remaining space
  },
  horizontalLine: {
    marginTop: 10,
    borderBottomColor: "#464646",
    borderBottomWidth: 1,
    width: "100%",
  },
});
export default SettingMain;






