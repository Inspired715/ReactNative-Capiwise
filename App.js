import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Bottombar from './components/bottombar/Bottombar';
import Splash from "./pages/Auth/Splash"
import Login from "./pages/Auth/Login";
import Name from "./pages/Auth/Register/Name"
import VerifyUserScreen from "./pages/Auth/Register/VerifyUserScreen";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
import Confirmation from "./pages/ForgotPassword/Confirmation";
import Forgot from "./pages/ForgotPassword/Forgot";
import ChangePasswordByCode from "./pages/ForgotPassword/ChangePasswordByCode";
import ProfileScreen from "./pages/ProfileMangement/ProfileScreen";
import CloseAccount from "./pages/ProfileMangement/CloseAccount";
import First from "./pages/Stepper/First";
import Second from "./pages/Stepper/Second";
import Third from "./pages/Stepper/Third";
import ClosureAcc from "./pages/ProfileMangement/ClosureAcc";
import ContactUs from "./pages/ProfileMangement/ContactUs";
import CloseAccStep2 from "./pages/ProfileMangement/CloseAccStep2";
import CloseAccStep3 from "./pages/ProfileMangement/CloseAccStep3";
import CloseAccStep4 from "./pages/ProfileMangement/CloseAccStep4";
import MessegeSent from "./pages/alerts/MessageSent";
import SettingMain from "./pages/ProfileMangement/Settings/SettingMain";
import SettingNotifications from "./pages/ProfileMangement/Settings/SettingNotifications";
import AccountMain from "./pages/ProfileMangement/Account/AccountMain";
import EditPhoto from "./pages/ProfileMangement/Account/EditPhoto";
import AddLocation from "./pages/ProfileMangement/Account/AddLocation";
import LannguageRegion from "./pages/ProfileMangement/Settings/LannguageRegion";
import SetNewPassword from "./pages/ProfileMangement/Settings/SetNewPassword";
import TermsAndConditions from "./pages/Auth/TermsAndConditions";
import PrivacyPolicy from "./pages/Auth/PrivacyPolicy";
import ExploreSearch from "./pages/Explore/ExploreSearch";
import SummaryTab from "./pages/StockSummary/SummaryTab";
import EtfTab from "./pages/ETFSummary/EtfTab";
import CreateAlert from "./pages/alerts/CreateAlert";
import ManageAlerts from "./pages/alerts/ManageAlerts";
import NewsArticle from "./pages/news/NewsArticle";
import WatchListEdit from "./pages/watchlist/WatchListMainEdit";
import Toast from 'react-native-toast-message';
import { View, Text, StyleSheet } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { WhiteCheck, WarningCheckTriangle } from "./assets/img/Constant"
import NameEmail from './pages/Auth/Register/NameEmail';
import NameEamilPhone from './pages/Auth/Register/NameEamilPhone';
import NEPPassword from './pages/Auth/Register/NEPPassword';

const toastConfig = {
  Capiwise_Info: ({ text1, text2 }) => (
    <View style={styles.infoMessageBody}>
      <SimpleLineIcons name="exclamation" size={24} color="white" />
      <View style={{width:'90%'}}>
        <Text style={{fontSize:12, fontWeight:700, color:'#FFF'}}>{text1}</Text>
        <Text style={{fontSize:12, fontWeight:400, color:'#FFF'}}>{text2}</Text>
      </View>
    </View>
  ),
  Capiwise_Success: ({ text1, text2}) => (
    <View style={[styles.messageBody]}>
      <WhiteCheck />
      <Text style={styles.messageText}>
        <Text style={{ fontWeight: "bold" }}>
          {text1}&nbsp;
        </Text>{" "}
        {text2} &nbsp;
      </Text>
    </View>
  ),
  Capiwise_Error: ({ text1, text2}) => (
    <View style={[styles.messageBody, {backgroundColor:'#E2433B'}]}>
      <WarningCheckTriangle />
      <Text style={styles.messageText}>
        {text2} &nbsp;
      </Text>
    </View>
  ),
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
    <StatusBar style="light" backgroundColor='#040B11'/>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Name" component={Name} />
        <Stack.Screen name="NameEmail" component={NameEmail} />
        <Stack.Screen name="NameEamilPhone" component={NameEamilPhone} />
        <Stack.Screen name="NEPPassword" component={NEPPassword} />
        <Stack.Screen name="VerifyUserScreen" component={VerifyUserScreen} />
        <Stack.Screen name="Forgot" component={Forgot} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Confirmation" component={Confirmation} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="TermsAndConditions" component={TermsAndConditions}/>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen name="Second" component={Second} />
        <Stack.Screen name="Third" component={Third} />
        <Stack.Screen name="ChangePasswordByCode" component={ChangePasswordByCode} />
        <Stack.Screen name="CloseAccStep2" component={CloseAccStep2} />
        <Stack.Screen name="ContactUs" component={ContactUs} />
        <Stack.Screen name="CloseAccStep3" component={CloseAccStep3} />
        <Stack.Screen name="CloseAccStep4" component={CloseAccStep4} />
        <Stack.Screen name="ClosureAcc" component={ClosureAcc} />
        <Stack.Screen name="Profile2" component={ProfileScreen} />
        <Stack.Screen name="CloseAccount" component={CloseAccount} />
        <Stack.Screen name="MessegeSent" component={MessegeSent} />
        <Stack.Screen name="SettingMain" component={SettingMain} />
        <Stack.Screen name="SettingNotifications" component={SettingNotifications}/>
        <Stack.Screen name="AccountMain" component={AccountMain} />
        <Stack.Screen name="EditPhoto" component={EditPhoto} />
        <Stack.Screen name="AddLocation" component={AddLocation} />
        <Stack.Screen name="LannguageRegion" component={LannguageRegion} />
        <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
        <Stack.Screen name="ExploreSearch" component={ExploreSearch} />
        <Stack.Screen name="SummaryTab" component={SummaryTab} />
        <Stack.Screen name="EtfTab" component={EtfTab} />
        <Stack.Screen name="CreateAlert" component={CreateAlert} />
        <Stack.Screen name="ManageAlerts" component={ManageAlerts} />
        <Stack.Screen name="NewsArticle" component={NewsArticle} />
        <Stack.Screen name="WatchListEdit" component={WatchListEdit} />
        <Stack.Screen name="MainApp" component={Bottombar} />
      </Stack.Navigator>
    </NavigationContainer>
    <Toast config={toastConfig} />
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  messageBody:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor: "#007C4A",
    padding: 10,
    borderRadius: 5,
    width:'90%',
    marginTop:20,
  },
  messageText: {
    color: "white",
    marginLeft: 10,
  },
  infoMessageBody:{
    flexDirection:'row', 
    gap:8, 
    borderRadius:4, 
    width: '90%', 
    backgroundColor: '#0B1620', 
    padding:10
  }
})