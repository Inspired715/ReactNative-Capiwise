import React, { useEffect, useState } from "react";
import { View, Text, Switch, StyleSheet ,TouchableOpacity} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingNotifications = ({ title, caption }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const [isEnabled3, setIsEnabled3] = useState(false);
  const [isEnabled4, setIsEnabled4] = useState(false);

  const navigation = useNavigation();

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };
  const toggleSwitch2 = () => {
    setIsEnabled2((previousState) => !previousState);
  };
  const toggleSwitch3 = () => {
    setIsEnabled3((previousState) => !previousState);
  };
  const toggleSwitch4 = () => {
    setIsEnabled4((previousState) => !previousState);
  };

 
  //  console.log("....setting notification data...",isEnabled,isEnabled2,isEnabled3,isEnabled4);
  console.log("isEnabled:",isEnabled.toString());
  console.log("isEnabled2:", isEnabled2.toString());
  console.log("isEnabled3:", isEnabled3.toString());
  console.log("isEnabled4:", isEnabled4.toString());
 
  const handleBack = async () => {
    try {
      const emailData = await AsyncStorage.getItem("userEmail")
      console.log(".jghemail...",emailData);
      const response = await axios.post("https://api.dev.capiwise.com/settingNotification", {
        email: emailData,
        setting_noti_community:isEnabled.toString(),
        setting_noti_alerts: isEnabled2.toString(),
        setting_noti_announcement: isEnabled3.toString(),
        setting_noti_news: isEnabled4.toString(),
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });
  
      // Check if the response status is success (2xx range)
      if (response.status >= 200 && response.status < 300) {
        // If the response is successful, navigate to the "SettingMain" screen
        navigation.navigate("SettingMain");
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error.message);
      // Handle error here, such as displaying an error message to the user
    }
  };
  // console.log("Navigation Object:", navigation);

  // useEffect(() => {
  //   console.log("...dataeffect..")
  //   navigation.setOptions({
  //     headerShown: true,
  //     headerTitle: () => (
        
  //       <TouchableOpacity onPress={handleBack}>
  //         <Text style={{ color: '#FFF', fontSize: 24, marginLeft: -30 }}>Notifications</Text>
  //       </TouchableOpacity>
  //     ),
  //     headerStyle: {
  //       backgroundColor: "#040B11",
  //     },
  //     headerTintColor: "#FFF",
  //   });
  // }, [navigation]);

  navigation.setOptions({
    headerShown: true,
     title:"Notifications",
    // title: (
    //   <TouchableOpacity onPress={handleBack}>
  
    //     <Text style={{ color: "#FFF", fontSize: 24, marginLeft: -30 }}>Notifications</Text>
    //   </TouchableOpacity>
    // ),
    // headerTitle: () => (
    //   <TouchableOpacity onPress={handleBack}>
    //     <Text style={{ color: '#FFF', fontSize: 24  , marginLeft: -30}}>Notification</Text>
    //   </TouchableOpacity>
    // ),
    headerStyle: {
      backgroundColor: "#040B11",
    },
    headerTintColor: "#FFF",
    headerLeft: () => (
      <Ionicons
        name="arrow-back"
        size={24}
        color="#FFF"
        onPress={handleBack}
      />
    ),
  });
  

  return (
    <View style={styles.container}>
      <View style={styles.notificationSetting}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Community</Text>
          <Text style={styles.caption}>
            Receive notifications from the community, such as comments, likes,
            reposts, followers.
          </Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#2EBD85" }}
          thumbColor={isEnabled ? "#FFF" : "#F4F3F4"}
          ios_backgroundColor="#3E3E3E"
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={styles.switchContainer}
        />
      </View>
      <View style={styles.notificationSetting}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Alerts</Text>
          <Text style={styles.caption}>
            Receive notifications of the alerts you have placed for the
            companys.
          </Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#2EBD85" }}
          thumbColor={isEnabled2 ? "#FFF" : "#F4F3F4"}
          ios_backgroundColor="#3E3E3E"
          onValueChange={toggleSwitch2}
          value={isEnabled2}
          style={styles.switch}
        />
      </View>
      <View style={styles.notificationSetting}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Announcement</Text>
          <Text style={styles.caption}>
            Receive notifications about new features integrated in Capiwise.
          </Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#2EBD85" }}
          thumbColor={isEnabled3 ? "#FFF" : "#F4F3F4"}
          ios_backgroundColor="#3E3E3E"
          onValueChange={toggleSwitch3}
          value={isEnabled3}
        />
      </View>
      <View style={styles.notificationSetting}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>News</Text>
          <Text style={styles.caption}>
            Receive notifications about relevant news in the market.
          </Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#2EBD85" }}
          thumbColor={isEnabled4 ? "#FFF" : "#F4F3F4"}
          ios_backgroundColor="#3E3E3E"
          onValueChange={toggleSwitch4}
          value={isEnabled4}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#040B11",
    paddingHorizontal: 10,
    paddingTop: 30,
    flex: 1,
  },
  notificationSetting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    paddingTop: 30,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  caption: {
    width: 221,
    fontSize: 10,
    color: "#FFF",
    marginTop: 20,
  },
  switchContainer: {
    alignItems: "flex-end", // Align the switch to the end of the container
  },
});



export default  SettingNotifications ;







