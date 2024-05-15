import React from "react";
import {
  View,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";

export default Loading = () => {
    return(
        <View style={{flex:1, justifyContent: 'center', position: 'relative',}}>
            <ActivityIndicator size={100} color="#2EBD85" />
            <View 
                style={{
                    backgroundColor:"#040B11", 
                    width:80, 
                    height:80, 
                    borderRadius:80, 
                    flexDirection:'row', 
                    justifyContent:'center', 
                    alignItems:'center',
                    position: 'absolute',
                    left:Dimensions.get("window").width / 2 - 40
                }}>
                    <Image 
                        source={require("../../assets/img/logo.png")}
                        style={{width:53, height:53,marginLeft:-8}}
                    />
            </View>
        </View>
    )
}