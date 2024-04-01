import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity } from "react-native"; 
import { Center, Heading } from 'native-base';
import { useDispatch } from 'react-redux';
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import TrafficLight from '../../Shared/StyledComponents/TrafficLight';
import { addToCart } from '../../Redux/Actions/cartActions';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 

const SingleProduct = ({ route }) => {
    const { item } = route.params;
    const dispatch = useDispatch();

    const [availability, setAvailability] = useState('');
    const [availabilityText, setAvailabilityText] = useState("");
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [productRatings, setProductRatings] = useState({});

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

        loadCommentsAndRatingFromStorage();

        return () => {
            setAvailability(null);
            setAvailabilityText("");
        }
    }, [item.countInStock]);

    const loadCommentsAndRatingFromStorage = async () => {
        try {
            const storedComments = await AsyncStorage.getItem(`comments_${item.id}`);
            if (storedComments) {
                setComments(JSON.parse(storedComments));
            }

            const storedRating = await AsyncStorage.getItem(`rating_${item.id}`);
            if (storedRating) {
                setProductRatings(prev => ({
                    ...prev,
                    [item.id]: parseInt(storedRating)
                }));
            } else {
                setProductRatings(prev => ({
                    ...prev,
                    [item.id]: 0
                }));
            }
        } catch (error) {
            console.error('Error loading data from AsyncStorage: ', error);
        }
    };

    const handleAddComment = async () => {
        if (comment.trim() !== "") {
            const updatedComments = [...comments, { text: comment, rating: productRatings[item.id] || 0 }];
            setComments(updatedComments);
            setComment("");
            try {
                await AsyncStorage.setItem(`comments_${item.id}`, JSON.stringify(updatedComments));
            } catch (error) {
                console.error('Error saving comments to AsyncStorage: ', error);
            }
        }
    };

    const handleRating = async (newRating, commentIndex) => {
        const updatedComments = comments.map((c, index) => {
            if (index === commentIndex) {
                return { ...c, rating: newRating };
            }
            return c;
        });
        setComments(updatedComments);
        setProductRatings(prev => ({
            ...prev,
            [item.id]: newRating
        }));
        try {
            await AsyncStorage.setItem(`comments_${item.id}`, JSON.stringify(updatedComments));
        } catch (error) {
            console.error('Error saving comments to AsyncStorage: ', error);
        }
    };

    const renderStarRating = (rating, commentIndex) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => handleRating(i, commentIndex)}>
                    <FontAwesome
                        name={rating >= i ? 'star' : 'star-o'}
                        size={24}
                        color={rating >= i ? '#FFD700' : '#ccc'}
                    />
                </TouchableOpacity>
            );
        }
        return stars;
    };

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
                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>Rate this product:</Text>
                    <View style={styles.starContainer}>
                        {renderStarRating(productRatings[item.id], -1)}
                    </View>
                </View>
                <View style={styles.commentContainer}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Add a comment"
                        value={comment}
                        onChangeText={(text) => setComment(text)}
                    />
                    <EasyButton
                        primary
                        small
                        onPress={handleAddComment}
                        style={styles.addCommentButton}
                    >
                        <Text style={{ color: "white" }}>Submit</Text>
                    </EasyButton>
                </View>
                <View style={styles.commentsSection}>
                    <Heading size="md" style={styles.commentsHeader}>Comments and Ratings</Heading>
                    {comments.map((comment, index) => (
                        <View key={index} style={styles.commentItem}>
                            <Text style={styles.commentText}>{comment.text}</Text>
                            <View style={styles.ratingStars}>
                                <Text>Rating:</Text>
                                {renderStarRating(comment.rating, index)}
                            </View>
                        </View>
                    ))}
                </View>
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
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    ratingText: {
        marginRight: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    starContainer: {
        flexDirection: 'row',
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginRight: 10
    },
    commentInput: {
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10
    },
    commentsSection: {
        marginBottom: 20
    },
    commentsHeader: {
        marginBottom: 10
    },
    commentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    },
    commentText: {
        fontSize: 16,
        flex: 1
    },
    ratingStars: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteButton: {
        height: 40,
        width: 90
    },
    addCommentButton: {
        height: 40,
        width: 90
    }
});

export default SingleProduct;
