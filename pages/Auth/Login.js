import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

import { CheckBox } from 'react-native-elements';
import { Question } from "../../assets/img/Constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { globalStyle } from "../../assets/css/globalStyle"
import Api from "../../api/Api"
import Toast from 'react-native-toast-message';
import { emailValidation } from "../../utils/utils";

export default function Login() {
  const navigation = useNavigation();
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(
    require("../../assets/img/show_pwd.png")
  );
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showText, setShowText] = useState(false); // State to manage the visibility of the text

  const handleIconClick = () => {
    setShowText(!showText);
  };
  const handleRemberMe = () => {
    setRememberMe(!rememberMe)
    AsyncStorage.setItem("remember", rememberMe ? '0' : '1')
  }
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    const newIcon = showPassword
      ? require("../../assets/img/show_pwd.png")
      : require("../../assets/img/close_eye.png");

    setPasswordIcon(newIcon);
  };

  const handleSignUpPress = () => {
    navigation.navigate("Name");
  };
  const handleForgotPress = () => {
    navigation.navigate("Forgot");
  };

  const handleTerm = () => {
    navigation.navigate("TermsAndConditions");
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate("PrivacyPolicy");
  };

  const handleLogin = async() => {
    if(!emailValidation(email)){
      Toast.show({
        type: 'Capiwise_Error',
        position:"top",
        text1: "",
        text2: "Please input email correctly."
      })

      return
    }

    let data = {
      "email": email,
      "password": password
    }

    await Api.signIn(data)
    .then((res) => {
      if(res.status == "success"){
        AsyncStorage.setItem("userToken", res?.token)
        AsyncStorage.setItem("userEmail", email);
        AsyncStorage.setItem("userpassword", password);
        AsyncStorage.setItem("address", res?.userAttributes?.address?.formatted || "");
        
        AsyncStorage.setItem("userAttribute", 
          JSON.stringify(res?.userAttributes)
        )

        if(res.isStep < 2){
          navigation.navigate("First", {email:email})
          return
        }

        navigation.navigate("MainApp")
      }else{
        Toast.show({
          type: 'Capiwise_Error',
          position:"top",
          text1: "",
          text2: `We are sorry your mail or password does${"\n"}not match, please check your information.`
        })
      }
    })
    .catch(e => console.log(e))
  };

  const sessionInfo = async () => {
    try {
      const pwd = await AsyncStorage.getItem("userpassword");
      const mail = await AsyncStorage.getItem("userEmail");
      const remember = await AsyncStorage.getItem("remember");

      if (remember == '1') {
        setRememberMe(true)
        setPassword(pwd)
        setEmail(mail)
      } else
        setRememberMe(false)
    } catch (error) { console.log(error) }
  }
  useEffect(() => {
    sessionInfo()
  }, [])

  return (
    <View style={[globalStyle.container, { height: '100%', flexDirection: 'column', justifyContent: 'space-between' }]}>
      <View>
        <View style={styles.layout}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subTitle}>
            New to Capiwise?{" "}
            <Text style={{ color: "#2EBD85" }} onPress={handleSignUpPress}>
              Sign up
            </Text>
          </Text>
        </View>
        <View style={styles.layout}>
          <TextInput
            style={styles.input}
            placeholder="Your email address"
            placeholderTextColor="#979797"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <View style={[globalStyle.alignItemsCenter, { marginTop: 16 }]}>
            <TextInput
              style={[styles.input, { marginTop: 0 }]}
              placeholder="Your password"
              placeholderTextColor="#979797"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity onPress={toggleShowPassword}>
              <Image source={passwordIcon} style={{ width: 18, height: 9, marginLeft: -30 }} />
            </TouchableOpacity>
          </View>
          <View style={[globalStyle.alignItemsCenter, {marginTop:16, justifyContent:'space-between', width:'100%', paddingHorizontal:5}]}>
            <View style={globalStyle.alignItemsCenter}>
              <CheckBox
                containerStyle={styles.checkBox}
                checkedColor={'#2EBD85'}
                uncheckedColor={'#979797'}
                checked={rememberMe}
                onPress={() => handleRemberMe()}
              />
              <Text style={{color:'#FFF', fontSize:12, marginRight:10}}>Remember me &nbsp;</Text>
              <TouchableOpacity onPress={handleIconClick}>
                <Question />
              </TouchableOpacity>
            </View>
            <Text style={{color:'#2EBD85', fontSize:12}} onPress={handleForgotPress}>Forgotten my password?</Text>
          </View>
          {showText && (
            <View style={styles.textContainer}>
              <Text style={styles.textContent}>
                Your password will be remembered the next time you log in to
                your account.
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={{ width: '100%' }}>
        <TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
          <Text style={{ color: "#FFF", fontSize: 16 }}>Log in</Text>
        </TouchableOpacity>
        <View style={[globalStyle.justifyCenter, { gap: 5, marginTop: 30 }]}>
          <Text style={{ color: '#2EBD85', fontSize: 12 }} onPress={handleTerm}>Terms of use</Text>
          <Text style={{ color: '#FFF', fontSize: 12 }}>|</Text>
          <Text style={{ color: '#2EBD85', fontSize: 12 }} onPress={handlePrivacyPolicy}>Privacy policy</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  title: {
    color: "#FFF",
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: '30%'
  },
  subTitle: {
    fontWeight: '400',
    fontSize: 16,
    color: "#FFF",
  },
  input: {
    height: 50,
    borderColor: "#979797",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 80,
    width: '100%',
    paddingHorizontal: 10,
    color: "#FFF",
  },
  checkBox: {
    backgroundColor: '#040B11', padding: 0, marginLeft: 0
  },
  textContainer: {
    width: '100%',
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
  },
  textContent: {
    fontSize: 12,
    color: "#000",
  },
  loginBtn: {
    height: 50,
    backgroundColor: "#2EBD85",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  }
});
