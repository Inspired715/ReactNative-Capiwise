import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet,TouchableOpacity, ScrollView } from "react-native";
import { globalStyle} from "../../assets/css/globalStyle"
import { LinearGradient } from "expo-linear-gradient";
import Api from "../../api/Api";
import Loading from "../../components/loading/Loading"
import Toast from 'react-native-toast-message';

export default function First({ navigation, route }) {  
  const defaultFilter = {
    'type': [
      { 'status': false, 'label': 'Investor'},
      { 'status': false, 'label': 'Trader'},
      { 'status': false, 'label': 'Both'}
    ],
    'trading': [
      { 'status': false, 'label': 'US Stocks'},
      { 'status': false, 'label': 'Canadian Stocks'},
      { 'status': false, 'label': 'Asian Stocks'},
      { 'status': false, 'label': 'European Stocks'},
    ]
  }
  const [isLoading, setIsLoading] = useState(true)
  const [filterValues, setFilterValues] = useState(defaultFilter)
  const handleOption = (type, index, value) => {
    if (type == "type") {
      previous = [...defaultFilter.type]
      previous[index].status = !value
      setFilterValues(prevState => ({
        ...prevState,
        type: previous,
      }));
    } else {
      previous = [...defaultFilter.trading]
      previous[index].status = !value
      setFilterValues(prevState => ({
        ...prevState,
        trading: previous,
      }));
    }
  }

  const handleNext = async() => {
    var temp = {...filterValues}
    let myself = ""
    let trader = ""
    temp?.type?.forEach(item => {
      if(item.status){
        myself = item.label
      }
    })
    temp.trading.forEach(item => {
      if(item.status){
        trader = item.label
      }
    })

    if(myself == "" || trader == ""){
      Toast.show({
        type: 'Capiwise_Error',
        position:"top",
        text1: "",
        text2: 'Please select one of the options in each section'
      });

      return
    }
    let data = {
      "action": "add",
      "email": route?.params?.email,
      "mySelf" : myself,
      "Trader" : trader
    }

    await Api.profileFirst('profile_step1', data)
    .then((res) => {
      navigation.navigate("Second", {email:route?.params?.email})
    })
    .catch(e => console.log(e))
  }

  const getProfileFirst = async() => {
    let data = {
      "action": "get",
      "email": route?.params?.email
    }

    await Api.profileFirst('profile_step1', data)
    .then((res) => {
      if(res?.data[0]){
        let temp = {...filterValues}
        temp.type.map(item => {
          if(item.label == res?.data[0]?.mySelf){
            item.status = true
          }
        })
        temp.trading.map(item => {
          if(item.label == res?.data[0]?.Trader){
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
    getProfileFirst()
  }, [])

  return (
    <View style={styles.layout}>
      {isLoading?<Loading />:<>
      <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
        <View style={globalStyle.container}>
          <View style={styles.stepLine} />
          <View style={[styles.stepCircle, {left:52}]} />
          <LinearGradient
              colors={['#FFF', '#2EBD85']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{top:50, left:15, width: 44, height: 2, position:'absolute'}}
          />
          <View style={[globalStyle.justifyBetween, {paddingHorizontal:30, marginTop:10}]}>
            <Text style={{color: "#FFF", fontSize:10, fontWeight:"bold"}}>Step 1</Text>
            <Text style={styles.stepLabel}>Step 2</Text>
            <Text style={styles.stepLabel}>Step 3</Text>
          </View>
          <Text style={styles.title}>
            Profile
          </Text>
          <Text style={{fontSize: 16,color: "#979797",marginTop: 10,textAlign: "center",}}>
            Tell us about yourself so we can offer you a customized experience.
          </Text>
          <Text style={styles.subTitle}>
            I consider myself a/an:
          </Text>
          <View style={[globalStyle.justifyCenter, {marginTop:16, gap:16}]}>
          {filterValues?.type.map((item, index) => {
            return (
              <TouchableOpacity
                key={'filter' + index}
                style={[item.status ? styles.filterItemActive : styles.filterItemInActive]}
                onPress={() => handleOption("type", index, item.status)}
              >
                <Text style={[globalStyle.h5, {fontSize:16, fontWeight:item.status?"bold":'normal'}]}>{item.label}</Text>
              </TouchableOpacity>
            )
          })}
          </View>
          <Text style={styles.subTitle}>
            I like following and/or trading:
          </Text>
          <View style={[globalStyle.justifyCenter, {marginTop:16, gap:16}]}>
            <TouchableOpacity
              style={[filterValues?.trading[0].status ? styles.filterItemActive : styles.filterItemInActive, {width:164}]}
              onPress={() => handleOption("trading", 0, filterValues?.trading[0].status)}
            >
              <Text style={[globalStyle.h5, {fontSize:16, fontWeight:filterValues?.trading[0].status?"bold":'normal'}]}>{filterValues?.trading[0].label}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[filterValues?.trading[1].status ? styles.filterItemActive : styles.filterItemInActive, {width:164}]}
              onPress={() => handleOption("trading", 1, filterValues?.trading[1].status)}
            >
              <Text style={[globalStyle.h5, {fontSize:16, fontWeight:filterValues?.trading[1].status?"bold":'normal'}]}>{filterValues?.trading[1].label}</Text>
            </TouchableOpacity>
          </View>
          <View style={[globalStyle.justifyCenter, {marginTop:5, gap:16}]}>
            <TouchableOpacity
              style={[filterValues?.trading[2].status ? styles.filterItemActive : styles.filterItemInActive, {width:164}]}
              onPress={() => handleOption("trading", 2, filterValues?.trading[2].status)}
            >
              <Text style={[globalStyle.h5, {fontSize:16, fontWeight:filterValues?.trading[2].status?"bold":'normal'}]}>{filterValues?.trading[2].label}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[filterValues?.trading[3].status ? styles.filterItemActive : styles.filterItemInActive, {width:164}]}
              onPress={() => handleOption("trading", 1, filterValues?.trading[3].status)}
            >
              <Text style={[globalStyle.h5, {fontSize:16, fontWeight:filterValues?.trading[3].status?"bold":'normal'}]}>{filterValues?.trading[3].label}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => handleNext()}>
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
    width:104,
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
    width:104,
  },
  nextBtn:{
    borderRadius:50,
    height:50,
    gap:5, 
    alignItems:'center', 
    marginHorizontal:15,
    marginBottom:10
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
