import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet,TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { globalStyle} from "../../assets/css/globalStyle"
import { LinearGradient } from "expo-linear-gradient";
import Loading from "../../components/loading/Loading"
import Api from "../../api/Api";
import Toast from 'react-native-toast-message';

export default function Second({ navigation, route }) {
  const defaultFilter = [
    { 'status': false, 'label': 'Financials', 'width':105},
    { 'status': false, 'label': 'Banking', 'width':105},
    { 'status': false, 'label': 'Technology', 'width':105},
    { 'status': false, 'label': 'Healthcare', 'width':105},
    { 'status': false, 'label': 'Energy', 'width':105},
    { 'status': false, 'label': 'Education', 'width':105},
    { 'status': false, 'label': 'Retail', 'width':105},
    { 'status': false, 'label': 'Real State', 'width':105},
    { 'status': false, 'label': 'Entertainment', 'width':135},
  ]
  const [isLoading, setIsLoading] = useState(true)
  const leftValue = (Dimensions.get("window").width-30)/2 + 15
  const [filterValues, setFilterValues] = useState(defaultFilter)
  
  const handleOption = (index, value) => {
    let count = 0
    filterValues.forEach(element => {
      if(element.status)
      count++
    });
    if(count > 3 && value==false)
      return
    previous = [...filterValues]
    previous[index].status = !value
    
    setFilterValues(previous)
  }
  
  const handleNext = async() => {
    var temp = [...filterValues]
    let interestes = []
    
    temp?.forEach(item => {
      if(item.status){
        interestes.push(item.label)
      }
    })

    if(interestes.length == 0){
      Toast.show({
        type: 'Capiwise_Error',
        position:"top",
        text1: "",
        text2: 'Please select one option at least'
      });

      return
    }
    
    let data = {
      "action": "add",
      "email": route?.params?.email,
      "interest":interestes
    }

    await Api.profileFirst('profile_step2', data)
    .then((res) => {
      navigation.navigate("Third", {email:route?.params?.email})
    })
    .catch(e => console.log(e))
  }

  const getProfileSecond = async() => {
    let data = {
      "action": "get",
      "email": route?.params?.email
    }

    await Api.profileFirst('profile_step2', data)
    .then((res) => {
      if(res?.data[0]){
        interest = JSON.parse(res?.data[0].interest)
        let temp = [...filterValues]
        temp.map(item => {
          if(interest.includes(item.label)){
            item.status = true
          }
        })
  
        setFilterValues(temp)
      }
    })
    .catch(e => console.log(e))
    setIsLoading(false)
  }

  useEffect(() => {
    getProfileSecond()
  }, [])

  return (
    <View style={styles.layout}>
    {isLoading?<Loading />:<>
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      <View style={globalStyle.container}>
        <View style={styles.stepLine} />
        <View style={[styles.stepCircle, {left:leftValue-4}]} />
        <LinearGradient
            colors={['#FFF', '#2EBD85']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{top:50, left:15, width: leftValue-15, height: 2, position:'absolute'}}
        />
        <View style={[globalStyle.justifyBetween, {paddingHorizontal:30, marginTop:10}]}>
          <Text style={styles.stepLabel}>Step 1</Text>
          <Text style={{color: "#FFF", fontSize:10, fontWeight:"bold"}}>Step 2</Text>
          <Text style={styles.stepLabel}>Step 3</Text>
        </View>
        <Text style={styles.title}>
          Interests
        </Text>
        <Text style={{fontSize: 16,color: "#979797",marginTop: 10,textAlign: "center",}}>
          Tell us about which sectors are you more interested.
        </Text>
        <View style={[globalStyle.justifyCenter, {marginTop:40, flexWrap:'wrap', gap:7}]}>
        {filterValues?.map((item, index) => {
          return (
            <TouchableOpacity
              key={'filter' + index}
              style={[item.status ? styles.filterItemActive : styles.filterItemInActive, {width:item.width}]}
              onPress={() => handleOption(index, item.status)}
            >
              <Text style={[globalStyle.h5, {fontSize:16, fontWeight:item.status?"bold":'normal'}]}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
        </View>
      </View>
    </ScrollView>
    <TouchableOpacity onPress={() => handleNext()} style={{}}>
      <View style={[globalStyle.justifyCenter, styles.nextBtn, {backgroundColor:'#2EBD85'}]}>
          <Text style={{fontSize:16, color:'#FFF'}}>Next</Text>
      </View>
    </TouchableOpacity>
    </>}
  </View>
  );
}

const styles = StyleSheet.create({
  layout:{
    backgroundColor:'#040B11', 
    height:'100%'
  },
  filterItemActive: {
    borderRadius: 50,
    height: 40,
    justifyContent:'center',
    backgroundColor: '#0F69FE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:16,
    gap: 5
  },
  filterItemInActive: {
    borderRadius: 50,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    borderWidth: 1,
    borderColor: '#FFF',
    marginBottom:16,
  },
  nextBtn:{
    borderRadius:50,
    height:50,
    gap:5, 
    alignItems:'center', 
    marginHorizontal:15,
  },
  stepLabel:{
    color: "#979797",
    fontSize:10
  },
  stepCircle:{
    width:8, 
    height:8, 
    borderRadius:8, 
    backgroundColor:'#2EBD85', 
    position:'absolute', 
    top:47
  },
  stepLine:{
    height:2, 
    backgroundColor:'#D9D9D9', 
    marginTop:50, 
    position: 'relative'
  },
  title:{
    color: "#FFF", 
    fontWeight: '700', 
    fontSize: 24, 
    marginTop: 40, 
    textAlign:'center' 
  },
  subTitle:{
    color: "#FFF", 
    fontSize: 16, 
    marginTop: 40, 
    textAlign:'center'
  }
});
