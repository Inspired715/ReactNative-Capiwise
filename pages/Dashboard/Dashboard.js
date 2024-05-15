import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../../api/Api";
import { getRoundOffValue } from "../../utils/utils";
import { globalStyle } from "../../assets/css/globalStyle";
import { SearchIcon, AddWatchImage } from "../../assets/img/Constant"
import Loading from "../../components/loading/Loading"
import { LineChart } from "react-native-gifted-charts";
import FlatNews from "../../components/news/FlatNews";
import SymbolList from "../watchlist/SymbolList";
export default function Dashboard() {
  const [userAttributes, setUserAttributes] = useState({});
  const [stockList, setStockList] = useState([]);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const navigation = useNavigation();
  const [watchList, setWatchList] = useState([])
  const [viewMore, setViewMore] = useState(false)
  const handleStockSummary = (data) => {
    navigation.navigate("SummaryTab", {
      data: {
        key: data.symbol,
      },
    });
  };
  const handleProfile = () => {
    navigation.navigate("Profile2");
  };
  const handleNews = () => {
    navigation.navigate("T_News");
  };
  const handleMarkets = () => {
    navigation.navigate("T_Markets", {
      data: {
          activeTab:1
      },
  });
  };
  const handleExplore = () => {
    navigation.navigate("ExploreSearch");
  };
  const handleWatchList = () => {
    navigation.navigate("T_Watchlist");
  };
  const handleAdd = () => {
    navigation.navigate("ExploreSearch")
  }

  const getStockHistoricalData = async () => {
    let token = await AsyncStorage.getItem("userToken");
    const mail = await AsyncStorage.getItem("userEmail");
    
    await Api.getTrendingStockData(token, mail)
      .then(async (response) => {
        setStockList(response.data)
      })
      .catch((error) => {
        console.log('getStockHistoricalData', error)
      });
  };

  const getWatchList = async () => {
    let token = await AsyncStorage.getItem("userToken");
    let mail = await AsyncStorage.getItem("userEmail");
    await Api.getMyWatchList(token, mail)
      .then(async (response) => {
        setWatchList(response?.data)
      })
      .catch((error) => {
        console.log('watchlist', error)
      });

    setIsLoading(false);
  };

  const getUserInfo = async () => {
    const userAttribute = await AsyncStorage.getItem("userAttribute");
    setUserAttributes(JSON.parse(userAttribute))
  }

  const getNewsByCategory = async () => {
    const token = await AsyncStorage.getItem("userToken");

    await Api.getNewsByCategory("top", token)
      .then((response) => {
        res = JSON.parse(response)
        setNews(res?.data);
      })
      .catch((error) => {
        console.log('getNewsByCategory', error)
      });
  };

  useEffect(() => {
    getStockHistoricalData();
    getNewsByCategory();
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      getWatchList()
      getUserInfo()
    }, [])
  );

  return (
    <View style={{width:'100%', height:'100%', backgroundColor:'#040B11'}}>
      {isLoading ? <Loading /> : <>
        <View style={[globalStyle.container, globalStyle.justifyBetween, { backgroundColor: '#0B1620', height: 80, paddingBottom:10, alignItems: 'flex-end', top: 5, position: 'absolute', zIndex: 999 }]}>
          <TouchableOpacity onPress={handleProfile}>
            {userAttributes?.picture && userAttributes?.picture.charAt(0)=='h'?
              <Image source={{ uri: userAttributes?.picture }} style={{ width: 32, height: 32, borderRadius: 22}} /> :
              <View style={[globalStyle.alignItemsCenter, { justifyContent: 'center', width: 32, height: 32, backgroundColor: userAttributes?.picture?userAttributes?.picture:'#0F69FE', borderRadius: 22 }]}>
                <Text style={{ color: '#FFF' }}>
                  {userAttributes?.given_name
                    ? userAttributes?.given_name.charAt(0).toUpperCase()
                    : ""}
                  {userAttributes?.family_name
                    ? userAttributes?.family_name.charAt(0).toUpperCase()
                    : ""}
                </Text>
              </View>}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleExplore} style={{marginBottom:5}}>
            <SearchIcon/>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={[globalStyle.scrollContainer, {paddingTop:90}]}>
          <View style={globalStyle.container}>
            <View style={[globalStyle.justifyBetween, { marginTop: 16, alignItems: 'center' }]}>
              <Text style={globalStyle.h1}>
                Trending
              </Text>
              <TouchableOpacity onPress={handleMarkets}>
                <View style={styles.viewBtn}>
                  <Text style={{ color: "#FFF", fontSize: 11 }}>
                    View all
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={globalStyle.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 25 }}>
              <View style={[globalStyle.flexRow, { gap: 10 }]}>
                {stockList?.map((data, index) => (
                  <TouchableOpacity key={index} onPress={(e) => handleStockSummary(data)}>
                    <View style={styles.symbolCard}>
                      <Text style={[styles.symbolTitle]}>{data.symbol}</Text>
                      <Text style={{ fontSize: 10, color: "#FFF" }}>{data.name.length > 14 ? data.name.substring(0, 11) + '...' : data.name}</Text>
                      <Text style={styles.symbolTitle}>
                        ${getRoundOffValue(data.close)}
                      </Text>
                      <Text
                        style={{
                          color: data.change < 0 ? "#E2433B" : "#2EBD85",
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      >
                        {getRoundOffValue(data.change)} (
                        {getRoundOffValue(data.percent_change)}%)
                      </Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <LineChart
                          curved
                          data={[{ value: parseFloat(data.open) - parseFloat(data.low) }, { value: 0 }, { value: parseFloat(data.high) - parseFloat(data.low) }, { value: parseFloat(data.close) - parseFloat(data.low) }]}
                          height={25}
                          width={100}
                          maxValue={parseFloat(data.high) - parseFloat(data.low) === 0 ? 0.01 : (parseFloat(data.high) - parseFloat(data.low))}
                          hideRules
                          thickness={2}
                          initialSpacing={0}
                          color1={data.change < 0 ? "#E2433B" : "#2EBD85"}
                          hideDataPoints
                          yAxisColor="#0B1620"
                          xAxisColor="#979797"
                          yAxisLabelWidth={0}
                          adjustToWidth={true}
                          endSpacing={0}
                          xAxisType={"dotted"}
                          dashGap={1}
                          dashWidth={2}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          <View style={globalStyle.container}>
            <View style={[globalStyle.justifyBetween, { marginTop: 16, alignItems: 'center' }]}>
              <Text style={globalStyle.h1}>
                Top news
              </Text>
              <TouchableOpacity onPress={handleNews}>
                <View style={styles.viewBtn}>
                  <Text style={{ color: "#FFF", fontSize: 11 }}>
                    View all
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
          <FlatNews news={news} />
          <View style={styles.divider} />
          <View style={globalStyle.container}>
            <View style={[globalStyle.justifyBetween, { marginTop: 16, alignItems: 'center' }]}>
              <Text style={globalStyle.h1}>
                My watchlist
              </Text>
              {watchList?.length > 0 ?
                <TouchableOpacity onPress={handleWatchList}>
                  <View style={[styles.viewBtn]}>
                    <Text style={{ color: "#FFF", fontSize: 11 }}>
                      View all
                    </Text>
                  </View>
                </TouchableOpacity> : <>
                  <TouchableOpacity onPress={handleExplore}>
                    <View style={[styles.viewBtn, { width: 115 }]}>
                      <Text style={{ color: "#FFF", fontSize: 11 }}>
                        Search symbols
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              }
            </View>
          </View>
          <View style={[styles.divider, { marginTop: 16 }]} />
          {watchList?.length > 0 ?
            <>
            <SymbolList data={watchList?.slice(0, viewMore == true ? 10 : 5)} />
            {watchList?.length > 5 ?
              <TouchableOpacity onPress={() => setViewMore(!viewMore)} style={[globalStyle.justifyCenter, { marginTop: 20 }]}>
                <View style={[styles.viewBtn, { width: 180, height: 32 }]}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{viewMore == true ? "View less" : "View more"}</Text>
                </View>
              </TouchableOpacity> : <></>}
            </>
            :
            <View style={globalStyle.container}>
              <View style={styles.layout}>
                <View>
                  <Text style={styles.title}>Add symbols to your watchlist</Text>
                  <Text style={styles.title}>for quick access to your</Text>
                  <Text style={styles.title}>favourite companies</Text>
                </View>
                <View style={{ marginTop: 5 }}>
                  <AddWatchImage />
                </View>
                <TouchableOpacity onPress={handleAdd} style={[styles.confirmBtn, { backgroundColor: '#2EBD85' }]}>
                  <Text style={{ color: '#FFF' }}>+Add symbols</Text>
                </TouchableOpacity>
              </View>
            </View>
          }

        </ScrollView>
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    marginTop: 8,
    height: 0.5,
    backgroundColor: "#464646",
  },
  symbolCard: {
    width: 135,
    height: 160,
    backgroundColor: "#0B1620",
    flexDirection: "column",
    alignItems: "flex-start",
    borderRadius: 10,
    padding: 15,
    gap: 5
  },
  symbolTitle: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  TrendingStocks: {
    width: "100%",
    paddingTop: 25,
  },
  layout: {
    flexDirection: 'column',
    backgroundColor: '#0B1620',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginTop: 20
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    textAlign: 'center'
  },
  confirmBtn: {
    width: '100%',
    height: 50,
    marginTop: 25,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  viewBtn: {
    width: 74,
    height: 24,
    backgroundColor: '#2EBD85',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
