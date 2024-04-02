import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Dimensions, StyleSheet } from "react-native";
import { LineChart, ProgressChart, PieChart } from "react-native-chart-kit";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";

// import axios from 'axios'
// import baseURL from "../../assets/common/baseurl";
// import { useFocusEffect } from '@react-navigation/native'
const screenWidth = Dimensions.get("window").width;

const Charts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseURL}products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  // const dataLine = {
  //   labels: ["January", "February", "March", "April", "May", "June"],
  //   datasets: [
  //     {
  //       data: [20, 45, 28, 80, 99, 43],
  //       color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
  //       strokeWidth: 2, // optional
  //     },
  //   ],
  //   legend: ["Rainy Days"], // optional
  // };

  // const dataProgress = {
  //   labels: ["Swim", "Bike", "Run"], // optional
  //   data: [0.4, 0.6, 0.8],
  // };

  const dataPie1 = products.reduce((acc, product) => {
    const categoryIndex = acc.findIndex(
      (item) => item.name === product.category.name
    );
    if (categoryIndex === -1) {
      acc.push({
        name: product.category.name,
        count: 1,
        color: getRandomColor(),
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      });
    } else {
      acc[categoryIndex].count++;
    }
    return acc;
  }, []);

  const dataPie2 = products.reduce((acc, product) => {
    const productName = product.name;
    const StockIndex = acc.findIndex(
      (item) => item.name === productName
    );
    if (StockIndex === -1) {
      acc.push({
        name: productName,
        total: product.countInStock,
        withStocks: product.countInStock > 0 ? 1 : 0,
        withoutStocks: product.countInStock === 0 ? 1 : 0,
        color: getRandomColor(),
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      });
    } else {
      acc[StockIndex].total++;
      if (product.countInStock > 0) {
        acc[StockIndex].withStocks++;
      } else {
        acc[StockIndex].withoutStocks++;
      }
    }
    return acc;
  }, []);

  return (
    // <View>
    <ScrollView>
      {/* <View style={[styles.center]}>
        <Text style={[styles.title]}>Products Sales</Text>
        <LineChart
          data={dataLine}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
        />
      </View> */}

      <View style={[styles.center]}>
        <Text style={[styles.title]}>Products Categories</Text>
        <PieChart
          data={dataPie1}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          accessor={"count"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          center={[10, 50]}
          absolute
        />
      </View>

      <View style={[styles.center]}>
        <Text style={[styles.title]}>Products Stocks</Text>
        <PieChart
          data={dataPie2}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          accessor="total"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 50]}
          absolute
          // Display additional information in the tooltip
          tooltipTextRenderer={({ value, name }) =>
            `${name}: ${value} (${
              dataPie2.find((item) => item.name === name).withStocks
            } with stocks, ${
              dataPie2.find((item) => item.name === name).withoutStocks
            } without stocks)`
          }
        />
      </View>

      {/* <View style={[styles.center]}>
        <Text style={[styles.title]}>Pending</Text>
        <ProgressChart
          data={dataProgress}
          width={screenWidth}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={chartConfig}
          hideLegend={false}
        />
      </View> */}
    </ScrollView>
    // </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: "green",
    marginBottom: 10,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 30,
  },
});

export default Charts;

const getRandomColor = () => {
  return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)}, 1)`;
};
