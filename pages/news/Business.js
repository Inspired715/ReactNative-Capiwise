import React, { useEffect, useState } from "react";
import {ScrollView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../../api/Api";
import CardNews from "../../components/news/CardNews";
import { globalStyle } from "../../assets/css/globalStyle";
import Loading from "../../components/loading/Loading"
import FlatNews from "../../components/news/FlatNews"
export default function Business() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const getNewsByCategory = async () => {
    const token = await AsyncStorage.getItem("userToken");

    await Api.getNewsByCategory("business", token)
    .then((response) => {
      res = JSON.parse(response)
      setNews(res?.data);
    })
    .catch((error) => {
      console.log('getNewsByCategory', error)
    });
  };

  useEffect(() => {
    getNewsByCategory();
    setIsLoading(false)
  }, []);

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      {isLoading?<Loading />:
      <>
      <CardNews news={news.slice(0, 1)} />
      <FlatNews news={news.slice(1)} />
      </>
      }
    </ScrollView>
  )
}