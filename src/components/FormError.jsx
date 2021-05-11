import React from "react";
import { View, Text } from "react-native";
import { width } from "../constants/size";

const FormError = ({ msg }) => {
  return (
    <View style={{ flex: 1, paddingLeft: width * 0.05, paddingTop: 5 }}>
      <Text style={{ color: "#a94442", fontSize: 10 }}>{msg}</Text>
    </View>
  );
};

export default FormError;
