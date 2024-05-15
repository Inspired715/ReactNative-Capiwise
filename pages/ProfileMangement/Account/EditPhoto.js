import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { DeleteIcon, CameraIcon, GalleryIcon } from "../../../assets/img/Constant"
import { globalStyle } from "../../../assets/css/globalStyle";
import Api from "../../../api/Api";
import Loading from "../../../components/loading/Loading";

const EditPhoto = () => {
  const translateY = useRef(new Animated.Value(0)).current;
  const [selectedColor, setSelectedColor] = useState('#0F69FE');
  const [selectedImage, setSelectedImage] = useState(null);
  const [userAttributes, setUserAttributes] = useState({});
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true)
  const colors = [
    "#0F69FE",
    "#3F7F61",
    "#5044A4",
    "#FFA412",
    "#FF5630",
    "#1C2A4B",
  ];

  const renderColorButton = (color, index) => {
    const isSelected = selectedColor === color;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setSelectedColor(color);
        }}
        style={[
          styles.colorButton,
          { backgroundColor: color, borderColor: isSelected ? '#FFF' : 'transparent' },
        ]}
      />
    );
  };

  const pickImage = async () => {
    try {
      await AsyncStorage.removeItem("userImage");

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if(result.assets){
        await uploadToServer(result.assets)
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const pickCameraImage = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if(result.assets){
        await uploadToServer(result.assets)
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const uploadToServer = async (params) => {
      const response = await fetch(params[0].uri);
      const blob = await response.blob();
      let mail = await AsyncStorage.getItem("userEmail")
      let data = {
        "email": mail,
        "fileName": Date.now() + ".jpeg",
        "fileType": "image/jpeg"
      }

      setIsLoading(true)
      await Api.getPresignedURI(data)
      .then(async(res) => {
        if(res.status == "success"){              
          await fetch(res.preSignedUrl, {
              method: 'PUT',
              body: blob,
          })
          .then(async(r)=> {     
            setSelectedImage(res.permanentImageUrl)         
          })
          .catch(e => console.log(e))
        }else{
          console.log("Network error")
        }
      })
      .catch(e => console.log(e))  

      setIsLoading(false)
  }

  const updateAttributes = async(data) => {
    setIsLoading(true)
  
    let res = await Api.updateAttributes(data)
    .then(async(res) => {
      await AsyncStorage.setItem("userAttribute", 
        JSON.stringify(res?.userAttributes)
      )
      return res.status
    })
    .catch(e => console.log(e))
        
    setIsLoading(true)
    return res
  }

  const handleDelete = async () => {
    let mail = await AsyncStorage.getItem("userEmail")
    let data ={
      "email": mail,
      "key": "picture",
      "value":"#0F69FE",
    }
    let res = await updateAttributes(data)
    if(res == "success")
        navigation.navigate('AccountMain')
    else
      Toast.show({
        type: 'Capiwise_Error',
        position:"top",
        text1: "",
        text2: res.message
      });
  };

  const loadUserAttributes = async() => {
    const attr = await AsyncStorage.getItem("userAttribute")
    
    let temp = JSON.parse(attr)
    if(temp?.picture?.charAt(0) == 'h')
      setSelectedImage(temp?.picture)
    else
      setSelectedColor(temp?.picture)
    setUserAttributes(JSON.parse(attr))
  }

  const handleUpdate = async() => {
    let value;
    if(selectedImage){
      value = selectedImage
    }else{
      value = selectedColor
    }
    let mail = await AsyncStorage.getItem("userEmail")
    
    await updateAttributes({
      "email": mail,
      "key": "picture",
      "value": value,
    })

    navigation.goBack()
  }

  useFocusEffect(
    useCallback(() => {
      setSelectedImage(null)
      loadUserAttributes();
      setIsLoading(false)
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      <View style={styles.actionBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}  style={styles.viewBtn}>
          <Text style={{color:'#FFF'}}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleUpdate()} style={styles.viewBtn}>
          <Text style={{color:'#FFF'}}>Done</Text>
        </TouchableOpacity>
      </View>
      {isLoading?
        <View style={{height:Dimensions.get("window").width - 30, width:'100%'}}>
          <Loading />
        </View>
        :
      <View style={[globalStyle.container]}>
        <View style={[styles.profileBox, { backgroundColor: selectedColor }]}>

          {selectedImage ? (
            <Image
              source={{ uri: selectedImage || '' }}
              style={{ width: "100%", height: "100%", borderRadius: 10 }}
            />
          ) : (
            <Text style={styles.initials}>
              {userAttributes.given_name ? userAttributes.given_name.charAt(0).toUpperCase() : ''}
              {userAttributes.family_name ? userAttributes.family_name.charAt(0).toUpperCase() : ''}
            </Text>
          )}
        </View>
      </View>
      }
      <View style={[globalStyle.container, {marginTop:10}]}>
        <Text style={{ color: "#FFF", fontSize: 16, letterSpacing: 1 }}>
          Choose a background
        </Text>
        <View style={styles.colorRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {colors.map(renderColorButton)}
          </ScrollView>
        </View>
      </View>
      <Animated.View style={[styles.bottomSheet, { transform: [{ translateY }] }]}>
        <View style={globalStyle.justifyBetween}>
          <Text style={styles.titleText}>Profile photo</Text>
          <TouchableOpacity onPress={handleDelete}>
            <DeleteIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconContainer} onPress={pickCameraImage}>
            <View style={styles.cameraBtn}>
              <CameraIcon />
            </View>
            <Text style={styles.caption}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer} onPress={pickImage}>
            <View style={styles.cameraBtn}>
              <GalleryIcon />
            </View>
            <Text style={styles.caption}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "500",
    marginRight: 10
  },
  colorRow: {
    marginTop:10,
    width: Dimensions.get("window").width - 30,
    flexDirection: "row",
    justifyContent: "start",
  },
  colorButton: {
    width: 80,
    height: 80,
    borderRadius: 4,
    borderWidth: 2,
    marginRight:10
  },
  profileBox: {
    width: Dimensions.get("window").width - 30,
    height: Dimensions.get("window").width - 30,
    borderRadius: 10,
    backgroundColor: "#2EBD85",
    justifyContent: "center",
    alignItems:'center',
    flexDirection:'row'
  },
  initials: {
    fontWeight: "700",
    fontSize: 150,
    color: "#FFF",
  },
  bottomSheet: {
    height: 200,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0B1620",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
  },
  iconRow: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 40,
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: "center",
  },
  caption: {
    marginTop: 5,
    color: "#FFF",
    fontSize: 16
  },
  cameraBtn:{
    width: 60,
    height: 60,
    padding: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#FFF",
    justifyContent: "center", // Center the content vertically
    alignItems: "center",
  },
  viewBtn: {
    width: 74,
    height: 24,
    backgroundColor: '#2EBD85',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionBar:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:50, 
    height:30,
    paddingHorizontal:15,
    marginBottom:10
  }
});

export default EditPhoto;