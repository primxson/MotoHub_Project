import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Center, VStack, Input, Icon, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";

import ProductList from "./ProductList";
import SearchedProduct from "./SearchedProduct";
import Banner from "../../Shared/Banner";
import CategoryFilter from "./CategoryFilter";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";

const { width, height } = Dimensions.get("window");

const ProductContainer = () => {
    const [products, setProducts] = useState([]);
    const [productsFiltered, setProductsFiltered] = useState([]);
    const [focus, setFocus] = useState(false);
    const [categories, setCategories] = useState([]);
    const [active, setActive] = useState([]);
    const [initialState, setInitialState] = useState([]);
    const [productsCtg, setProductsCtg] = useState([]);

    useFocusEffect(
        useCallback(() => {
            setFocus(false);
            setActive(-1);
            
            axios.get(`${baseURL}products`)
                .then((res) => {
                    setProducts(res.data);
                    setProductsFiltered(res.data);
                    setProductsCtg(res.data);
                    setInitialState(res.data);
                })
                .catch((error) => {
                    console.log('Api call error');
                });

            axios.get(`${baseURL}categories`)
                .then((res) => {
                    setCategories(res.data);
                })
                .catch((error) => {
                    console.log('Api categories call error', error);
                });

            return () => {
                setProducts([]);
                setProductsFiltered([]);
                setFocus();
                setCategories([]);
                setActive();
                setInitialState();
            };
        }, [])
    );

    const searchProduct = (text) => {
        setProductsFiltered(
            products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
        );
    };

    const openList = () => {
        setFocus(true);
    };

    const onBlur = () => {
        setFocus(false);
    };

    const changeCtg = (ctg) => {
        if (ctg === "all") {
            setProductsCtg(initialState);
            setActive(true);
        } else {
            setProductsCtg(
                products.filter((i) => (i.category !== null && i.category.id) === ctg),
            );
            setActive(true);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Center>
                <VStack w="100%" space={5} alignSelf="center">
                    <Input
                        onFocus={openList}
                        onChangeText={(text) => searchProduct(text)}
                        placeholder="Search"
                        variant="filled"
                        width="100%"
                        borderRadius="10"
                        py="1"
                        px="2"
                        InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="search" />} />}
                        InputRightElement={focus === true ? <Icon ml="2" size="4" color="gray.400" as={<Ionicons name="close" size="12" color="black" onPress={onBlur} />} /> : null}
                    />
                </VStack>
                {focus === true ? (
                    <SearchedProduct
                        productsFiltered={productsFiltered}
                    />
                ) : (
                    <View>
                        <Banner />
                        <CategoryFilter
                            categories={categories}
                            categoryFilter={changeCtg}
                            productsCtg={productsCtg}
                            active={active}
                            setActive={setActive}
                        />
                        {productsCtg.length > 0 ? (
                            <View style={styles.listContainer}>
                                {productsCtg.map((item) => (
                                    <ProductList
                                        key={item._id.$oid}
                                        item={item}
                                    />
                                ))}
                            </View>
                        ) : (
                            <View style={styles.center}>
                                <Text>No products found</Text>
                            </View>
                        )}
                    </View>
                )}
            </Center>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 60, // Added paddingBottom to prevent content cutoff
    },
    listContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
        minHeight: height / 2,
    },
});

export default ProductContainer;
