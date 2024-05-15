import React, { useEffect, useState } from "react";
import {ScrollView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../../api/Api";
import CardNews from "../../components/news/CardNews";
import { globalStyle } from "../../assets/css/globalStyle";
import Loading from "../../components/loading/Loading"

export default function TopNews() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

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
    getNewsByCategory();
    setIsLoading(false)
  }, []);

  return (
    <ScrollView contentContainerStyle={globalStyle.scrollContainer}>
      {isLoading?<Loading />:<CardNews news={news} />}
    </ScrollView>
  )
}