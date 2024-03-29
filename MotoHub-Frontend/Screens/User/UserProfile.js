import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
  TextInput,
} from "react-native";
import { Container } from "native-base";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import baseURL from "../../assets/common/baseurl";

import AuthGlobal from "../../Context/Store/AuthGlobal";
import { logoutUser } from "../../Context/Actions/Auth.actions";
import OrderCard from "../../Shared/OrderCard";

const UserProfile = (props) => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState("");
  const [orders, setOrders] = useState([]);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        navigation.navigate("Login");
      }
      console.log("context", context.stateUser.user);
      AsyncStorage.getItem("jwt")
        .then((res) => {
          axios
            .get(`${baseURL}users/${context.stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((user) => setUserProfile(user.data));
        })
        .catch((error) => console.log(error));
      axios
        .get(`${baseURL}orders`)
        .then((x) => {
          const data = x.data;
          console.log(data);
          const userOrders = data.filter((order) =>
            // console.log(order)
            order.user
              ? order.user._id === context.stateUser.user.userId
              : false
          );
          setOrders(userOrders);
        })
        .catch((error) => console.log(error));
      return () => {
        setUserProfile();
        setOrders();
      };
    }, [context.stateUser.isAuthenticated])
  );

  return (
    <Container style={styles.container}>
      <ScrollView contentContainerStyle={styles.subContainer}>
        {/* <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={updatedName}
                    onChangeText={text => setUpdatedName(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={updatedEmail}
                    onChangeText={text => setUpdatedEmail(text)}
                />
                <Button title="Update Profile" onPress={handleUpdateProfile} /> */}

        <Text style={[styles.text, styles.header]}>
          {userProfile ? userProfile.name : ""}
        </Text>
        <View style={{ marginTop: 20 }}>
          <Text style={[styles.text, styles.subtitle]}>
            Email: {userProfile ? userProfile.email : ""}
          </Text>
          <Text style={[styles.text, styles.subtitle]}>
            Phone: {userProfile ? userProfile.phone : ""}
          </Text>
        </View>
        
        <View style={{ marginTop: 40 }}>
          <Button
            title={"Update Profile"}
            onPress={() => [navigation.navigate("Update Profile")]}
          />
          <View style={{ marginTop: 80 }}>
          <Button
            title={"Sign Out"}
            onPress={() => [
              AsyncStorage.removeItem("jwt"),
              logoutUser(context.dispatch),
            ]}
          />
        </View>
          <View style={styles.order}>
            <Text style={[styles.text, styles.sectionTitle]}>My Orders</Text>
            <View>
              {orders ? (
                orders.map((order) => {
                  return (
                    <OrderCard key={order.id} item={order} select="false" />
                  );
                })
              ) : (
                <View style={styles.order}>
                  <Text style={[styles.text, styles.noOrders]}>
                    You have no orders
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    // paddingVertical: 40,
    backgroundColor: "#203354",
    //width: '90%'
  },
  subContainer: {
    alignItems: "center",
    marginTop: 60,
    marginRight: 30,
    marginLeft: 30,
  },
  order: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 60,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    width: "80%",
    paddingHorizontal: 10,
  },
  text: {
    textAlign: "center",
    color: "white",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noOrders: {
    fontStyle: "italic",
  },
});

export default UserProfile;
