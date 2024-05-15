import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView
} from "react-native";

import { globalStyle } from "../../../assets/css/globalStyle"
import PhoneInput from 'react-native-international-phone-number';
import Toast from 'react-native-toast-message';
import Api from "../../../api/Api";
import { emailValidation } from "../../../utils/utils";

export default function NEPPassword({ navigation, route }) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState("")
    const [passwordIcon, setPasswordIcon] = useState(
        require("../../../assets/img/show_pwd.png")
      );
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [securityStatus, setSecurityStatus] = useState(0)

    const validatePassword = (str) => {
        if (str.length < 10) {
            return 0;
        }
        if (!/[a-z]/.test(str)) {
            return 0;
        }
        if (!/[A-Z]/.test(str)) {
            return 1;
        }
        if (!/\d/.test(str)) {
            return 1;
        }
        if (!/[!@#$%^&*()\-_=+{};:,<.>]/.test(str)) {
            return 2;
        }
            
        return 2;
    }

    const handleChangePassword = (pwd) => {
        setSecurityStatus(validatePassword(pwd))
        setPassword(pwd)
    }
    const handleContinue = async() => {
        if(!emailValidation(email)){
            Toast.show({
                type: 'Capiwise_Error',
                position:"top",
                text1: "",
                text2: `Please input email address correctly.`
            })
      
            return
        }

        if(fullName.length == 0 || phoneNumber.length==0){
            Toast.show({
                type: 'Capiwise_Error',
                position:"top",
                text1: "",
                text2: `Please input name or phone number.`
            })
            return
        }
        
        if(password != confirmPassword){
            Toast.show({
                type: 'Capiwise_Error',
                position:"top",
                text1: "",
                text2: `The password doesn't match.`
            });
            
            return
        }

        let params = {
            "email": email,
            "password": password,
            "firstName": fullName.split(" ")[0],
            "lastName": fullName.split(" ")[1],
            "phone": (selectedCountry.callingCode + phoneNumber).replaceAll(' ', '')
        }

        await Api.signUp(params)
        .then((res) => {
            if(res.status == 'success')
                navigation.navigate("VerifyUserScreen", params);
            else
                Toast.show({
                    type: 'Capiwise_Error',
                    position:"top",
                    text1: "",
                    text2: res.message
                });
        })
        .catch(e => console.log(e))
    }
    const handleTerm = () => {
        navigation.navigate("TermsAndConditions");
    };
    const handlePrivacyPolicy = () => {
        navigation.navigate("PrivacyPolicy");
    };
    const handleLoginPress = () => {
        navigation.navigate("Login");
    };
    const handleInputValue = (p) => {
        setPhoneNumber(p)
    }
    const handleSelectedCountry = (c) => {
        setSelectedCountry(c)
    }
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
        const newIcon = showPassword
          ? require("../../../assets/img/show_pwd.png")
          : require("../../../assets/img/close_eye.png");
    
        setPasswordIcon(newIcon);
    };

    useEffect(() => {
        setFullName(route?.params?.fullName)
        setEmail(route?.params?.email)
        setSelectedCountry(route?.params?.country)
        setPhoneNumber(route?.params?.phoneNumber)
    }, [])

    return (
        <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
        <View style={[globalStyle.container, { height: '100%', flexDirection: 'column', justifyContent: 'space-between' }]}>
            <View>
                <View style={styles.layout}>
                    <Text style={styles.title}>Create your account</Text>
                </View>
                <View style={styles.layout}>
                    <TextInput
                        style={styles.input}
                        placeholder="First and last name"
                        placeholderTextColor="#979797"
                        autoCapitalize="none"
                        maxLength={25}
                        value={fullName}
                        onChangeText={(text) => setFullName(text)}
                    />
                    <TextInput
                        style={[styles.input, { marginTop: 16 }]}
                        placeholder="Enter your email address"
                        placeholderTextColor="#979797"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <View style={{ marginTop: 16 }}>
                        <PhoneInput
                            value={phoneNumber}
                            onChangePhoneNumber={(p) => handleInputValue(p)}
                            selectedCountry={selectedCountry}
                            onChangeSelectedCountry={(c) => handleSelectedCountry(c)}
                            placeholder={"Enter your phone"}
                            phoneInputStyles={styles.phoneStyle}
                            defaultCountry={'US'}
                            modalStyles={styles.phoneModal}
                        />
                    </View>
                </View>
                <Text style={{color:securityStatus==0?'#E2433B':securityStatus==1?'#FFA412':'#2EBD85', textAlign:'right', marginTop:10}}>
                    {securityStatus==0?'Weak':securityStatus==1?'Average':'Strong'}
                </Text>
                <View style={[globalStyle.alignItemsCenter, {marginTop:5}]}>
                    <TextInput
                        style={[styles.input, {marginTop:0}]}
                        placeholder="Your password"
                        placeholderTextColor="#979797"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(text) => handleChangePassword(text)}
                    />
                    <TouchableOpacity onPress={toggleShowPassword}>
                        <Image source={passwordIcon} style={{width:18, height:9, marginLeft:-30}} />
                    </TouchableOpacity>
                </View>
                <View style={[globalStyle.justifyBetween, {marginTop:10 }]}>
                    <View style={{height:2, backgroundColor:securityStatus==0?'#E2433B':securityStatus==1?'#FFA412':'#2EBD85', width:'30%'}} />
                    <View style={{height:2, backgroundColor:securityStatus==1?'#FFA412':securityStatus==2?'#2EBD85':'#979797', width:'30%'}} />
                    <View style={{height:2, backgroundColor:securityStatus==2?'#2EBD85':'#979797', width:"30%"}} />
                </View>
                <Text style={{color:'#979797', marginTop:5}}>
                    To have a strong password it must contain a letter, a number and be minimum of 9 characters.
                </Text>
                <View style={[globalStyle.alignItemsCenter, {marginTop:20}]}>
                    <TextInput
                        style={[styles.input, {marginTop:0}]}
                        placeholder="Confirm password"
                        placeholderTextColor="#979797"
                        secureTextEntry={!showPassword}
                        value={confirmPassword}
                        onChangeText={(text) => setConfirmPassword(text)}
                    />
                    <TouchableOpacity onPress={toggleShowPassword}>
                        <Image source={passwordIcon} style={{width:18, height:9, marginLeft:-30}} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleContinue} style={[styles.continueBtn, {backgroundColor:securityStatus!=2?'#979797':'#2EBD85'}]} disabled={securityStatus!=2}>
                    <Text style={{ color: "#FFF", fontSize: 16 }}>Continue</Text>
                </TouchableOpacity>
                <View style={[globalStyle.justifyCenter, { gap: 10, marginTop: 30 }]}>
                    <Text style={{ color: '#FFF' }}>Already have an account?</Text>
                    <TouchableOpacity onPress={handleLoginPress}>
                        <Text style={{ color: '#2EBD85' }}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ width: '100%' }}>
                <View style={[globalStyle.justifyCenter, { gap: 5 }]}>
                    <Text style={{ color: '#2EBD85', fontSize: 12 }} onPress={handleTerm}>Terms of use</Text>
                    <Text style={{ color: '#FFF', fontSize: 12 }}>|</Text>
                    <Text style={{ color: '#2EBD85', fontSize: 12 }} onPress={handlePrivacyPolicy}>Privacy policy</Text>
                </View>
            </View>
        </View>
    </ScrollView>
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
        marginTop: '20%'
    },
    input: {
        height: 50,
        borderColor: "#979797",
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 30,
        width: '100%',
        paddingHorizontal: 10,
        color: "#FFF",
    },
    continueBtn: {
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        marginTop: 30
    },
    phoneStyle:{
        container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: '#979797',
        },
        flagContainer: {
            borderTopLeftRadius: 7,
            borderBottomLeftRadius: 7,
            backgroundColor: '#8888',
            justifyContent: 'center',
        },
        callingCode: {
            fontSize: 16,
            color: '#FFF',
        },
        divider: {
            backgroundColor: '#979797',
        },
        caret: {
            color: '#FFF',
            fontSize: 16,
        },
        input: {
            color: '#FFF',
            fontSize:14
        },
    },
    phoneModal:{
        modal: {
            backgroundColor: '#333333',
            borderWidth: 1,
        },
        backdrop: {},
        divider: {
            backgroundColor: 'transparent',
        },
        countriesList: {},
        searchInput: {
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#FFF',
            color: '#FFF',
            backgroundColor: '#333333',
            paddingHorizontal: 12,
            height: 46,
        },
        countryButton: {
            borderWidth: 1,
            borderColor: '#FFF',
            backgroundColor: '#666666',
            marginVertical: 4,
            paddingVertical: 0,
        },
        noCountryText: {},
        noCountryContainer: {},
        flag: {
            color: '#FFF',
            fontSize: 20,
        },
        callingCode: {
            color: '#FFF',
        },
        countryName: {
            color: '#FFF',
        },
    }
});
