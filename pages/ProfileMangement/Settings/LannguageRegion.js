import React, {useEffect, useState } from "react";
import { View, StyleSheet,Text ,TouchableOpacity} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LannguageRegion() {
    const [timeZoneAPi,settimeZoneAPi] = useState([])
  const [openLanguage, setOpenLanguage] = useState(false);
  const [valueLanguage, setValueLanguage] = useState("english"); // Set default value
  const [language, setLanguage] = useState([
    { label: "English (UK)", value: "english" },
  ]);

  const [openTime, setOpenTime] = useState(false);
  const [valueTime, setValueTime] = useState("mountain");
  const [time, setTime] = useState([
    { label: "(MT) Mountain Time", value: "mountain" },
    { label: "(CT) Central Time", value: "central" },
    { label: "(ET) Eastern Time", value: "eastern" },
  ]);
  const selectedLanguage = "English (UK)";
  const [openCurrency, setOpenCurrency] = useState(false);
  const [valueCurrency, setValueCurrency] = useState("usd");
  const [currency, setCurrency] = useState([
    { label: "Euro (EUR)", value: "euro" },
    { label: "United States Dollar (USD)", value: "usd" },
  ]);
  
  const navigation = useNavigation();

console.log("valueTime...",valueTime);
console.log("...valueCurrency..",valueCurrency);


  const fetchCitiesData = async () => {
        try {
          const response = await fetch(
            "https://worldtimeapi.org/api/timezone"
          );
          const data = await response.json();
        //   const mappedData = data.map((timezone) => ({ label: timezone, value: timezone }));
        //  console.log("....dtaa...",data)
         settimeZoneAPi(data)
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


      const handleBack = async () => {
        try {
          const emailData = await AsyncStorage.getItem("userEmail")
          console.log(".jghemail...",emailData);
          const response = await axios.post("https://api.dev.capiwise.com/settingLanguage", {
            email: emailData,
            setting_language_PT : valueTime,
            setting_language_US : valueCurrency
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

      
        navigation.setOptions({
          headerShown: true,
          title: "Language and region",
          // headerTitle: () => (
          //   <TouchableOpacity onPress={() => navigation.goBack()}>
          //     <Text style={{ color: '#FFF', fontSize: 24  , marginLeft: -30}}>Language and region</Text>
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
      <View style={[styles.fixedContainer, { marginTop: 10 }]}>
        <Text style={styles.dropdownText}>{selectedLanguage}</Text>
      </View>

      <DropDownPicker
  open={openTime}
  value={valueTime}
  items={mappedTimeZones}
  setOpen={setOpenTime}
  setValue={setValueTime}
  setItems={setTime}
  containerStyle={{
    flex: 1,
  flexDirection: 'column',
  marginTop: 10,
  zIndex: 3000,
  }}
  style={{
    backgroundColor: "#0B1620",
    borderWidth: 1,
    borderColor: "#979797",
    borderRadius: 8,
  }}
  dropDownContainerStyle={{
    backgroundColor: "#0B1620",
    borderWidth: 1,
    borderColor: "#979797",
    borderRadius: 8,
  }}
  zIndex={-2000}
  theme="DARK"
  listMode="FLATLIST"
  textStyle={styles.dropdownText}
/>

      <DropDownPicker
        open={openCurrency}
        value={valueCurrency}
        items={currency}
        setOpen={setOpenCurrency}
        setValue={setValueCurrency}
        setItems={setCurrency}
        containerStyle={{
            flex: 1,
          flexDirection: 'column',
          marginTop: 0,
          zIndex: 3000,
          }}
        style={styles.dropdown}
        zIndex={2000}
        theme="DARK"
        listMode="FLATLIST"
        textStyle={styles.dropdownText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1620",
    paddingTop: 30,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#979797",
    borderRadius: 8,
    marginVertical: 10,
    zIndex: 2000,
  },
  dropdown: {
    backgroundColor: "#0B1620",
  },
  fixedContainer: {
    marginBottom:10,
    borderWidth: 1,
    borderColor: "#979797",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    zIndex: 6000,
    backgroundColor: "#0B1620",
  },
  dropdownText: {
    color: "white",
  },
  dropdownText: {
    color: "white",
  },
});






