import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, ScrollView } from "react-native";
import { Center, Heading } from 'native-base';
import { useDispatch } from 'react-redux';
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import TrafficLight from '../../Shared/StyledComponents/TrafficLight';
import { addToCart } from '../../Redux/Actions/cartActions';
import Toast from 'react-native-toast-message';

const SingleProduct = ({ route }) => {
    const { item } = route.params; // Extracting item from route.params
    const dispatch = useDispatch();

    const [availability, setAvailability] = useState('');
    const [availabilityText, setAvailabilityText] = useState("");

    useEffect(() => {
        if (item.countInStock === 0) {
            setAvailability(<TrafficLight unavailable />);
            setAvailabilityText("Unavailable");
        } else if (item.countInStock <= 5) {
            setAvailability(<TrafficLight limited />);
            setAvailabilityText("Limited Stock");
        } else {
            setAvailability(<TrafficLight available />);
            setAvailabilityText("Available");
        }

        return () => {
            setAvailability(null);
            setAvailabilityText("");
        }
    }, [item.countInStock]);

    return (
        <Center flexGrow={1}>
            <ScrollView style={{ marginBottom: 80, padding: 5 }}>
                <View>
                    <Image
                        source={{
                            uri: item.image ? item.image : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png'
                        }}
                        resizeMode="contain"
                        style={styles.image}
                    />
                </View> 
                <View style={styles.contentContainer}>
                    <Text style={styles.price}>$ {item.price}</Text>
                    <Heading style={styles.contentHeader} size='xl'>{item.name}</Heading>
                    <Text style={styles.contentText}>{item.brand}</Text>
                </View>
                <View style={styles.availabilityContainer}>
                    <View style={styles.availability}>
                        <Text style={{ marginRight: 10 }}>
                            Availability: {availabilityText}
                        </Text>
                        {availability}
                    </View>
                    <Text>{item.description}</Text>
                </View>
                <EasyButton
                    primary
                    medium
                    onPress={() => {
                        dispatch(addToCart({ ...item, quantity: 1 }));
                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: `${item.name} added to Cart`,
                            text2: "Go to your cart to complete order"
                        });
                    }}
                >
                    <Text style={{ color: "white" }}> Add</Text>
                </EasyButton>
            </ScrollView>
        </Center >
    );
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 1
    },
    contentContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentHeader: {
        fontWeight: 'bold',
        marginBottom: 20
    },
    contentText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    },
    price: {
        fontSize: 30,
        margin: 0,
        color: 'blue',
        fontWeight: 'bold'
    },
    availabilityContainer: {
        marginBottom: 20,
        alignItems: "center"
    },
    availability: {
        flexDirection: 'row',
        marginBottom: 10,
    }
});

export default SingleProduct;
