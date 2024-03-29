// UpdateCategoryForm.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { useNavigation } from "@react-navigation/native"

const UpdateCategoryForm = ({route}) => {
    const { id, name } = route.params;

    const [updatedName, setUpdatedName] = useState(name);
    const navigation = useNavigation()

    const handleUpdateCategory = () => {
        const updatedCategory = {
            name: updatedName
        };

        axios.put(`${baseURL}categories/${id}`, updatedCategory)
            .then(response => {
                // Handle successful update
                navigation.goBack(); // Navigate back to Categories screen after update
            })
            .catch(error => {
                // Handle error
                console.error('Error updating category:', error);
            });
    };

    return (
        <View style={styles.container}>
            <Text>Edit Category</Text>
            <TextInput
                style={styles.input}
                placeholder="Category Name"
                value={updatedName}
                onChangeText={text => setUpdatedName(text)}
            />
            <Button title="Update Category" onPress={handleUpdateCategory} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default UpdateCategoryForm;
