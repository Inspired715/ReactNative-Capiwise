import React, { useEffect, useState } from "react";
import {
  View,
  useWindowDimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import OneDay from "./OneDay";
import Gtc from "./Gtc";
import { globalStyle} from "../../assets/css/globalStyle"

export default function CreateAlert() {
  const [text, setText] = useState("");
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
  const [modalVisible, setModalVisible] = useState(false);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "During one day" },
    { key: "second", title: "GTC" },
  ]);

  const handleTextChange = (newText) => {
    setText(newText);
  };

  const handleContact = () => {
    setModalVisible(true);
  };

  const renderScene = SceneMap({
    first: OneDay,
    second: Gtc,
  });

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitle: () => (        
        <TouchableOpacity onPress={() => navigation.goBack()} style={globalStyle.alignItemsCenter}>
          <Ionicons name="chevron-back-outline" size={24} color="#FFF"/>
          <Text style={{ color: "#FFF", fontSize: 24}}>
            Create Alert
          </Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#040B11",
      },
      headerTintColor: "#FFF",
    });
  }, [navigation]);

  const renderTabBar = (props) => (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      <Text style={[styles.heading, { fontSize: 16 }]}>Alert Type</Text>
      <View style={styles.tabBar}>
        <ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {props.navigationState.routes.map((route, index) => {
              const isFocused = index === props.navigationState.index;
              return (
                <TouchableOpacity
                  key={route.key}
                  style={[styles.tabItem, isFocused && styles.tabItemFocused]}
                  onPress={() => {
                    setIndex(index);
                  }}
                >
                  <Text style={styles.tabItemText}>{route.title}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </ScrollView>
      </View>
    </ScrollView>
  );

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      <View style={globalStyle.container}>
        <View style={globalStyle.flexRow}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              marginBottom: 16,
              marginTop: 16,
            }}
          >
            Symbol
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              marginBottom: 16,
              marginTop: 16,
            }}
          >
            QQQ (Invesco QQQ Trust)
          </Text>
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
            Last price
          </Text>
          <Text
            style={{
              color: "#2EBD85",
              fontSize: 16,
              // marginBottom: 16,
              marginTop: 16,
              letterSpacing: 1,
            }}
          >
            +0.07 (+0.02%)
          </Text>
        </View>
        <View style={styles.flex}>
          <Text
            style={{
              color: "white",
              fontSize: 20,
              marginBottom: 16,
              marginTop: 16,
              fontWeight: "bold",
            }}
          >
            $315.50{" "}
            <Text
              style={{
                color: "white",
                fontSize: 12,
              }}
            >
              USD{" "}
            </Text>
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              marginBottom: 16,
              marginTop: 16,
              letterSpacing: 1,
            }}
          >
            Data as of Mar 10, 2023
          </Text>
        </View>
        <Text
          style={{
            color: "white",
            fontSize: 16,
            marginBottom: 16,
            marginTop: 16,
          }}
        >
          Signal
        </Text>
        <DropDownPicker
          open={openSignal}
          value={valueSignal}
          items={signal}
          setOpen={setOpenSignal}
          setValue={setValueSignal}
          setItems={setSignal}
          containerStyle={{
            borderWidth: 1,
            borderColor: "#979797",
            borderRadius: 8,
            zIndex: 9000,
          }}
          style={styles.dropdown}
          theme="DARK"
          placeholder={"select"}
          listMode="FLATLIST"
          // textStyle={styles.dropdownText}
          dropdownText={{ color: "#000" }}
          dropDownContainerStyle={{ backgroundColor: "white" }}
          itemStyle={{ color: "#000" }}
        />
        <Text
          style={{
            color: "white",
            fontSize: 16,
            marginTop: 16,
            marginBottom: 16,
          }}
        >
          Condition
        </Text>
        <DropDownPicker
          open={openCondition}
          value={valueCondition}
          items={condition}
          setOpen={setOpenCondition}
          setValue={setValueCondition}
          setItems={setCondition}
          placeholder={"select"}
          containerStyle={{
            borderWidth: 1,
            // backgroundColor: "white",
            borderColor: "#979797",
            borderRadius: 8,
            zIndex: 8000,
          }}
          style={styles.dropdown}
          zIndex={2000}
          theme="DARK"
          listMode="FLATLIST"
          // textStyle={}
          dropDownContainerStyle={{
            backgroundColor: "white",
            color: "black",
            textColor: "black",
          }}
        />
        <View style={styles.inputContainer}>
          <Text style={{ color: "white", fontSize: 16, marginBottom: 16 }}>
            Value
          </Text>

          <TextInput
            style={[styles.input, { borderBottomColor: "white" }]}
            keyboardType="number-pad"
            borderColor={"white"}
            borderWidth={0}
            placeholder="Enter a value"
            value={text}
            textColor="white"
            onChangeText={handleTextChange}
            color="white"
          />
        </View>
        <View style={{ height: "100vh" }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            // initialLayout={{ width: 100 }}
            renderTabBar={renderTabBar}
          />
        </View>
      </View>
      <View style={globalStyle.justifyCenter}>
        <TouchableOpacity
          onPress={handleContact}
          style={{
            width: '90%',
            height: 45,
            backgroundColor: "#2EBD85",
            marginTop: 90,
            marginBottom: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
            borderWidth: 1,
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 18 }}>Save alert</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          {/* Modal content */}
          <View style={styles.modalBox}>
            <Text
              style={[styles.modalText, { fontWeight: "bold", fontSize: 20 }]}
            >
              Disclosure
            </Text>
            <Text style={styles.modalText}>
              This information does not constitute any form of investment advice
              and it should not be used to make any investment decision.
            </Text>
            <Text style={styles.modalText}>
              Please read our{" "}
              <Text style={{ color: "#2EBD85" }}>Terms of Service</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    // marginBottom:50,
    borderRadius: 20,
    backgroundColor: "#0B1620",
  },
  tabItem: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    marginRight: 10,
    // marginBottom:30,
    borderRadius: 20,
  },
  tabItemFocused: {
    width: "auto",
    backgroundColor: "#2EBD85",
  },
  tabItemText: {
    // width:100,
    color: "#FFF",
    fontSize: 15,
  },
  indicator: {
    backgroundColor: "#2EBD85", // Set indicator color
    height: 48,
    marginLeft: 25,
    width: 110,
    borderRadius: 40,
    // textAlign:"center"
  },
  saveButton: {
    width: 343,
    height: 45,
    backgroundColor: "#2EBD85",
    marginTop: 90,
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 1,
    alignSelf: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent black background
  },
  modalBox: {
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  modalText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    width: 120,
    backgroundColor: "#2EBD85",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
  label: {
    alignItems: "center",
    textTransform: "none",
    fontWeight: "normal",
    color: "#FFF", // Default text color
    fontSize: 15,
    marginLeft: 150,
    width: 180, // Set the width of the label
    // textAlign: "right", // Center the text within the label
  },
  heading: {
    color: "#FFF",
    fontFamily: "Roboto",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
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
