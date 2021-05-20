import React from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { ContinueBtn } from "../components/ContinueBtn";
import { Logout } from "../store/AuthSlice";

const ModifyHome = ({ navigation }) => {
  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, justifyContent: "space-evenly" }}>
      <ContinueBtn
        label={"Modify Menu"}
        onPress={() => {}}
        position={"relative"}
      />
      <ContinueBtn
        label={"Modify Meals"}
        onPress={() => {}}
        position={"relative"}
      />
      <ContinueBtn
        label={"Create User"}
        onPress={() => {
          navigation.navigate("Details");
        }}
        position={"relative"}
      />
      <ContinueBtn
        label={"Logout"}
        onPress={() => {
          dispatch(Logout());
        }}
        position={"relative"}
      />
    </View>
  );
};

export default ModifyHome;
