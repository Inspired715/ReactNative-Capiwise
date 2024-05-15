import React, { useState, useEffect } from "react";
import { Text, Dimensions, View, StyleSheet, TouchableOpacity } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import Overview from './Overview';
import Analysis from './Analysis';
import FinancialHealth from './FinancialHealth';
import Dividend from './Dividend';
import { useRoute } from "@react-navigation/native";
import { globalStyle } from '../../assets/css/globalStyle';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../../api/Api";
import Loading from "../../components/loading/Loading"
import { Notfind } from "../../assets/img/Constant"
import { useNavigation } from "@react-navigation/native";

export default function SummaryTab() {
  const route = useRoute();
  const navigation = useNavigation()
  const selectedSymbol = route.params?.data;
  const [stockSummary, setStockSummary] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [netWorkError, setNetWorkError] = useState(false)
  const [index, setIndex] = useState(route.params?.data.activeTab?route.params?.data.activeTab:0);
  const [routes, setRoutes] = useState([
    { key: 'first', title: 'Overview', symbol: selectedSymbol.key,display:true },
    { key: 'second', title: 'Analysis', symbol: selectedSymbol.key, display:true },
    { key: 'third', title: 'Financial health', symbol: selectedSymbol.key, display:true },
    { key: 'fourth', title: 'Dividend', symbol: selectedSymbol.key,display:true },
  ]);
  
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <Overview symbol={route.symbol} summary={stockSummary} />;
      case 'second':
        return <Analysis symbol={route.symbol} summary={stockSummary} />;
      case 'third':
        return <FinancialHealth symbol={route.symbol} summary={stockSummary} />;
      case 'fourth':
        return <Dividend symbol={route.symbol} summary={stockSummary} />;
      default:
        return null;
    }
  };
  const renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        scrollEnabled={true}
        gap={24}
        style={[globalStyle.tabHeader]}
        tabStyle={{ width: 'auto', paddingHorizontal: 0, }}
        indicatorStyle={{ height: 0 }}
        renderLabel={({ route, focused }) => {
          return (
            <Text
              style={[
                globalStyle.tabLabel,
                {
                  paddingHorizontal: focused ? 0 : 2,
                  fontWeight: focused ? '700' : '400',
                  color: focused ? '#2EBD85' : '#FFF',
                  borderBottomWidth: focused ? 3 : 0,
                },
              ]}
            >
              {route.title}
            </Text>
          );
        }}
      />
    );
  };
  const getStockSummary = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const mail = await AsyncStorage.getItem("userEmail");
    setIsLoading(true);
    await Api.getStockSummary(selectedSymbol.key, token, mail)
    .then(async (response) => {
      setStockSummary(response)
      let temp = [...routes]
      temp[1].display = response.isAnalysisEnabled
      temp[2].display = response.isFinHealthEnabled
      temp[3].display = response.isDividendEnabled
      setRoutes(temp)
    })
    .catch((error) => {
      setNetWorkError(true)
    });

    setIsLoading(false);
  };
  const handleReload = () => {
    getStockSummary()
  }
  const handleGoHome = () => {
    navigation.goBack();
  }
  useEffect(() => {
    getStockSummary()
  }, [])

  if (isLoading) {
    return (
      <View style={styles.layout}>
        <Loading />
      </View>
    )
  }else if(netWorkError){
    return (
      <View style={[globalStyle.justifyCenter, styles.layout, {alignItems:'center', flexDirection:'column', gap:50}]}>
        <View style={[globalStyle.justifyCenter, globalStyle.alignItemsCenter, { flexDirection: 'column', gap: 20}]}>
          <Notfind />
          <Text style={{ color: '#FFF', fontSize: 24, width: 350, textAlign: 'center', letterSpacing:1 }}>
            We can not display information at this moment
          </Text>
          <Text style={{ color: '#FFF', fontSize: 16, width: 250, textAlign: 'center', letterSpacing:1 }}>
            Please wait a couple of minutes and try again
          </Text>
        </View>
        <View style={[globalStyle.flexColumn, {gap:20}]}>
          <TouchableOpacity style={styles.reloadBtn} onPress={() => handleReload()}>
            <Text style={{color:'#FFF'}}>Reload</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goBtn} onPress={() => handleGoHome()}>
            <Text style={{color:'#2EBD85'}}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }else{
    return (
      <TabView
        navigationState={{ index, routes: routes.filter(route => route.display !== false) }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={renderTabBar}
      />
    );
  }
}

const styles = StyleSheet.create({
  layout:{
    width:'100%',
    height:'100%',
    backgroundColor:'#040B11'
  },
  reloadBtn:{
    backgroundColor:'#2EBD85',
    height:48,
    width:Dimensions.get("window").width - 30,
    borderRadius:100,
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center',
  },
  goBtn:{
    backgroundColor:'transparent',
    height:48,
    width:Dimensions.get("window").width - 30,
    borderRadius:100,
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center',
    borderColor:'#2EBD85',
    borderWidth:2
  }
});