import { Picker } from "@react-native-community/picker";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, ScrollView } from "react-native";
import { Dimensions } from "react-native";

import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BackIcon from "../components/BackIcon";
import { ContinueBtn } from "../components/ContinueBtn";
import { Logout, logout } from "../store/AuthSlice";
import { getDatabase } from "../store/DBSlice";

const { width, height } = Dimensions.get("window");

const Details = () => {
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [tempLocation, setTempLocation] = useState(null);
  const [subType, setSubType] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState("m1");
  const { meals } = useSelector(getDatabase);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const onChangeText = (text) => {
    setName(text);
  };

  const onChangePhone = (val) => {
    setPhone(val);
  };

  const onPickerValueChange = (value) => {
    setSelectedMeal(value);
  };

  const onPressContinue = () => {
    if (!name || name === "") {
      alert("Name cannot be empty.");
      return;
    }
    if (!phone.match(/[0-9]{10}/)) {
      alert("Incorrect Phone number!");
      return;
    }
    navigation.navigate("Email", {
      name,
      phone,
      tempLocation,
      selectedMeal,
      subType,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: "#FFFFFF",
        marginTop: height * 0.12,
        paddingTop: height * 0.02,
      }}
    >
      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.label}>Enter User's name</Text>
        <TextInput
          style={styles.txtInput}
          placeholder={"John Doe"}
          value={name}
          onChangeText={onChangeText}
        />
        <Text style={styles.label}>Enter Phone Number</Text>
        <TextInput
          style={styles.txtInput}
          placeholder={"10 Digit contact number"}
          value={phone}
          onChangeText={(val) => {
            if (val.toString().length <= 10) onChangePhone(val);
          }}
          keyboardType={"phone-pad"}
        />
        <Text style={styles.label}>Enter User's Location</Text>
        <TextInput
          style={styles.txtInput}
          placeholder={"Enter Rough Location like Area/Locality here"}
          value={tempLocation}
          onChangeText={(val) => {
            setTempLocation(val);
          }}
        />
        <Text style={styles.label}>Meal</Text>
        <View
          style={{
            borderBottomWidth: 1,
            marginHorizontal: width * 0.05,
            borderColor: "#009387",
          }}
        >
          <Picker
            selectedValue={selectedMeal}
            style={styles.picker}
            onValueChange={onPickerValueChange}
          >
            {meals.data.map((meal) => {
              console.log("title " + meal.title + " key " + meal.key);
              return <Picker.Item label={meal.title} value={meal.key} />;
            })}
          </Picker>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingVertical: 20,
            paddingLeft: width * 0.05,
          }}
        >
          <Text>Weekly</Text>
          <Switch
            value={subType}
            onValueChange={() => {
              setSubType(!subType);
            }}
            thumbColor={"#009387"}
          />
          <Text>Monthy</Text>
        </View>

        <Text style={styles.label}>Cost</Text>
        <TextInput
          style={styles.txtInput}
          editable={false}
          value={
            subType
              ? meals?.data
                  .find((meal) => meal.key === selectedMeal)
                  .monthlyPrice.toString()
              : meals?.data
                  .find((meal) => meal.key === selectedMeal)
                  .weeklyPrice.toString()
          }
        />
        <ContinueBtn
          label={"Continue"}
          onPress={onPressContinue}
          position={"relative"}
          // bottom={20}
          style={{ marginBottom: 20 }}
        />
      </ScrollView>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  label: { fontSize: 20, color: "#930055", paddingLeft: width * 0.05 },
  txtInput: {
    marginLeft: width * 0.05,
    borderBottomColor: "#009387",
    marginBottom: 40,
    borderBottomWidth: 1,
    width: width * 0.9,
    paddingBottom: 5,
    paddingLeft: 10,
  },
  picker: {
    width: width * 0.9,
    height: 40,
  },
});
