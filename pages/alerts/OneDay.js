import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

export default function OneDay() {
  const [timeZoneAPi, settimeZoneAPi] = useState([]);
  const [openLanguage, setOpenLanguage] = useState(false);
  const [valueLanguage, setValueLanguage] = useState("english"); // Set default value
  const [language, setLanguage] = useState([
    { label: "English (UK)", value: "english" },
  ]);
  const [text, setText] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };
  const toggleSwitch2 = () => {
    setIsEnabled2((previousState) => !previousState);
  };
  const handleTextChange = (newText) => {
    setText(newText);
  };

  const [openSignal, setOpenSignal] = useState(false);
  const [valueSignal, setValueSignal] = useState("");
  const [signal, setSignal] = useState([
    { label: "Price", value: "Price" },
    { label: "Price % Change (Daily)", value: "daily" },
  ]);
  const [openCondition, setOpenCondition] = useState(false);
  const [valueCondition, setValueCondition] = useState("");
  const [condition, setCondition] = useState([
    { label: "Is above", value: "above" },
    { label: "Is below", value: "below" },
  ]);

  const navigation = useNavigation();

  const fetchCitiesData = async () => {
    try {
      const response = await fetch("https://worldtimeapi.org/api/timezone");
      const data = await response.json();
      //   const mappedData = data.map((timezone) => ({ label: timezone, value: timezone }));
      //  console.log("....dtaa...",data)
      settimeZoneAPi(data);
    } catch (error) {
      console.error("Error fetching cities data:", error);
    }
  };

  useEffect(() => {
    // Fetch cities from the API
    fetchCitiesData();
  }, []);
  // console.log("....dtaa...",timeZoneAPi)

  const mappedTimeZones = timeZoneAPi.map((timezone) => ({
    label: timezone,
    value: timezone,
  }));

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text
          style={{
            color: "white",
            fontSize: 12,
            marginTop: 16,
          }}
        >
          Canceled after 180 days if not executed.
        </Text>
        <View style={styles.flex}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              marginBottom: 16,
              marginTop: 16,
            }}
          >
            Email
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#2EBD85" }}
            thumbColor={isEnabled ? "#FFF" : "#F4F3F4"}
            ios_backgroundColor="#3E3E3E"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={styles.switchContainer}
          />
        </View>
        <View style={styles.flex}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              // marginBottom: 16,
              marginTop: 16,
            }}
          >
            Push Notification
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#2EBD85" }}
            thumbColor={isEnabled2 ? "#FFF" : "#F4F3F4"}
            ios_backgroundColor="#3E3E3E"
            onValueChange={toggleSwitch2}
            value={isEnabled2}
            style={styles.switch}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#040B11",
    paddingHorizontal: 0,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#040B11",
    justifyContent: "flex-start",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    // paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#040B11",
    color: "#FFF",
    marginTop: 16,
    borderBottomColor: "#000000",
  },
  input: {
    height: 40,
    borderColor: "gray",
    color: "white",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#040B11",
    borderBottomColor: "#000000",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#979797",
    borderRadius: 8,
    marginVertical: 10,
    zIndex: 2000,
    backgroundColor: "#FFF",
  },
  dropdown: {
    backgroundColor: "#040B11",
  },
  fixedContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#979797",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    zIndex: 6000,
    backgroundColor: "#0B1620",
  },
  dropdownText: {
    color: "black",
  },
});
