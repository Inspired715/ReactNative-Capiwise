import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet
} from "react-native";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../../pages/Dashboard/Dashboard';
import WatchlistMain from '../../pages/watchlist/WatchlistMain';
import MarketsMain from "../../pages/markets/MarketsMain";
import NewsMain from "../../pages/news/NewsMain";
import NotificationsTab from "../../pages/notifications/NotificationsTab";
import { 
    MenuHome, MenuHomeActive, MenuWatchList, MenuWatchListActive, 
    MenuMarket, MenuMarketActive, MenuNews, MenuNewsActive, MenuInbox, 
    MenuInboxActive 
} from '../../assets/img/Constant';

const Tab = createBottomTabNavigator();

const Bottombar = () => {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                if (route.name === 'T_Home') {
                    return <View style={[styles.tabItem, {backgroundColor:focused?'#040B11':'transparent'}]}>
                            {focused?<MenuHomeActive />:<MenuHome/>}
                            <Text style={[styles.tabLabel, { color: focused?'#2EBD85': '#FFF', marginTop:-2}]}>
                                {route.name.substring(2)}
                            </Text>
                        </View>;
                } else if (route.name === 'T_Watchlist') {
                    return <View style={[styles.tabItem, {backgroundColor:focused?'#040B11':'transparent'}]}>
                            {focused?<MenuWatchListActive />:<MenuWatchList/>}
                            <Text style={[styles.tabLabel, { color: focused?'#2EBD85': '#FFF'}]}>
                                {route.name.substring(2)}
                            </Text>
                        </View>;
                } else if (route.name === 'T_Markets') {
                    return <View style={[styles.tabItem, {backgroundColor:focused?'#040B11':'transparent'}]}>
                            {focused?<MenuMarketActive />:<MenuMarket/>}
                            <Text style={[styles.tabLabel, { color: focused?'#2EBD85': '#FFF'}]}>
                                {route.name.substring(2)}
                            </Text>
                        </View>;
                }
                else if (route.name === 'T_News') {
                    return <View style={[styles.tabItem, {backgroundColor:focused?'#040B11':'transparent'}]}>
                            {focused?<MenuNewsActive />:<MenuNews/>}
                            <Text style={[styles.tabLabel, { color: focused?'#2EBD85': '#FFF'}]}>
                                {route.name.substring(2)}
                            </Text>
                        </View>;
                }
                else if (route.name === 'T_Inbox') {
                    return <View style={[styles.tabItem, {backgroundColor:focused?'#040B11':'transparent'}]}>
                            {focused?<MenuInboxActive />:<MenuInbox/>}
                            <Text style={[styles.tabLabel, { color: focused?'#2EBD85': '#FFF'}]}>
                                {route.name.substring(2)}
                            </Text>
                        </View>;
                }
            },
            tabBarStyle:{
                backgroundColor:'#0B1620',
                height:72,
                borderColor:'#0B1620',
            },
            tabBarShowLabel: false,
            headerShown: false
        })}
    >
      <Tab.Screen name="T_Home" component={Dashboard} />
      <Tab.Screen name="T_Watchlist" component={WatchlistMain} />
      <Tab.Screen name="T_Markets" component={MarketsMain} />
      <Tab.Screen name="T_News" component={NewsMain} />
      <Tab.Screen name="T_Inbox" component={NotificationsTab} options={{ tabBarBadge: 3 }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
    tabItem: {
        flexDirection:'column', 
        gap:3, 
        alignItems:'center', 
        justifyContent:'center', 
        width:70, 
        height:60, 
        borderRadius:30
    },
    tabItemImage:{
        width: 22, height: 22
    },
    tabLabel:{
        fontSize:10,
        letterSpacing: 1,
        fontWeight:700
    }
})
export default Bottombar;