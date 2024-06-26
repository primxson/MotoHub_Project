import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import baseURL from "../../assets/common/baseurl";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import UpdateCategoryForm from "../../Screens/Admin/UpdateCategoryForm";

var { width } = Dimensions.get("window");

const Item = (props) => {
  const navigation = useNavigation();

  return (
    <View style={styles.item}>
      <Text>{props.item.name}</Text>
      <EasyButton
        secondary
        medium
        onPress={() =>
          navigation.navigate("UpdateCategoryForm", {
            id: props.item._id,
            name: props.item.name,
          })
        } // Navigate to UpdateCategoryForm screen with necessary data
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Update</Text>
      </EasyButton>
      <EasyButton danger medium onPress={() => props.delete(props.item._id)}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
      </EasyButton>
    </View>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [token, setToken] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    axios
      .get(`${baseURL}categories`)
      .then((res) => setCategories(res.data))
      .catch((error) => alert("Error loading categories"));

    return () => {
      setCategories([]);
      setToken("");
    };
  }, []);

  const addCategory = async () => {
    if (!categoryName.trim() && !categoryImage) {
      Alert.alert("Error", "Category name and image are empty.");
    } else if (!categoryName.trim()) {
      Alert.alert("Error", "Category name is empty.");
    } else if (!categoryImage) {
      Alert.alert("Error", "Category image is empty.");
    } else {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("name", categoryName);

      if (categoryImage) {
        formData.append("image", {
          uri: categoryImage.uri,
          type: "image/jpeg",
          name: `category_${Date.now()}.jpg`,
        });
      }

      try {
        const response = await axios.post(
          `${baseURL}categories`,
          formData,
          config
        );
        console.log(response.data);
        setCategoryName("");
        setCategoryImage(null);
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const selectedImage = result.assets[0];
      setCategoryImage(selectedImage);
    }
  };

  const deleteCategory = (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .delete(`${baseURL}categories/${id}`, config)
      .then((res) => {
        const newCategories = categories.filter((item) => item.id !== id);
        setCategories(newCategories);
      })
      .catch((error) => alert("Error deleting categories"));
  };

  return (
    <View style={{ position: "relative", height: "100%" }}>
      <View style={{ marginBottom: 60 }}>
        <FlatList
          data={categories}
          renderItem={({ item, index }) => (
            <Item item={item} index={index} delete={deleteCategory} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={styles.bottomBar}>
        <View>
          <Text>Add</Text>
        </View>
        <View style={{ width: width / 2.5 }}>
          <TextInput
            value={categoryName}
            style={styles.input}
            onChangeText={(text) => setCategoryName(text)}
          />
        </View>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {categoryImage ? (
            <Image
              source={{ uri: categoryImage.uri }}
              style={{ width: 80, height: 50 }}
            />
          ) : (
            <Text>Select Image</Text>
          )}
        </TouchableOpacity>
        <View>
          <EasyButton medium primary onPress={() => addCategory()}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Submit</Text>
          </EasyButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: "white",
    width: width,
    height: 60,
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
  },
  item: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
    padding: 5,
    margin: 5,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
  },
  imagePicker: {
    width: "20%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 4,
  },
});

export default Categories;
