import Input from "../../Shared/Form/Input";
import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from 'react-native'
import FormContainer from "../../Shared/Form/FormContainer";
import Error from '../../Shared/Error'
import { Button } from "native-base";
import AuthGlobal from '../../Context/Store/AuthGlobal'
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../../Context/Actions/Auth.actions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import EasyButton from "../../Shared/StyledComponents/EasyButton";

const Login = (props) => {
    const context = useContext(AuthGlobal)
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState("")

    useEffect(() => {
        if (context.stateUser.isAuthenticated === true) {
            navigation.navigate("User Profile")
        }
    }, [context.stateUser.isAuthenticated])

    const handleSubmit = () => {
        if (email === "" || password === "") {
            Alert.alert("Validation Error", "Please fill in your email and password.")
        } else {
            const user = {
                email,
                password,
            };
            loginUser(user, context.dispatch);
        }
    }

    AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (error, stores) => {
            stores.map((result, i, store) => {
                console.log({ [store[i][0]]: store[i][1] });
                return true;
            });
        });
    });

    return (
        <FormContainer>
            <Input
                placeholder={"Enter email"}
                name={"email"}
                id={"email"}
                value={email}
                onChangeText={(text) => setEmail(text.toLowerCase())}
            />
            <Input
                placeholder={"Enter Password"}
                name={"password"}
                id={"password"}
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <View style={styles.buttonGroup}>
                {error ? <Error message={error} /> : null}
                <EasyButton
                    large
                    primary
                    onPress={() => handleSubmit()}
                >
                    <Text style={{ color: "white" }}>Login</Text>
                </EasyButton>
            </View>
            <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
                <Text style={styles.middleText}>Don't Have an Account yet?</Text>
                <EasyButton
                    large
                    secondary
                    onPress={() => navigation.navigate("Register")}
                >
                    <Text style={{ color: "white" }}>Register</Text>
                </EasyButton>
            </View>
        </FormContainer>
    )
}

const styles = StyleSheet.create({
    buttonGroup: {
        width: "80%",
        alignItems: "center",
    },
    middleText: {
        marginBottom: 20,
        alignSelf: "center",
    },
});

export default Login;
