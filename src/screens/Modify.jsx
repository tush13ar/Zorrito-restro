import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../store/AuthSlice";
import { getRestros } from "../store/DBSlice";

const Modify = () => {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Text>Modify</Text>
      <Text
        style={{ paddingTop: 30 }}
        onPress={() => {
          //dispatch(logout());
          dispatch(getRestros());
        }}
      >
        Logout
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default Modify;
