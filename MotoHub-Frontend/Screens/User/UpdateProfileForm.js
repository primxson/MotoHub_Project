// UpdateProfileForm.js
import React, { useContext, useState  } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios"
import baseURL from "../../assets/common/baseurl"
import AuthGlobal from "../../Context/Store/AuthGlobal"

const UpdateProfileForm = ({ navigation }) => {
  const context = useContext(AuthGlobal)
  const [userProfile, setUserProfile] = useState('')
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');

  const handleUpdateProfile = () => {
    const updatedProfile = { name: updatedName, email: updatedEmail };
    AsyncStorage.getItem("jwt")
        .then((res) => {
            axios
                .put(`${baseURL}users/${context.stateUser.user.userId}`, updatedProfile, {
                    headers: { Authorization: `Bearer ${res}` },
                })
                .then((response) => {
                    console.log("Profile Updated Successfully", response.data);
                    setUserProfile(response.data); // Update userProfile state with the updated data
                })
                .catch((error) => console.log(error))
        })
        .catch((error) => console.log(error))
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      <TextInput
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
      <Button title="Update Profile" onPress={handleUpdateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#203354",
    // Set background color to gold
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white', // Set background color to white for input fields
  },
});

export default UpdateProfileForm;
