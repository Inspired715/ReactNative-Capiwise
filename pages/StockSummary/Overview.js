import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import { LineChart } from 'react-native-chart-kit';
import { Circle, Svg } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { globalStyle} from "../../assets/css/globalStyle"
import Api from "../../api/Api";
import { convertLargeNumber, getRoundOffValue, formatDateAnalysis } from "../../utils/utils";
import moment from 'moment';
import Loading from "../../components/loading/Loading"
import { BellPlus, Star, BellPlusActive, StarActive } from "../../assets/img/Constant"
import { LinearGradient } from 'expo-linear-gradient';
import Toast from "react-native-toast-message";
import FlatNews from "../../components/news/FlatNews";

export default function Overview(props) {
  const [selectedRange, setSelectedRange] = useState("1d");
  const [stockSummary, setStockSummary] = useState({});
  const [stockGraphData, setStockGraphData] = useState({
    viewLabels:[],
    labels:[],
    data:[]
  });
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();
  const [dayRange, setDayRange] = useState(0)
  const [weekRange, setWeekRange] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0, label:'' });
  const [isActiveAddWatch, setIsActiveAddWatch] = useState(false);
  const [notify, setNotify] = useState(false)
  const [news, setNews] = useState([]);

  const updateWatchList = async(t, d, msg) => {
    setIsLoading(true)
    await Api.addWatch(t, d)
    .then(async(response) => {
      await getWatchListBySymbol()
      setIsLoading(false)
      Toast.show({
        type: 'Capiwise_Success',
        position:"top",
        text1: props.symbol,
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
    let temp = []
    let data = {}
    let message = ""

    temp.push(props.symbol)

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
    
    await updateWatchList(token, data, message)
  };
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  const handleNotify = () => {
    navigation.navigate("CreateAlert");
    setNotify(true)
  }
  const handleChartPress = (x, y, dataset, index) => {
    centerPointX = Dimensions.get("window").width / 2
    if(x > centerPointX)
      x -= 30
    setTooltipPos({
      x: x-20,
      y: y,
      visible: true,
      value: dataset.data[index],
      label: dataset.labels[index]
    });
  };
  const getStockSummary = async () => {
    response = props.summary
    setStockSummary(response);
    setIsActiveAddWatch(response.isWatchlisted)
    let dayTemp = parseInt((response?.day1Range?.close - response?.day1Range?.low) / (response?.day1Range?.high - response?.day1Range?.low) * 100)
    if (dayTemp <= 5)
      dayTemp = 5
    setDayRange(dayTemp)

    let weekTemp = parseInt((response?.day1Range?.close - response?.weeks52Range?.low) / (response?.weeks52Range?.high - response?.weeks52Range?.low) * 100)
    if (weekTemp <= 5)
      weekTemp = 5
    setWeekRange(weekTemp)
  };
  const formatDate = (dateString) => {
    const options = { month: "long", day: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };
  const getStockHistoricalData = async (period) => {
    const token = await AsyncStorage.getItem("userToken");
    try {
      setTooltipPos(false)
      await Api.getStockHistoricalData(props.symbol, period, token)
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
        .catch((error) => {console.log(error)});
    } catch (error) {
      console.log(error)
    }
  };
  const getNewsByCategory = async () => {
    const token = await AsyncStorage.getItem("userToken");
    await Api.getNewsBySymbol(props.symbol, token)
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
  const getWatchListBySymbol = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const mail = await AsyncStorage.getItem("userEmail");
    await Api.getWatchListBySymbol(token, mail, props.symbol)
    .then((response) => {
      setIsActiveAddWatch(response.data)
    })
    .catch((error) => {
      console.log(error)
    });
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

    getStockSummary();
    getStockHistoricalData("1d");
    getNewsByCategory();
    setIsLoading(false)
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      {isLoading?<Loading />:
      <>
      <View style={globalStyle.container}>
        <View style={globalStyle.header}>
          <View style={[globalStyle.alignItemsCenter, {gap:8}]}>
            {stockSummary?.profile?.logo &&
              <Image
                source={{ uri: `${stockSummary?.profile?.logo}` }}
                style={{ width: 20, height: 20, borderRadius:20 }}
              />
            }
            <Text style={[globalStyle.heading, {maxWidth:Dimensions.get("window").width - 160}]}>{stockSummary?.profile?.name}</Text>
          </View>
          <View style={[globalStyle.flexRow, {gap:16}]}>
            <TouchableOpacity onPress={handleNotify}>
              {notify?<BellPlusActive/>:<BellPlus />}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleWatchlist}>
              {isActiveAddWatch?<StarActive/>:<Star/>}
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[globalStyle.h2, {marginTop:8}]}>
          {stockSummary?.profile?.exchange}: {stockSummary?.profile?.symbol} - Real time price in USD
        </Text>
        <Text style={[globalStyle.heading, {marginTop:8}]}>
          ${getRoundOffValue(stockSummary?.day1Range?.close)} &nbsp;
          <Text style={[globalStyle.h3, {color:'#FFF'}]}> USD </Text>
        </Text>
        <Text style={[globalStyle.h2, {color: stockSummary?.day1Range?.change>0?"#2EBD85":"#E2433B", marginTop:8}]}>
          ${getRoundOffValue(stockSummary?.day1Range?.change)}(
          {getRoundOffValue(stockSummary?.day1Range?.percentChange)})% &nbsp;
          <Text style={{color:'#FFF'}}>
            Data as of {formatDate(stockSummary?.date)}
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
                  decimalPlaces:4,
                  color: () => stockSummary?.day1Range?.change>0?"#2EBD85":"#E2433B",
                },
              ],
            }}
            yLabelsOffset={30}
            width={Dimensions.get("window").width*0.93}
            height={220}
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
              <Text style={globalStyle.h3}>Market cap</Text>
              <Text style={styles.statisticsValue}>
                {stockSummary?.statistics?.sharesOutstanding &&
                  convertLargeNumber(
                    stockSummary.statistics.marketCapitalization
                  )}
              </Text>
            </View>
            <View style={styles.dividerStats}></View>
            <View style={styles.statisticsItem}>
              <Text style={globalStyle.h3}>P/E Ratio (TTM)</Text>
              <Text style={styles.statisticsValue}>
                {getRoundOffValue(stockSummary?.earnings?.peRatio)}
              </Text>
            </View>
            <View style={styles.dividerStats}></View>
            <View style={styles.statisticsItem}>
              <Text style={globalStyle.h3}>PEG (5-Y)</Text>
              <Text style={styles.statisticsValue}>
                {getRoundOffValue(stockSummary?.earnings?.pegRatio)}
              </Text>
            </View>
            <View style={styles.dividerStats}></View>
            <View style={styles.statisticsItem}>
              <Text style={globalStyle.h3}>Dividend yield</Text>
              <Text style={styles.statisticsValue}>
                ${getRoundOffValue(stockSummary?.statistics?.dividendsYield)}
              </Text>
            </View>
          </View>
          <View style={styles.statisticsColumn}>
            <View style={styles.statisticsItem}>
              <Text style={globalStyle.h3}>
                Shares outstanding
              </Text>
              <Text
                style={styles.statisticsValue}
              >
                {stockSummary?.statistics?.sharesOutstanding &&
                  convertLargeNumber(stockSummary?.statistics?.sharesOutstanding)}
              </Text>
            </View>
            <View style={styles.dividerStats}></View>
            <View style={styles.statisticsItem}>
              <Text style={[globalStyle.h3]}>
                EPS (TTM)
              </Text>
              <Text
                style={styles.statisticsValue}
              >
                {stockSummary?.earnings?.eps}
              </Text>
            </View>
            <View style={styles.dividerStats}></View>
            <View style={[styles.statisticsItem]}>
              <Text style={globalStyle.h3}>
                PP (52-Wk)
              </Text>
              {stockSummary?.weeks52Range?.performance && 
                stockSummary?.weeks52Range?.performance >= 0 ?
                <Text style={[ styles.statisticsValue,{ color: "#2EBD85" }]}>
                  +{stockSummary?.weeks52Range?.performance}%
                </Text>
                :<Text style={[ styles.statisticsValue,{ color: "#F00" }]}>
                  {stockSummary?.weeks52Range?.performance}%
                </Text>
              }
            </View>
            <View style={styles.dividerStats}></View>
            <View style={styles.statisticsItem}>
              <Text style={globalStyle.h3}>
                Dividend
              </Text>
              <Text style={styles.statisticsValue} >
                {getRoundOffValue(stockSummary?.dividends?.amount)}%
              </Text>
            </View>
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
            ${getRoundOffValue(stockSummary?.day1Range?.low)}
          </Text>
          <Text style={[styles.minMaxText]}>
            ${getRoundOffValue(stockSummary?.day1Range?.high)}
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
            ${getRoundOffValue(stockSummary?.weeks52Range?.low)}
          </Text>
          <Text style={[styles.minMaxText]}>
            ${getRoundOffValue(stockSummary?.weeks52Range?.high)}
          </Text>
        </View>
        <View style={[globalStyle.justifyBetween, {paddingTop: 10}]}>
          <Text style={[styles.minMaxText]}>
            Low on {moment(stockSummary?.weeks52Range?.onLow.datetime).format("DD.MM.YYYY")}
          </Text>
          <Text style={[styles.minMaxText]}>
            High on {moment(stockSummary?.weeks52Range?.onHigh.datetime).format("DD.MM.YYYY")}
          </Text>
        </View>
      </View>
      <View style={[globalStyle.divider, { marginTop: 20 }]}></View>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20 }]}>
          Fundamental events
        </Text>
        <Text style={[globalStyle.h5, {marginTop:17}]}>
          Upcoming events
        </Text>
        <View style={styles.dividerUpcome}/>
        <View style={styles.iconTextRow}>
          <Image
            source={require("../../assets/img/calender.png")} // Path to your local icon
            style={{ marginTop: 10, width: 36, height: 36, marginRight: 15 }}
          />
          <Text style={[globalStyle.h2, {paddingTop:22, color:'#FFF', letterSpacing:0.1}]}>
            {stockSummary?.profile?.symbol} to announce{" "}
            {stockSummary?.events?.earningsUpcoming?.quarter} earnings
            (confirmed)
          </Text>
        </View>
        <Text style={[globalStyle.h5, {paddingTop:12}]}>
          Past events
        </Text>
        <View style={styles.dividerUpcome}/>
        <View style={styles.iconTextRow}>
          <Image
            source={require("../../assets/img/inactive_calender.png")} // Path to your local icon
            style={{ marginTop: 15, width: 36, height: 36, marginRight: 15 }}
          />
          <Text
            style={[globalStyle.h2, {paddingTop:26, color:'#FFF', letterSpacing:0.1}]}
          >
            {stockSummary?.profile?.symbol} ex-Dividend for $
            {stockSummary?.events?.divPast?.amount} on{" "}
            {formatDateAnalysis(stockSummary?.events?.divPast?.payDate)}
          </Text>
        </View>
        <View
          style={[globalStyle.flexColumn, { marginLeft: 55,letterSpacing:0.14}]}
        >
          <Text style={[globalStyle.h2, {paddingTop: 5, color: "#FFF", letterSpacing:0.1}]}>
            {"\u2022"} Announce date:{" "}
            {formatDateAnalysis(stockSummary?.events?.divPast?.exdivDate)}
          </Text>
          <Text style={[globalStyle.h2, {paddingTop: 5, color: "#FFF", letterSpacing:0.1}]}>
            {"\u2022"} Record date:{" "}
            {formatDateAnalysis(stockSummary?.events?.divPast?.recordDate)}
          </Text>
          <Text style={[globalStyle.h2, {paddingTop: 5, color: "#FFF", letterSpacing:0.1}]}>
            {"\u2022"} Pay date:{" "}
            {formatDateAnalysis(stockSummary?.events?.divPast?.payDate)}
          </Text>
        </View>
        <View style={styles.iconTextRow}>
          <Image
            source={require("../../assets/img/inactive_calender.png")} // Path to your local icon
            style={{ marginTop: 10, width: 36, height: 36, marginRight: 15 }}
          />
          <Text
            style={[globalStyle.h2, {paddingTop:23, color:'#FFF', letterSpacing:0.1}]}
          >
            {stockSummary?.profile?.symbol} announced{" "}
            {stockSummary?.events?.earningsPast?.quarter} earnings.
          </Text>
        </View>
      </View>
      <View style={globalStyle.divider}></View>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20 }]}>Company profile</Text>
        <View style={[styles.iconTextRow, {paddingTop:20, gap:20}]}>
          <Text style={[globalStyle.h3]}>
            Sector
          </Text>
          <Text style={[globalStyle.h2, {color: "#20A5F1", letterSpacing:0.1}]}>
            {stockSummary?.profile?.sector}
          </Text>
        </View>
        <View style={[styles.iconTextRow, {paddingTop:12, gap:10}]}>
          <Text style={[globalStyle.h3]}>
            Industry
          </Text>
          <Text style={[globalStyle.h2, {color: "#20A5F1", letterSpacing:0.1}]}>
            {stockSummary?.profile?.industry}
          </Text>
        </View>
        <View style={styles.dividerUpcome}/>
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
          {stockSummary?.profile?.biography}
        </Text>
        
          <TouchableOpacity onPress={() => toggleExpanded}>
            <Text
              style={[globalStyle.h2,{ color: "#20A5F1", paddingTop:1}]}
            >
            {!expanded?'Show more':'Show less'}
            </Text>
          </TouchableOpacity>
        
        <View style={styles.dividerUpcome}/>
        <View style={[styles.iconTextRow, {paddingTop:12, gap:10}]}>
          <Text style={[globalStyle.h3]}>
            Country
          </Text>
          <Text style={[globalStyle.h2, {color: "#FFF", letterSpacing:0.1}]}>
            {stockSummary?.profile?.country}
          </Text>
        </View>
        <View style={[styles.iconTextRow, {paddingTop:12, gap:10}]}>
          <Text style={[globalStyle.h3]}>
            Exchange
          </Text>
          <Text style={[globalStyle.h2, {color: "#FFF", letterSpacing:0.1}]}>
            {stockSummary?.profile?.exchange}
          </Text>
        </View>
        <View style={[styles.iconTextRow, {paddingTop:12, gap:10}]}>
          <Text style={[globalStyle.h3]}>
            Headquarters
          </Text>
          <Text style={[globalStyle.h2, {color: "#FFF", letterSpacing:0.1, width: Dimensions.get('window').width - 102}]}>
            {stockSummary?.profile?.headquarter}
          </Text>
        </View>
        <View style={[styles.iconTextRow, {paddingTop:12, gap:10}]}>
          <Text style={[globalStyle.h3]}>
            CEO
          </Text>
          <Text style={[globalStyle.h2, {color: "#FFF", letterSpacing:0.1}]}>
            {stockSummary?.profile?.CEO}
          </Text>
        </View>
        <View style={[styles.iconTextRow, {paddingTop:12, gap:10}]}>
          <Text style={[globalStyle.h3]}>
            Website
          </Text>
          <Text style={[globalStyle.h2, {color: "#20A5F1", letterSpacing:0.1}]}>
            {stockSummary?.profile?.website}
          </Text>
        </View>
      </View>
      <View style={globalStyle.divider}></View>
      <View style={globalStyle.container}>
        <Text style={[globalStyle.heading, { marginTop: 20}]}>News</Text>
      </View>
      <FlatNews news={news} />
      </>}
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
  },
  statisticsValue: {
    fontSize: 12,
    textAlign: "right",
    color: "#FFF",
    fontWeight:'700',
    paddingRight: 8,
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
    paddingTop: 13,
  },
  tooltipChart:{
    position: 'absolute', 
    backgroundColor:'#0B1620', 
    borderRadius:4, 
    flexDirection:'column', 
    justifyContent:"space-evenly", 
    padding:3
  }
});
