import React, {useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
// import Confirmation from "./Confirmation";
import { useNavigation } from "@react-navigation/native";
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from "amazon-cognito-identity-js";



const poolData = {
    UserPoolId: "eu-central-1_QukrjlcsL",
    ClientId: "709aci6kf266pekbf54u1b5icm",
  };
  
  const userPool = new CognitoUserPool(poolData);

export default function SetNewPassword({ route }) {
  const [otp, setOtp] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [newpassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setcurrentPassword] = useState("");
    const navigation = useNavigation();
  const toggleShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };
  const toggleShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };
  const toggleShowPassword3 = () => {
    setShowPassword3(!showPassword3);
  };
 
 
 
  const handleConfirmationPress = async () => {
    try {
      // Sign in the user first to get authentication details
      const authenticationData = {
        Username: 'krati123saxena@gmail.com',
        Password: currentPassword,
      };
      const authenticationDetails = new AuthenticationDetails(authenticationData);
  
      const userData = {
        Username: 'krati123saxena@gmail.com',
        Pool: userPool,
      };
  
      const cognitoUser = new CognitoUser(userData);
  
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          // The user is now authenticated, proceed with password change
          cognitoUser.changePassword(currentPassword, newpassword, (err, result) => {
            if (err) {
              console.error("Error changing password:", err);
  
              // Check if the error is due to incorrect current password
              if (err.code === "NotAuthorizedException") {
                Alert.alert("Error", "Incorrect current password");
              } else {
                Alert.alert("Error", "Failed to change password");
              }
            } else {
              console.log("Password changed successfully:", result);
              navigation.navigate("Confirmation");
            }
          });
        },
        onFailure: (err) => {
          console.error("Error authenticating user:", err);
  
          // Check if the error is due to incorrect current password
          if (err.code === "NotAuthorizedException") {
            Alert.alert("Error", "Incorrect current password");
          } else {
            Alert.alert("Error", "Authentication failed");
          }
        },
      });
    } catch (error) {
      console.error("Error confirming password:", error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  };
  
  
  
  // Replace this function with your custom logic to check the previous password
  const checkPreviousPassword = async (previousPassword) => {
    // Implement your logic to check the correctness of the previous password
    // You might need to use a pre-authentication Lambda trigger or a custom API call
    // Return true if the previous password is correct, otherwise return false
    return true;
  };
  
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Change Password",
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#FFF', fontSize: 24  , marginLeft: -30}}>Change Password</Text>
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
      <View style={styles.inputContainer}>
      <Text style={styles.label}>Current password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Current password"
            placeholderTextColor="#979797"
            secureTextEntry={!showPassword1}
            value={currentPassword}
            onChangeText={(text) => setcurrentPassword(text)}
          />
          <TouchableOpacity
            onPress={toggleShowPassword1}
            style={styles.passwordIconContainer}
          >
            <Image
              source={require("../../../assets/img/show_pwd.png")}
              style={styles.passwordIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter a new password"
            placeholderTextColor="#979797"
            secureTextEntry={!showPassword2}
            value={newpassword}
            onChangeText={(text) => setNewPassword(text)}
          />
          <TouchableOpacity
            onPress={toggleShowPassword2}
            style={styles.passwordIconContainer}
          >
            <Image
              source={require("../../../assets/img/show_pwd.png")}
              style={styles.passwordIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm new password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter the new password"
            placeholderTextColor="#979797"
            secureTextEntry={!showPassword3}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          <TouchableOpacity
            onPress={toggleShowPassword3}
            style={styles.passwordIconContainer}
          >
            <Image
              source={require("../../../assets/img/show_pwd.png")}
              style={styles.passwordIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
         onPress={handleConfirmationPress}
        style={{
          width: 338,
          height: 39,
          backgroundColor: "#2EBD85",
          marginTop: 80,
          marginBottom: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 50,
          borderWidth: 1,
        }}
      >
        <Text
          style={{ color: "#FFF", fontSize: 16 }}
        
        >
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040B11",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  inputContainer: {
    marginTop: 0,
    marginBottom: 20,
  },
  label: {
    color: "#2EBD85",
    fontSize: 16,
    marginTop: 18,
    marginBottom:-10
  },
  //   input: {
  //     height: 40,
  //     borderColor: "#979797",
  //     borderWidth: 1,
  //     borderRadius: 8,
  //     // marginTop: 90,
  //     paddingHorizontal: 10,
  //     width: 344,
  //     color: "#FFF",
  //   },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderColor: "#979797",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 25,
    paddingHorizontal: 10,
    width: 338,
    color: "#FFF",
  },
  passwordInput: {
    flex: 1,
    color: "#FFF",
    fontSize:16
  },
  passwordIcon: {
    width: 18,
    height: 8,
    marginLeft: 8,
    color: "#2EBD85",
  },
  alertIcon: {
    color: "#EDD375",
    marginLeft: 2,
    marginRight: 9,
    marginBottom: 25,
  },
  questionIcon: {
    marginLeft: 10,
    marginTop: 100,
  },
  rememberForgetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 338,
    marginTop: 20,
  },
  rememberForgetText: {
    color: "#979797",
    fontSize: 10,
    marginBottom: 3,
  },
  checkboxContainer: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#979797",
    borderRadius: 4,
    marginRight: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 340,
    marginTop: 20,
    marginBottom: 10,
    gap: 10,
  },
});


