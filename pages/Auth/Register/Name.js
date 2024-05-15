import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,

} from "react-native";
import Toast from 'react-native-toast-message';
import { globalStyle } from "../../../assets/css/globalStyle"

export default function Name({ navigation }) {
    const [fullName, setFullName] = useState("");
    const handleContinue = () => {
        if(fullName.length == 0){
            Toast.show({
                type: 'Capiwise_Error',
                position:"top",
                text1: "",
                text2: `Please input full name.`
            })
            
            return
        }
        
        navigation.navigate("NameEmail", {
            fullName: fullName
        });
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
    return (
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
                        value={fullName}
                        maxLength={25}
                        onChangeText={(text) => setFullName(text)}
                    />
                </View>
                <TouchableOpacity onPress={handleContinue} style={styles.continueBtn}>
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
        marginTop: '40%'
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
        fontSize:14
    },
    continueBtn: {
        height: 50,
        backgroundColor: "#2EBD85",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        marginTop: 30
    }
});
