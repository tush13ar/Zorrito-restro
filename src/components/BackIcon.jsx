import React from "react";
import { View, Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { colors } from "../constants/colors";
import { height, width } from "../constants/size";

const BackIcon = ({ onPress }) => {
  return (
    <Pressable
      style={{ position: "absolute", top: height * 0.05, left: width * 0.03 }}
      hitSlop={20}
      onPress={onPress}
    >
      <Icon name={"chevron-left"} size={24} color={colors.dark} />
    </Pressable>
  );
};

export default BackIcon;
