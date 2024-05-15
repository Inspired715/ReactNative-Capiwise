import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyle } from "../../../assets/css/globalStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet } from "react-native";
import { EditPencil } from "../../../assets/img/Constant";
import Api from "../../../api/Api";
import Toast from "react-native-toast-message";

const AccountMain = () => {
  const [attributes, setAttributes] = useState([]);
  const [userEmail, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [editedValue, setEditedValue] = useState("");
  const [isModalVisible, setModalVisible] = useState(true);
  const [editingField, setEditingField] = useState("");
  const maxLength = 25;
  const translateY = useRef(new Animated.Value(500)).current; // Set the initial closed position
  const navigation = useNavigation();

  const handleTextChange = (text) => {
    if (text.length <= maxLength) {
      setEditedValue(text);
    }
  };
  const handleLocation = () => {
    navigation.navigate("AddLocation", { email: userEmail });
  };
  const handleprofile = () => {
    navigation.navigate("EditPhoto");
  };

  const handleSave = async () => {
    if (editedValue == "")
      return
    let data = {
      "email": userEmail,
      "key": editingField,
      "value": editedValue
    }

    await Api.updateAttributes(data)
      .then(async (res) => {
        if (res.status == "success") {
          toggleModal()
          Toast.show({
            type: 'Capiwise_Success',
            position:"top",
            text1: "Success",
            text2: res.message
          })

          await AsyncStorage.setItem("userAttribute", JSON.stringify(res.userAttributes));
          setAttributes(res.userAttributes)
        }
        else
          Toast.show({
            type: 'Capiwise_Error',
            position:"top",
            text1: "",
            text2: res.message
          });
      })
      .catch(e => console.log(e))
  };


  const toggleModal = () => {
    const toValue = isModalVisible ? 500 : 0; // If modal is open, close it; otherwise, open it

    Animated.timing(translateY, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setModalVisible(!isModalVisible); // Toggle the modal visibility
    setEditedValue(""); // Reset edited value
  };

  const handleEdit = useCallback(
    (field) => {
      setEditingField(field);
      toggleModal();
    },
    [toggleModal]
  );

  const getUserInfo = async () => {
    let email = await AsyncStorage.getItem("userEmail");
    setEmail(email)
    attr = await AsyncStorage.getItem("userAttribute");
    addr = await AsyncStorage.getItem("address");
    setAddress(addr)
    attr = JSON.parse(attr)
    setAttributes(attr)
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



  useFocusEffect(
    useCallback(() => {
      getUserInfo()
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.profilePictureContainer}>
        <TouchableOpacity onPress={handleprofile}>
          {attributes?.picture && attributes?.picture.charAt(0)=='h'? (
            <Image
              source={{ uri: attributes.picture }}
              style={styles.profilePicture}
            />
          ) : (
            <View style={[styles.initialsContainer, {backgroundColor: attributes.picture?attributes.picture:'#0F69FE' }]}>
              <Text style={styles.initials}>
                {attributes.given_name
                  ? attributes.given_name.charAt(0).toUpperCase()
                  : ""}
                {attributes.family_name
                  ? attributes.family_name.charAt(0).toUpperCase()
                  : ""}
              </Text>
            </View>
          )}
          <Image source={require("../../../assets/img/edit_photo.png")}
            style={{position:'absolute', right:0, top:94}}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionText}>Name</Text>
        <View style={styles.sectionRight}>
          <Text style={styles.caption}>{attributes.given_name} {attributes.family_name}</Text>
          <TouchableOpacity onPress={() => handleEdit("name")}>
            <EditPencil />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionText}>Nickname</Text>
        <View style={styles.sectionRight}>
          <Text style={styles.caption}>{attributes.nickname}</Text>
          <TouchableOpacity onPress={() => handleEdit("nickname")}>
            <EditPencil />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionText}>Phone</Text>
        <View style={styles.sectionRight}>
          <Text style={styles.caption}>{attributes.phone_number}</Text>
          <TouchableOpacity onPress={() => handleEdit("phone")}>
            <EditPencil />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionText}>Email</Text>
        <View style={styles.sectionRight}>
          <Text style={styles.caption}>{userEmail}</Text>
        </View>
      </View>
      <View style={styles.horizontalLine} />
      <TouchableOpacity onPress={handleLocation}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionText}>Location</Text>
          <View style={styles.sectionRight}>
            <Text style={[styles.caption, { color: "#FFF", }]}>{address != "" ? address : "Add location"}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Animated.View
        style={[styles.bottomSheet, { transform: [{ translateY }] }]}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            {`Enter your ${editingField === "name"
                ? "full name"
                : editingField === "nickname"
                  ? "nick name"
                  : editingField === "phone"
                    ? "phone number"
                    : ""
              }`}
          </Text>
        </View>
        <View style={styles.editContent}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.editInput}
              value={editedValue}
              onChangeText={handleTextChange}
              placeholderTextColor="#979797"
              maxLength={maxLength} // Set max length for TextInput
            />
            <Text style={styles.placeholder}>
              {maxLength - editedValue.length}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040B11",
    paddingHorizontal: 15,
    paddingTop: 30,
  },
  profilePictureContainer: {
    alignItems: "center",
    marginBottom: 20,
    position:'relative'
  },
  profilePicture: {
    width: 146,
    height: 146,
    borderRadius: 146,
  },
  initialsContainer: {
    width: 146,
    height: 146,
    borderRadius: 146,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 35,
    color: "#FFF",
    fontWeight: "700",
  },
  placeholder: {
    color: "#979797",
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0B1620",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#979797",
  },
  editContent: {
    alignItems: "center",
  },
  editInput: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#2EBD85",
    marginBottom: 20,
    fontSize: 16,
    color: "#FFF",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 30,
  },
  buttonText: {
    color: "#2EBD85",
    fontSize: 16,
  },
  sectionIcon: {
    marginRight: 10,
  },
  caption: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
  },
  sectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Dimensions.get("window").width - 160
  },
  sectionText: {
    width: 100,
    color: "#979797",
    fontSize: 16,
    textAlign: "left",
  },
  sectionContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10
  },
  horizontalLine: {
    marginTop: 10,
    borderBottomColor: "#464646",
    borderBottomWidth: 1,
    width: "100%",
  },
});

export default AccountMain;
