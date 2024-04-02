import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Linking } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from '@react-navigation/native';
import { Button, Center } from "native-base";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import { Camera } from 'expo-camera';
var { height, width } = Dimensions.get("window");
import mime from "mime";
import * as ImagePicker from "expo-image-picker";

import * as Location from 'expo-location';

const Register = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [image, setImage] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [launchCam, setLaunchCam] = useState(false);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [type, setType] = useState(Camera.Constants.Type.back);
    const navigation = useNavigation();

    const register = () => {
        if (email === "" || name === "" || phone === "" || password === "") {
            setError("Please fill in all the fields.");
            return;
        }

        let formData = new FormData();
        const newImageUri = "file:///" + image.split("file:/").join("");

        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("phone", phone);
        formData.append("isAdmin", false);
        formData.append("image", {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop()
        });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        };

        axios.post(`${baseURL}users/register`, formData, config)
            .then((res) => {
                if (res.status === 200) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Registration Succeeded",
                        text2: "Please log in to your account.",
                    });
                    setTimeout(() => {
                        navigation.navigate("Login");
                    }, 500);
                }
            })
            .catch((error) => {
                Toast.show({
                    position: 'bottom',
                    bottomOffset: 20,
                    type: "error",
                    text1: "Something went wrong",
                    text2: "Please try again",
                });
                console.log(error.message);
            });
    }

    const addPhoto = async () => {
        setLaunchCam(true);
        if (camera) {
            const data = await camera.takePictureAsync(null);
            setImage(data.uri);
            setMainImage(data.uri);
            setLaunchCam(false);
        }
    }

    const takePicture = async () => {
        setLaunchCam(true);

        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPermission.status !== "granted") {
            setError("Permission to access camera denied.");
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            aspect: [4, 3],
            quality: 0.1,
        });

        if (!result.cancelled) {
            setMainImage(result.assets[0].uri);
            setImage(result.assets[0].uri);
        }
        setLaunchCam(false);
    };

    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location denied.');
            return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
        setLocation(currentLocation);
    }

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
        })();
    }, []);

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <FormContainer title={"Register"}>
                {launchCam ?
                    <Center width={width} >
                        <View style={styles.cameraContainer}>
                            <Camera
                                ref={ref => setCamera(ref)}
                                style={styles.fixedRatio}
                                type={type}
                                ratio={'1:1'} />
                        </View>
                        <Button variant={"ghost"} onPress={() => takePicture()}><Text> Take Photo</Text></Button>
                        <Button variant={"ghost"} onPress={() => setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}><Text>Flip Camera</Text></Button>
                    </Center> : null}

                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: mainImage }} />
                    <TouchableOpacity onPress={addPhoto} style={styles.imagePicker}>
                        <Icon style={{ color: "white" }} name="camera" />
                    </TouchableOpacity>
                </View>

                <Input placeholder={"Email"} name={"email"} id={"email"} onChangeText={(text) => setEmail(text.toLowerCase())} />
                <Input placeholder={"Name"} name={"name"} id={"name"} onChangeText={(text) => setName(text)} />
                <Input placeholder={"Phone Number"} name={"phone"} id={"phone"} keyboardType={"numeric"} onChangeText={(text) => setPhone(text)} />
                <Input placeholder={"Password"} name={"password"} id={"password"} secureTextEntry={true} onChangeText={(text) => setPassword(text)} />

                {error ? <Error message={error} /> : null}

                <View style={styles.buttonGroup}>
                    <Button style={{ color: "white", backgroundColor: "lightgreen", padding: 10 }} onPress={() => register()}>
                        <Text>Register</Text>
                    </Button>
                </View>

                <View>
                    <Button style={{ color: "white", backgroundColor: "black", marginBotom: 10 }} onPress={() => navigation.navigate("Login")}>
                        <Text style={{ color: "white", backgroundColor: "black", }}>Back to Login</Text>
                    </Button>

                    <Button style={{ color: "white", backgroundColor: "lightblue", padding: 10, marginTop: 10 }} onPress={getLocation}>
                        <Text style={{ color: "black" }}>Get Location</Text>
                    </Button>
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    buttonGroup: {
        width: "80%",
        margin: 10,
        alignItems: "center",
    },
    imageContainer: {
        width: 200,
        height: 200,
        borderStyle: "solid",
        borderWidth: 8,
        padding: 0,
        justifyContent: "center",
        borderRadius: 100,
        borderColor: "#E0E0E0",
        elevation: 10
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 100
    },
    imagePicker: {
        position: "absolute",
        right: 5,
        bottom: 5,
        backgroundColor: "grey",
        padding: 8,
        borderRadius: 100,
        elevation: 20
    },
    cameraContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    }
});

export default Register;
