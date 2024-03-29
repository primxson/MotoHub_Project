import React from "react"
import { StyleSheet, Image, SafeAreaView, View } from "react-native"

const Header = () => {
    return (
        //<View style={styles.header}>
        <SafeAreaView style={styles.header}>
            <Image
                source={require("../assets/Logo.jpg")}
                resizeMode="contain"
                style={{ height: 90 }}
            />

        </SafeAreaView>
        //</View>
    )
}

const styles = StyleSheet.create({
    header: {
      width: "100%",
      flexDirection: 'row',
      alignContent: "center",
      justifyContent: "center",
      padding: 1,
      marginTop: 28,
      backgroundColor: "#152238", // Change "blue" to the color you wan
    }
  })

export default Header