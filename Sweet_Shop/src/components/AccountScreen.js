import React, { useEffect, useState } from "react";
import { View, Image, TextInput, Button } from "react-native";
import { Text } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import api from "../utils/api";
import Preloader from "../components/Preloader";

const AccountScreen = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const res = await api.get("/users/me");
      setUser(res.data);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleUpdate = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("phone", user.phone);
    formData.append("address", user.address);
    if (image) {
      formData.append("image", {
        uri: image,
        name: "profile.jpg",
        type: "image/jpeg",
      });
    }
    await api.put("/users/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setLoading(false);
    alert("Profile updated!");
  };

  if (loading) return <Preloader visible={true} />;

  return (
    <View style={{ padding: 20 }}>
      <Image
        source={
          image
            ? { uri: image }
            : user.image
            ? { uri: user.image }
            : require("../../assets/default-avatar.png")
        }
        style={{ width: 120, height: 120, borderRadius: 60, alignSelf: "center" }}
      />
      <Button title="Change Photo" onPress={pickImage} />

      <Text>Name</Text>
      <TextInput
        value={user.name}
        onChangeText={(val) => setUser({ ...user, name: val })}
      />

      <Text>Phone</Text>
      <TextInput
        value={user.phone}
        onChangeText={(val) => setUser({ ...user, phone: val })}
      />

      <Text>Address</Text>
      <TextInput
        value={user.address}
        onChangeText={(val) => setUser({ ...user, address: val })}
      />

      <Button title="Save Changes" onPress={handleUpdate} />
    </View>
  );
};

export default AccountScreen;
