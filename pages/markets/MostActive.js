import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Loading from "../../components/loading/Loading"
import Api from "../../api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyle } from "../../assets/css/globalStyle"
import SymbolListAction from "./SymbolListAction"
import Toast from "react-native-toast-message";

export default function MostActive() {
  const [isLoading, setIsLoading] = useState(true)
  const [topTrends, setTopTrends] = useState([]);
  const handleWatchlist = async (symbol, value, type) => {
    let temp = []
    let message = ""
    temp.push(symbol)
    
    let token = await AsyncStorage.getItem("userToken")
    let mail = await AsyncStorage.getItem("userEmail")

    if(value){
      message = " has been removed to your watchlist"
      data = {
          "action":"delete",
          "email":mail,
          "watchlist":temp
      }
    }else{
      message = " has been added to your watchlist"
      data = {
          "action":"add",
          "email":mail,
          "watchlist":temp
      }
    }
    
    await updateWatchList(token, data, message, symbol, type)
  };

  const updateWatchList = async(t, d, msg, s, type) => {
    setIsLoading(true)
    await Api.addWatch(t, d)
    .then(async(response) => {
      getMarketData()
    })
    .catch((error) => {
        console.log(error)
    });

    Toast.show({
      type: 'Capiwise_Success',
      position:"top",
      text1: s,
      text2: msg
    })
  }

  const getMarketData = async () => {
    let token = await AsyncStorage.getItem("userToken");
    const mail = await AsyncStorage.getItem("userEmail");
    setIsLoading(true)
    await Api.getTopEarningStocks(token, mail, "active")
      .then(async (response) => {
        setTopTrends(response);
      })
      .catch((error) => {
        console.log(error)
      });

      setIsLoading(false)
  };

  useFocusEffect(
    useCallback(() => {
      getMarketData()
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      {isLoading?<Loading />:<>
      <View style={styles.header}>
        <Text style={{color:'#FFF', fontSize:10}}>
          View the top symbols with the most new watchers in the last 24 hours. Check back every hour for updates.
        </Text>
      </View>
      <View style={[globalStyle.justifyBetween, {paddingHorizontal:15, marginTop:16}]}>
        <View style={{width:'45%', flexDirection:'row', gap:50}}>
          <Text style={styles.gridHeader}>Rank</Text>
          <Text style={styles.gridHeader}>Symbol</Text>
        </View>
        <View style={[globalStyle.justifyBetween, {width:'55%'}]}>
          <Text style={[styles.gridHeader, {width:70}]}>Last price</Text>
          <Text style={styles.gridHeader}>% Change</Text>
          <Text style={styles.gridHeader}>Watch</Text>
        </View>
      </View>
      <View style={[styles.divider]} />
      <View>
        <SymbolListAction data={topTrends} callback={(symbol, value) => handleWatchlist(symbol, value, true)}/>
      </View>
      </>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#464646",
    width: "100%",
    marginTop: 13
  },
  header:{
    height:50, 
    borderRadius:5, 
    backgroundColor:'#0B1620', 
    marginHorizontal:15, 
    flexDirection:'row', 
    alignItems:'center', 
    paddingHorizontal:15,
    marginTop:5
  },
  gridHeader:{
    fontSize:10,
    color:'#FFF'
  }
});
