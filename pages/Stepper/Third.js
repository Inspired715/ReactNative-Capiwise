import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet,TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { globalStyle} from "../../assets/css/globalStyle"
import { LinearGradient } from "expo-linear-gradient";
import Loading from "../../components/loading/Loading"
import Api from "../../api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SymbolList from "./SymbolList"
export default function Third({ navigation, route }) {
  const defaultSymbol = [
    {'symbol':'AAPL', 'name':'Apple Inc', 'logo':'https://api.twelvedata.com/logo/apple.com', 'isWatchlisted':false},
    {'symbol':'MSFT', 'name':'Microsoft Corporation', 'logo':'https://api.twelvedata.com/logo/microsoft.com', 'isWatchlisted':false},
    {'symbol':'AMZN', 'name':'Amazon.com  Inc', 'logo':'https://api.twelvedata.com/logo/aboutamazon.com', 'isWatchlisted':false},
    {'symbol':'GOOG', 'name':'Alphabet Inc', 'logo':'https://api.twelvedata.com/logo/abc.xyz', 'isWatchlisted':false},
    {'symbol':'FB', 'name':'Facebook Inc', 'logo':'https://logo.twelvedata.com/symbols/fb-meta.jpg', 'isWatchlisted':false},
    {'symbol':'TSLA', 'name':'Tesla Inc', 'logo':'https://api.twelvedata.com/logo/tesla.com', 'isWatchlisted':false},
    {'symbol':'JNJ', 'name':'Johnson & Johnson', 'logo':'https://api.twelvedata.com/logo/jnj.com', 'isWatchlisted':false},
    {'symbol':'V', 'name':'Visa Inc', 'logo':'https://api.twelvedata.com/logo/visa.com', 'isWatchlisted':false},
    {'symbol':'WMT', 'name':'Walmart Inc', 'logo':'https://api.twelvedata.com/logo/corporate.walmart.com', 'isWatchlisted':false},
    {'symbol':'JPM', 'name':'JPMorgan Chase & Co', 'logo':'https://api.twelvedata.com/logo/jpmorganchase.com', 'isWatchlisted':false},
  ]

  const [stocks, setStocks] = useState(defaultSymbol)
  const isLoading = false
  const rightValue = (Dimensions.get("window").width-75)

  const handleNext = async() => {
    let temp = []
    stocks.forEach(item => {
      if(item.isWatchlisted)
        temp.push(item.symbol)
    })

    data = {
      "action":"add",
      "email":route?.params?.email,
      "watchlist":temp
    }

    await Api.addWatch("", data)
    .then(async(response) => {
      try{
        let mail = await AsyncStorage.getItem("userEmail") || "";
        if(mail != route?.params?.email){
          navigation.navigate("Login")
        }else{
          navigation.navigate("MainApp")
        }
      }
      catch (error) {
          console.log(error)
      }
    })
    .catch((error) => {
        console.log(error)
    });
  }
  const handleWatchlist = (symbol, value) => {
    let temp = [...stocks]
    temp.forEach(item => {
      if(item.symbol == symbol)
        item.isWatchlisted = !value
    })

    setStocks(temp)
  }

  return (
    <View style={styles.layout}>
    {isLoading?<Loading />:
    <>
      <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
        <View style={globalStyle.container}>
          <View style={styles.stepLine} />
          <View style={[styles.stepCircle, {right:55}]} />
          <LinearGradient
              colors={['#FFF', '#2EBD85']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{top:50, left:15, width: rightValue, height: 2, position:'absolute'}}
          />
          <View style={[globalStyle.justifyBetween, {paddingHorizontal:30, marginTop:10}]}>
            <Text style={styles.stepLabel}>Step 1</Text>
            <Text style={styles.stepLabel}>Step 2</Text>
            <Text style={{color: "#FFF", fontSize:10, fontWeight:"bold"}}>Step 3</Text>
          </View>
          <Text style={styles.title}>
            Watchlist
          </Text>
          <Text style={{fontSize: 16,color: "#979797",marginTop: 10,textAlign: "center",}}>
            Select a few companies that you want to keep an eye on.
          </Text>
          <SymbolList data={stocks} callback={(symbol, value) => handleWatchlist(symbol, value)}/>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => handleNext()} style={{}}>
        <View style={[globalStyle.justifyCenter, styles.nextBtn, {backgroundColor:'#2EBD85'}]}>
            <Text style={{fontSize:16, color:'#FFF'}}>Next</Text>
        </View>
      </TouchableOpacity>
    </>
    }
    </View>
  );
}

const styles = StyleSheet.create({
  layout:{
    backgroundColor:'#040B11', 
    height:'100%'
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
  },
  nextBtn:{
    borderRadius:50,
    height:50,
    gap:5, 
    alignItems:'center', 
    marginHorizontal:15,
  },
});
