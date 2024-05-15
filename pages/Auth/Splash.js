import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { Google } from "../../assets/img/Constant";

export default function Splash({ navigation }) {
  const handleGetStartedPress = () => {
    navigation.navigate("Name");
  };
  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  return (
    <ImageBackground
      source={require("../../assets/img/start-screen-image.png")}
      style={{width:'100%', height:'100%'}}
    >
      <View style={styles.layout}>
        <View style={{paddingHorizontal:16}}>
          <Text style={[styles.title, {marginTop:95}]}>Invest with</Text>
          <Text style={styles.title}>confidence</Text>
          <Text style={[styles.subTitle, {marginTop:10}]}>The tool you need to make your money</Text>
          <Text style={styles.subTitle}>work harder for you</Text>
        </View>
        <View style={[styles.actionGroup]}>
          <TouchableHighlight style={styles.googleBtn} underlayColor="#4285F4">
            <>
            <Google style={{width:18, height:18}}/>
            <Text style={{color:'#040b11', fontSize:16, letterSpacing:0.1, fontWeight:'700'}}>Continue with Google</Text>
            </>
          </TouchableHighlight>
          <TouchableHighlight style={styles.emailBtn} underlayColor="#4285F4"  onPress={() => handleGetStartedPress()}>
            <Text style={{color:'#FFF', fontSize:16}}>Sign up with email</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.loginBtn} underlayColor="#4285F4" onPress={() => handleLoginPress()}>
            <Text style={{color:'#FFF', fontSize:16}}>Log in</Text>
          </TouchableHighlight>
        </View>
      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  layout:{
    height:'100%',
    flexDirection:'column',
    justifyContent:'space-between'
  },
  title:{
    color:'#FFF',
    fontSize:48,
    fontWeight:'bold',
    letterSpacing:1.09
  },
  subTitle:{
    color:'#FFF',
    fontSize:16,
    lineHeight:24,
    fontWeight:'bold',
  },
  actionGroup:{
    paddingHorizontal:16,
    marginBottom:40,
    flexDirection:'column',
    justifyContent:'space-between',
    alignItems:'center',
    gap:22
  },
  googleBtn:{
    width:'100%',
    backgroundColor:'#FFF',
    height:48,
    borderRadius:50,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    gap:10
  },
  emailBtn:{
    width:'100%',
    backgroundColor:'#2ebd85',
    height:48,
    borderRadius:50,
    justifyContent:'center',
    alignItems:'center'
  },
  loginBtn:{
    width:'100%',
    backgroundColor:'transparent',
    height:48,
    borderRadius:50,
    borderColor:'#979797',
    borderWidth:1,
    justifyContent:'center',
    alignItems:'center'
  }
});
