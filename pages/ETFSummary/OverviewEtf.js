import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { globalStyle} from "../../assets/css/globalStyle"
import { Ionicons } from '@expo/vector-icons';
import { Circle, Svg } from "react-native-svg";
import Api from "../../api/Api";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { convertLargeNumber, getRoundOffValue, formatDateAnalysis } from "../../utils/utils";
import { BellPlus, Star, StarActive } from "../../assets/img/Constant"
import Loading from "../../components/loading/Loading"
import Toast from "react-native-toast-message";
import FlatNews from "../../components/news/FlatNews";

export default function OverviewEtf(props) {
  const [selectedRange, setSelectedRange] = useState("1d");
  const [etfSummary, setETFSummary] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [isActiveAddWatch, setIsActiveAddWatch] = useState(false);
  const [dayRange, setDayRange] = useState(0)
  const [weekRange, setWeekRange] = useState(0)
  const navigation = useNavigation();
  const [news, setNews] = useState([]);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0, label:'' });
  const [stockGraphData, setStockGraphData] = useState({
    viewLabels:[],
    labels:[],
    data:[]
  });
  const [valuation, setValuation] = useState({
    self: {
        risk: 0,
        return: 0
    },
    index: {
        risk: 0,
        return: 0
    }
  })
  const formatDate = (dateString) => {
    const options = { month: "long", day: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }; 
  const getRiskValuation = (riskValue) => {
    stackLength = (Dimensions.get("window").width - 30) / 5
    width = 0
    if(riskValue <= -50){
      width = Dimensions.get("window").width - 30
    }else if( riskValue > -50 && riskValue <= -36){
      step = stackLength / 14
      width = stackLength * 4 + (-36 - riskValue) * step
    }else if( riskValue > -36 && riskValue <= -22){
      step = stackLength / 14
      width = stackLength * 3 + step * (-22 - riskValue)
    }else if( riskValue > -22 && riskValue <= -12){
      step = stackLength / 10
      width = stackLength * 2 + step * (-12 - riskValue)
    }else if( riskValue <= 0 && riskValue > -12){
      step = (stackLength * 2) / 12
      width = step * (-riskValue) + 19
    }

    return width
  }
  const getReturnValuation = (returnValue) => {
    stackLength = (Dimensions.get("window").width - 30) / 5
    width = 0

    if(returnValue >= 0 && returnValue < 8){
      step = (stackLength * 2) / 8
      width = step * returnValue + 19
    }else if( returnValue >= 8 && returnValue < 13){
      step = stackLength / 5
      width = stackLength * 2 + step * (returnValue - 8)
    }else if( returnValue >= 13 && returnValue < 20){
      step = stackLength / 7
      width = stackLength * 3 + step * (returnValue - 13)
    }else if( returnValue >= 20 && returnValue < 50){
      step = stackLength / 30
      width = stackLength * 4 + step * (returnValue - 20)
    }else if( returnValue >= 50){
      width = Dimensions.get("window").width - 30
    }

    return width
  }
  const handleChartPress = (x, y, dataset, index) => {
    centerPointX = Dimensions.get("window").width / 2
    if(x > centerPointX)
      x -= 30
    setTooltipPos({
      x: x-20,
      y:y,
      visible: true,
      value: dataset.data[index],
      label: dataset.labels[index]
    });
  };
  const handleNotify = () => {
    navigation.navigate("Profile2");
  }
  const updateWatchList = async(t, d, msg, s) => {
    setIsLoading(true)
    await Api.addWatch(t, d)
    .then(async(response) => {
      await getWatchListBySymbol()
      setIsLoading(false)
      Toast.show({
        type: 'Capiwise_Success',
        position:"top",
        text1: s,
        text2: msg
      })
    })
    .catch((error) => {
        console.log(error)
    });
  }
  const handleWatchlist = async() => {
    const mail = await AsyncStorage.getItem("userEmail");
    const token = await AsyncStorage.getItem("userToken");
    const regionSymbol = await AsyncStorage.getItem("regionSymbol");
    let temp = []
    let data = {}
    let message = ""
    temp.push(regionSymbol)

    if(isActiveAddWatch){
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
    
    await updateWatchList(token, data, message, regionSymbol)
  };
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const getNewsByCategory = async () => {
    const regionSymbol = await AsyncStorage.getItem("regionSymbol");
    const token = await AsyncStorage.getItem("userToken");
    await Api.getNewsBySymbol(regionSymbol, token)
    .then(async (response) => {
      res = JSON.parse(response)
      if(res?.data.length == 0){
        await Api.getNewsByCategory("top", token)
        .then((response) => {
          topRes = JSON.parse(response)
          setNews(topRes?.data);
        })
        .catch((error) => {
          console.log('getNewsByCategory', error)
        });
      }else{
        setNews(res?.data);
      }
    })
    .catch((error) => {
      console.log(error)
    });
  };

  const getETFStocks = () => {
    try {
      const response = props.summary
      setETFSummary(response);
      setIsActiveAddWatch(response.isWatchlisted)
      let dayTemp = parseInt((response?.overview?.day1Range?.close - response?.overview?.day1Range?.low) / (response?.overview?.day1Range?.high - response?.overview?.day1Range?.low) * 100)
      if (dayTemp <= 5)
        dayTemp = 5
      setDayRange(dayTemp)

      let weekTemp = parseInt((response?.overview?.day1Range?.close - response?.overview?.weeks52Range?.week252Low) / (response?.overview?.weeks52Range?.weeks52High - response?.overview?.weeks52Range?.week252Low) * 100)
      if (weekTemp <= 5)
        weekTemp = 5
      setWeekRange(weekTemp)
      setValuation(response?.overview?.riskreturnValuation)
    } catch (error) {
      console.error("Error fetching ETF stocks:", error);
    }
  };
  const getStockHistoricalData = async (period) => {
    const token = await AsyncStorage.getItem("userToken");
    try {
      setTooltipPos(false)
      const regionSymbol = await AsyncStorage.getItem("regionSymbol");
      await Api.getStockHistoricalData(regionSymbol, period, token)
        .then(async (response) => {
          viewLabels = [], labels = [], data = []
          if(response){
            viewLabels = response?.viewLabels
            response?.result.forEach((value, key) => {
              switch (period){
                case '1d':
                  labels.push(value?.datetime.split(' ')[1])
                  break
                case '1w':
                  labels.push(value?.datetime)
                  break
                case '1m':
                  labels.push(value?.datetime)
                  break
                case '6m':
                  labels.push(value?.datetime)
                  break
                case '1y':
                  labels.push(value?.datetime)
                  break
                case '5y':
                  labels.push(value?.datetime)
                  break
                case 'mx':
                  labels.push(value?.datetime)
                  break
              }

              data.push(parseFloat(value?.close))
            });

            temp = {
              viewLabels : viewLabels,
              labels: labels,
              data:data
            }

            setStockGraphData(temp)
            setSelectedRange(period);
          }
        })
        .catch((error) => {});
    } catch (error) {
      // Handle errors
    }
  };
  const getWatchListBySymbol = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const mail = await AsyncStorage.getItem("userEmail");
    const regionSymbol = await AsyncStorage.getItem("regionSymbol");
    await Api.getWatchListBySymbol(token, mail, regionSymbol)
    .then((response) => {
      setIsActiveAddWatch(response.data)
    })
    .catch((error) => {});
  };
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitle: () => (        
        <TouchableOpacity onPress={() => navigation.goBack()} style={globalStyle.alignItemsCenter}>
          <Ionicons name="chevron-back-outline" size={24} color="#FFF"/>
          <Text style={{ color: "#FFF", fontSize: 24}}>
            Summary
          </Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#040B11",
      },
      headerTintColor: "#FFF",
    });

    getETFStocks();
    getStockHistoricalData("1d");
    getNewsByCategory();
    setIsLoading(false)
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      {isLoading?<Loading />:
      <>
      <View style={globalStyle.container}>
        <View style={[globalStyle.header, {gap:24}]}>
          <View style={{maxWidth:Dimensions.get("window").width - 110}}>
            <Text style={[globalStyle.heading]}>
              {etfSummary?.overview?.details?.name}{" "}
              <View style={{ backgroundColor:'#0B1620', borderRadius:20, width:50,height:24, alignItems:'center', justifyContent:'center' }}>
                <Text style={{ color: '#FFF', fontSize: 16}}>ETF</Text>
              </View>
            </Text>
          </View>
          <View style={[globalStyle.flexRow, {gap:16}]}>
            <TouchableOpacity onPress={handleNotify}>
              <BellPlus />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleWatchlist}>
              {isActiveAddWatch?<StarActive/>:<Star/>}
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[globalStyle.h2, {marginTop:8}]}>
        {etfSummary?.overview?.details?.exchange}:{etfSummary?.overview?.details?.symbol}  - Real time price in USD
        </Text>
        <Text style={[globalStyle.heading, {marginTop:8}]}>
          ${getRoundOffValue(etfSummary?.overview?.day1Range?.close)} &nbsp;
          <Text style={[globalStyle.h3, {color:'#FFF'}]}> USD </Text>
        </Text>
        <Text style={[globalStyle.h2, {color: etfSummary?.overview?.day1Range?.change>0?"#2EBD85":'#E2433B', marginTop:8}]}>
          ${getRoundOffValue(etfSummary?.overview?.day1Range?.change)}(
          {getRoundOffValue(etfSummary?.overview?.day1Range?.percentChange)})% &nbsp;
          <Text style={{color:'#FFF'}}>
            Data as of {formatDate(etfSummary?.asof)}
          </Text>
        </Text>
        <View
          style={[globalStyle.h3, globalStyle.justifyBetween, {marginTop: 12,}]}
        >
          <TouchableOpacity onPress={() => getStockHistoricalData("1d")}>
            <Text
              style={{
                color: selectedRange === "1d" ? "#2EBD85" : "white",
                textDecorationLine:
                  selectedRange === "1d" ? "underline" : "none",
                textDecorationColor: "#2EBD85",
                borderBottomWidth: selectedRange === "1d" ? 2 : 0,
                fontWeight: selectedRange === "1d" ? "bold" : "normal",
              }}
            >
              1D
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getStockHistoricalData("1w")}>
            <Text
              style={{
                color: selectedRange === "1w" ? "#2EBD85" : "white",
                textDecorationLine:
                  selectedRange === "1w" ? "underline" : "none",
                textDecorationColor: "#2EBD85",
                borderBottomWidth: selectedRange === "1w" ? 2 : 0,
                fontWeight: selectedRange === "1w" ? "bold" : "normal",
              }}
            >
              1W
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getStockHistoricalData("1m")}>
            <Text
              style={{
                color: selectedRange === "1m" ? "#2EBD85" : "white",
                textDecorationLine:
                  selectedRange === "1m" ? "underline" : "none",
                textDecorationColor: "#2EBD85",
                borderBottomWidth: selectedRange === "1m" ? 2 : 0,
                fontWeight: selectedRange === "1m" ? "bold" : "normal",
              }}
            >
              1M
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getStockHistoricalData("6m")}>
            <Text
              style={{
                color: selectedRange === "6m" ? "#2EBD85" : "white",
                textDecorationLine:
                  selectedRange === "6m" ? "underline" : "none",
                textDecorationColor: "#2EBD85",
                borderBottomWidth: selectedRange === "6m" ? 2 : 0,
                fontWeight: selectedRange === "6m" ? "bold" : "normal",
              }}
            >
              6M
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getStockHistoricalData("1y")}>
            <Text
              style={{
                color: selectedRange === "1y" ? "#2EBD85" : "white",
                textDecorationLine:
                  selectedRange === "1y" ? "underline" : "none",
                textDecorationColor: "#2EBD85",
                borderBottomWidth: selectedRange === "1y" ? 2 : 0,
                fontWeight: selectedRange === "1y" ? "bold" : "normal",
              }}
            >
              1Y
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getStockHistoricalData("5y")}>
            <Text
              style={{
                color: selectedRange === "5y" ? "#2EBD85" : "white",
                textDecorationLine:
                  selectedRange === "5y" ? "underline" : "none",
                textDecorationColor: "#2EBD85",
                borderBottomWidth: selectedRange === "5y" ? 2 : 0,
                fontWeight: selectedRange === "5y" ? "bold" : "normal",
              }}
            >
              5Y
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getStockHistoricalData("mx")}>
            <Text
              style={{
                color: selectedRange === "mx" ? "#2EBD85" : "white",
                textDecorationLine:
                  selectedRange === "mx" ? "underline" : "none",
                textDecorationColor: "#2EBD85",
                borderBottomWidth: selectedRange === "mx" ? 2 : 0,
                fontWeight: selectedRange === "mx" ? "bold" : "normal",
              }}
            >
              MAX
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <LineChart
            data={{
              labels: stockGraphData?.viewLabels,
              datasets: [
                {
                  data:stockGraphData?.data,
                  labels:stockGraphData?.labels,
                  strokeWidth: 2,
                  color: () => etfSummary?.overview?.day1Range?.change>0?"#2EBD85":"#E2433B",
                },
              ],
            }}
            width={Dimensions.get("window").width*0.93}
            height={220}
            yLabelsOffset={30}
            chartConfig={{
              backgroundColor: "#040B11",
              backgroundGradientFrom: "#040B11",
              backgroundGradientTo: "#040B11",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: ""
              }
            }}
            yAxisLabel="$"
            withVerticalLines={false}
            withHorizontalLines={false}
            withShadow={false}
            fromZero={false}
            onDataPointClick={({ x, y, dataset, index }) => handleChartPress(x, y, dataset, index)}
            style={{
              marginVertical: 8,
              marginRight:-5,
              marginLeft:-5
            }}
            bezier
          />
          {tooltipPos.visible && (
            <View style={[styles.tooltipChart, { left: tooltipPos.x, top: tooltipPos.y }]}>
              <Text style={{fontSize:8, color:'#979797', fontWeight:'400'}}>{tooltipPos.label}</Text>
              <Text style={{fontSize:8, color:'#FFF', fontWeight:'700'}}>${tooltipPos.value}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={[globalStyle.divider, { marginTop: 0 }]}></View>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20 }]}>Statistics</Text>
        <View style={[globalStyle.justifyBetween, {gap:18}]}>
          <View style={styles.statisticsColumn}>
            <View style={styles.statisticsItem}>
              <Text style={globalStyle.h3}>Net assets</Text>
              <Text style={styles.statisticsValue}>
                {etfSummary?.overview?.statistics?.netAssets &&
                  convertLargeNumber(
                    etfSummary?.overview?.statistics?.netAssets
                  )}
              </Text>
            </View>
            <View style={styles.dividerStats}></View>
            <View style={styles.statisticsItem}>
              <Text style={globalStyle.h3}>NAV (previous day)</Text>
              <Text style={styles.statisticsValue}>
                {getRoundOffValue(etfSummary?.overview?.statistics?.NAV)}
              </Text>
            </View>
            <View style={styles.dividerStats}></View>
            <View style={styles.statisticsItem}>
              <Text style={globalStyle.h3}>Forward annual Div.</Text>
              <Text style={styles.statisticsValue}>
                {getRoundOffValue(etfSummary?.overview?.statistics?.forwardAnnualDividend)}%
              </Text>
            </View>
            <View style={styles.dividerStats}></View>
          </View>
          <View style={styles.statisticsColumn}>
            <View style={styles.statisticsItem}>
              <Text style={globalStyle.h3}>PP (52-Wk)</Text>
              {etfSummary?.overview?.statistics?.pricePerformance52W && 
                etfSummary?.overview?.statistics?.pricePerformance52W >= 0 ?
                <Text style={[ styles.statisticsValue,{ color: "#2EBD85" }]}>
                  +{getRoundOffValue(etfSummary?.overview?.statistics?.pricePerformance52W)}%
                </Text>
                :<Text style={[ styles.statisticsValue,{ color: "#F00" }]}>
                  {getRoundOffValue(etfSummary?.overview?.statistics?.pricePerformance52W)}%
                </Text>
              }
            </View>
            <View style={styles.dividerStats}></View>
            <View style={styles.statisticsItem}>
              <Text style={[globalStyle.h3]}>
                Net expense ratio
              </Text>
              <Text
                style={styles.statisticsValue}
              >
                {getRoundOffValue(etfSummary?.overview?.statistics?.netExpenseRatio)}%
              </Text>
            </View>
            <View style={styles.dividerStats}></View>
            <View style={styles.statisticsItem}>
              <Text style={globalStyle.h3}>
                Inception date
              </Text>
              <Text style={styles.statisticsValue} >
                {moment(etfSummary?.overview?.statistics?.inceptionDate).format("DD.MM.YYYY")}
              </Text>
            </View>
            <View style={styles.dividerStats}></View>
          </View>
        </View>
        <Text  style={[globalStyle.h4,{ marginTop: 20,marginBottom: 20}]}>
          Price day range
        </Text>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#009BFF', '#0053AA']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.progress, { width: `${dayRange}%` }]}
          >
             <Svg
              height="23"
              width="23"
              viewBox="0 0 23 23"              
              stroke="#FFF"
              strokeWidth="1"
              style={{
                marginTop:-4
              }}
            >
              <Circle cx="13" cy="11" r="10" fill="#0053AA" />
            </Svg>
          </LinearGradient>
        </View>
        <View style={[globalStyle.justifyBetween, {paddingTop: 10}]}>
          <Text style={[styles.minMaxText]}>
            ${getRoundOffValue(etfSummary?.overview?.day1Range?.low)}
          </Text>
          <Text style={[styles.minMaxText]}>
            ${getRoundOffValue(etfSummary?.overview?.day1Range?.high)}
          </Text>
        </View>
        <View style={[globalStyle.justifyBetween, {paddingTop: 10}]}>
          <Text style={[styles.minMaxText]}>
            Low
          </Text>
          <Text style={[styles.minMaxText]}>
            High
          </Text>
        </View>
        <Text  style={[globalStyle.h4,{ marginTop: 20,marginBottom: 20}]}>
          Price 52-week range
        </Text>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#009BFF', '#0053AA']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.progress, { width: `${weekRange}%` }]}
          >
             <Svg
              height="23"
              width="23"
              viewBox="0 0 23 23"              
              stroke="#FFF"
              strokeWidth="1"
              style={{
                marginTop:-4
              }}
            >
              <Circle cx="13" cy="11" r="10" fill="#0053AA" />
            </Svg>
          </LinearGradient>
        </View>
        <View style={[globalStyle.justifyBetween, {paddingTop: 10}]}>
          <Text style={[styles.minMaxText]}>
            ${getRoundOffValue(etfSummary?.overview?.weeks52Range?.week252Low)}
          </Text>
          <Text style={[styles.minMaxText]}>
            ${getRoundOffValue(etfSummary?.overview?.weeks52Range?.weeks52High)}
          </Text>
        </View>
        <View style={[globalStyle.justifyBetween, {paddingTop: 10}]}>
          <Text style={[styles.minMaxText]}>
            Low on {moment(etfSummary?.overview?.weeks52Range?.onLow).format("DD.MM.YYYY")}
          </Text>
          <Text style={[styles.minMaxText]}>
            High on {moment(etfSummary?.overview?.weeks52Range?.onHigh).format("DD.MM.YYYY")}
          </Text>
        </View>
      </View>
      <View style={[globalStyle.divider, { marginTop: 20 }]}></View>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20 }]}>Risk-return valuation</Text>
        <Text  style={[globalStyle.h5,{ marginTop: 16,marginBottom: 20, width:'auto'}]}>
          Risk vs. index
        </Text>
        <View>
          <LinearGradient
            colors={['#1CA65E', '#F5A623', '#D0021B']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.colorProgress]}
          >
            <View style={{flexDirection:'row', justifyContent:'flex-end', width:getRiskValuation(parseFloat(valuation?.self?.risk)), position:'absolute'}}>
              <Svg
                height="23"
                width="23"
                viewBox="0 0 23 23"              
                stroke="#FFF"
                strokeWidth="1"                
              >
                <Circle cx="13" cy="11" r="8" fill="#20A5F1"/>
              </Svg>
            </View>
            <View style={{flexDirection:'row', justifyContent:'flex-end', width:getRiskValuation(parseFloat(valuation?.index?.risk)), position:'absolute'}}>
              <Svg
                height="23"
                width="23"
                viewBox="0 0 23 23"              
                stroke="#FFF"
                strokeWidth="1"                
              >
                <Circle cx="13" cy="11" r="8" fill="#D8D8D8"/>
              </Svg>
            </View>
          </LinearGradient>
        </View>
        <View style={[globalStyle.justifyBetween, {paddingTop: 15}]}>
          <Text style={[styles.minMaxText]}>
            Low
          </Text>
          <Text style={[styles.minMaxText]}>
            Average
          </Text>
          <Text style={[styles.minMaxText]}>
            High
          </Text>
        </View>
        <Text  style={[globalStyle.h5,{ marginTop: 16,marginBottom: 20, width:'auto'}]}>
          Return vs. index
        </Text>
        <View>
          <LinearGradient
            colors={['#D0021B', '#F5A623', '#1CA65E']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.colorProgress]}
          >
            <View style={{flexDirection:'row', justifyContent:'flex-end', width:getReturnValuation(parseFloat(valuation?.self?.return)), position:'absolute'}}>
              <Svg
                height="23"
                width="23"
                viewBox="0 0 23 23"              
                stroke="#FFF"
                strokeWidth="1"                
              >
                <Circle cx="13" cy="11" r="8" fill="#20A5F1"/>
              </Svg>
            </View>
            <View style={{flexDirection:'row', justifyContent:'flex-end', width:getReturnValuation(parseFloat(valuation?.index?.return)), position:'absolute'}}>
              <Svg
                height="23"
                width="23"
                viewBox="0 0 23 23"              
                stroke="#FFF"
                strokeWidth="1"                
              >
                <Circle cx="13" cy="11" r="8" fill="#D8D8D8"/>
              </Svg>
            </View>
          </LinearGradient>
        </View>
        <View style={[globalStyle.justifyBetween, {paddingTop: 15}]}>
          <Text style={[styles.minMaxText]}>
            Low
          </Text>
          <Text style={[styles.minMaxText]}>
            Average
          </Text>
          <Text style={[styles.minMaxText]}>
            High
          </Text>
        </View>
        <View style={styles.iconTextRow}>
          <Image
            source={require("../../assets/img/yellow_check.png")} // Path to your local icon
            style={styles.iconSize}
          />
          <Text style={styles.yelloBold}>
            Above average risk value: &nbsp;
            <Text style={styles.performanceSubText}>
              {etfSummary?.overview?.details?.symbol} is trading above our estimate of average risk value.
            </Text>
          </Text>
        </View>
        <View style={styles.iconTextRow}>
          <Image
            source={require("../../assets/img/check.png")} // Path to your local icon
            style={styles.iconSize}
          />
          <Text style={styles.greenBold}>
            Significantly high return value: &nbsp;
            <Text style={styles.performanceSubText}>
            {etfSummary?.overview?.details?.symbol} is trading in our estimate of High value.
            </Text>
          </Text>
        </View>
      </View>
      <View style={[globalStyle.divider, { marginTop: 20 }]}></View>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20 }]}>Fund fundamentals</Text>
        <View style={[globalStyle.justifyBetween, {marginTop:20}]}>
          <View style={[globalStyle.justifyBetween, {width:'60%'}]}>
              <Text style={[globalStyle.h2, {letterSpacing:0.1}]}>{etfSummary?.overview?.details?.symbol} vs. Index</Text>
              <Text style={[globalStyle.h2, {letterSpacing:-0.07, color:'#FFF'}]}>{etfSummary?.overview?.details?.symbol}</Text>
          </View>
          <View>
            <Text style={[globalStyle.h3, {letterSpacing:-0.07, color:'#FFF'}]}>Asset class median</Text>
          </View>
        </View>
        <View style={styles.dividerUpcome}/>
        <View style={[globalStyle.justifyBetween, {marginTop:24}]}>
          <View style={[globalStyle.justifyBetween, {width:'60%'}]}>
              <Text style={[globalStyle.h3, {letterSpacing:-0.07, color:'#FFF'}]}>Price / Earnings&nbsp;
                <Text style={[globalStyle.h4, {fontSize:10, letterSpacing:-0.07}]}>(TTM)</Text>
              </Text>
              <Text style={[globalStyle.h2, {letterSpacing:-0.07, color:'#FFF'}]}>
                {getRoundOffValue(etfSummary?.overview?.fundFundamentals?.self?.p_earningsTTM)}
              </Text>
          </View>
          <View>
            <Text style={[globalStyle.h3, {letterSpacing:-0.07, color:'#FFF'}]}>
            {getRoundOffValue(etfSummary?.overview?.fundFundamentals?.index?.p_earningsTTM)}
            </Text>
          </View>
        </View>
        <View style={styles.dividerthick}/>
        <View style={[globalStyle.justifyBetween, {marginTop:14}]}>
          <View style={[globalStyle.justifyBetween, {width:'60%'}]}>
              <Text style={[globalStyle.h3, {letterSpacing:-0.07, color:'#FFF'}]}>Price / Book</Text>
              <Text style={[globalStyle.h2, {letterSpacing:-0.07, color:'#FFF'}]}>
              {getRoundOffValue(etfSummary?.overview?.fundFundamentals?.self?.p_book)}
              </Text>
          </View>
          <View>
            <Text style={[globalStyle.h3, {letterSpacing:-0.07, color:'#FFF'}]}>
            {getRoundOffValue(etfSummary?.overview?.fundFundamentals?.index?.p_book)}
            </Text>
          </View>
        </View>
        <View style={styles.dividerthick}/>
        <View style={[globalStyle.justifyBetween, {marginTop:14}]}>
          <View style={[globalStyle.justifyBetween, {width:'60%'}]}>
              <Text style={[globalStyle.h3, {letterSpacing:-0.07, color:'#FFF'}]}>Price / Sales</Text>
              <Text style={[globalStyle.h2, {letterSpacing:-0.07, color:'#FFF'}]}>
              {getRoundOffValue(etfSummary?.overview?.fundFundamentals?.self?.p_sale)}
              </Text>
          </View>
          <View>
            <Text style={[globalStyle.h3, {letterSpacing:-0.07, color:'#FFF'}]}>
            {getRoundOffValue(etfSummary?.overview?.fundFundamentals?.index?.p_sale)}
            </Text>
          </View>
        </View>
        <View style={styles.dividerthick}/>
        <View style={[globalStyle.justifyBetween, {marginTop:14}]}>
          <View style={[globalStyle.justifyBetween, {width:'60%'}]}>
              <Text style={[globalStyle.h3, {letterSpacing:-0.07, color:'#FFF'}]}>Price / Cash Flow</Text>
              <Text style={[globalStyle.h2, {letterSpacing:-0.07, color:'#FFF'}]}>
              {getRoundOffValue(etfSummary?.overview?.fundFundamentals?.self?.p_cashflow)}
              </Text>
          </View>
          <View>
            <Text style={[globalStyle.h3, {letterSpacing:-0.07, color:'#FFF'}]}>
            {getRoundOffValue(etfSummary?.overview?.fundFundamentals?.index?.p_cashflow)}
            </Text>
          </View>
        </View>
        <View style={styles.dividerthick}/>
        <Text
          style={[globalStyle.h2, {fontWeight:300, letterSpacing:0.2, marginTop:15}]}
        >
          As of{" "}{formatDateAnalysis(etfSummary?.asof)}
        </Text>
      </View>
      <View style={[globalStyle.divider, { marginTop: 20 }]}></View>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20 }]}>Company profile</Text>
        <Text style={[globalStyle.h3, {paddingTop:16}]}>
          Biography
        </Text>
        <Text
          style={[globalStyle.h2,{
            color: "#FFF",
            letterSpacing:0.1,
            lineHeight:20,
            paddingTop:14,
            maxHeight: expanded ? "none" : 75,
            overflow: "hidden"
          }]}
        >
          {etfSummary?.overview?.companyProfile?.biography}
        </Text>
        <TouchableOpacity onPress={toggleExpanded}>
          <Text
            style={[globalStyle.h2,{ color: "#20A5F1", paddingTop:1}]}
          >
          {!expanded?'Show more':'Show less'}
          </Text>
        </TouchableOpacity>
        <View style={styles.dividerUpcome}/>
        <View style={[styles.iconTextRow, {paddingTop:12}]}>
          <Text style={[globalStyle.h3]}>
            What is it holding?
          </Text>
        </View>
        <View style={[styles.iconTextRow, {paddingTop:12, gap:24}]}>
          <Text style={[globalStyle.h3]}>
            Top sector
          </Text>
          <Text style={[globalStyle.h2, {color: "#20A5F1", letterSpacing:0.1}]}>
          {etfSummary?.overview?.companyProfile?.topSector}
          </Text>
        </View>
        <View style={[styles.iconTextRow, {paddingTop:12, gap:24}]}>
          <Text style={[globalStyle.h3]}>
            Top industry
          </Text>
          <Text style={[globalStyle.h2, {color: "#20A5F1", letterSpacing:0.1, width: Dimensions.get('window').width - 102}]}>
          {etfSummary?.overview?.companyProfile?.topIndustry}
          </Text>
        </View>
        <View style={styles.dividerUpcome}/>
        <View style={[styles.iconTextRow, {paddingTop:12}]}>
          <Text style={[globalStyle.h3]}>
            How is it structured?
          </Text>
        </View>
        <View style={[styles.iconTextRow, {paddingTop:12, gap:24}]}>
          <Text style={[globalStyle.h3]}>
            Sponsor
          </Text>
          <Text style={[globalStyle.h2, {color: "#FFF", letterSpacing:0.1}]}>
          {etfSummary?.overview?.companyProfile?.sponsor}
          </Text>
        </View>
        <View style={[styles.iconTextRow, {paddingTop:12, gap:24}]}>
          <Text style={[globalStyle.h3]}>
            Inception
          </Text>
          <Text style={[globalStyle.h2, {color: "#FFF", letterSpacing:0.1}]}>
          {formatDateAnalysis(etfSummary?.overview?.companyProfile?.inception)}
          </Text>
        </View>
        <View style={[styles.iconTextRow, {paddingTop:12, gap:24}]}>
          <Text style={[globalStyle.h3]}>
            Country
          </Text>
          <Text style={[globalStyle.h2, {color: "#FFF", letterSpacing:0.1}]}>
          {etfSummary?.overview?.companyProfile?.country}
          </Text>
        </View>
        <View style={[styles.iconTextRow, {paddingTop:12, gap:24}]}>
          <Text style={[globalStyle.h3]}>
            Website
          </Text>
          <Text style={[globalStyle.h2, {color: "#20A5F1", letterSpacing:0.1}]}>
          {etfSummary?.overview?.companyProfile?.website}
          </Text>
        </View>
      </View>
      <View style={[globalStyle.divider, { marginTop: 20 }]}></View>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20 }]}>News</Text>
      </View>
      <FlatNews news={news} />
      </>
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    position: 'absolute',
    top: 50,
    zIndex:1,
    flexDirection:'row',
    justifyContent: 'center',
    width:'100%'
  },
  statisticsColumn: {
    width: "100%",
    flex: 1,
    paddingTop: 20,
  },
  statisticsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  dividerStats: {
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#A1A9B6",
    width: "auto",
  },
  iconTextRow: {
    width: "100%",
    flexDirection: "row",
    paddingRight: 40,
    paddingTop:20
  },
  statisticsValue: {
    fontSize: 12,
    textAlign: "right",
    color: "#FFF",
    fontWeight:'700',
  },
  progressBar: {
    width: '100%',
    height: 13,
    backgroundColor: '#E1E2E4',
    borderRadius: 20
  },
  minMaxText: {
    color: "#979797",
    fontFamily: "Roboto",
    fontSize: 12,
  },
  progress: {
    backgroundColor: "#42a5f5",
    flexDirection:'row',
    justifyContent:'flex-end',
    height:13,
    borderRadius: 20,
  },
  colorProgress:{
    width:'100%',
    height:30,
    borderRadius:50,
    flexDirection:"row",
    alignItems:'center'
  },
  TrendingStocks: {
    width: "100%",
    paddingTop: 25,
  },
  messageText: {
    color: "white",
    marginLeft: 10,
  },
  messageBody:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor: "#007C4A",
    padding: 10,
    borderRadius: 5,
  },
  dividerUpcome : {
    borderBottomWidth: 1,
    borderBottomColor: "#F5F7F9",
    width: "100%",
    paddingTop: 23,
  },
  tooltipChart:{
    position: 'absolute', 
    backgroundColor:'#0B1620', 
    borderRadius:4, 
    flexDirection:'column', 
    justifyContent:"space-evenly", 
    padding:3
  },
  performanceSubText:{
    fontSize: 12,
    color: "#FFF",
    fontWeight:'400',
  },
  greenBold:{
    fontSize: 12,
    color: "#2EBD85",
    fontWeight:'700',    
  },
  yelloBold:{
    fontSize: 12,
    color: "#FFA412",
    fontWeight:'700',  
  },
  iconSize:{
    width: 20,
    height: 20,
    marginRight: 10,
  },
  dividerUpcome : {
    borderBottomWidth: 1,
    borderBottomColor: "#F5F7F9",
    width: "100%",
    paddingTop: 13,
  },
  dividerthick : {
    borderBottomWidth: 0.6,
    borderBottomColor: "#252A2D",
    width: "100%",
    paddingTop: 12,
  },
});