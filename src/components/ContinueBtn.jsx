import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, Text } from "react-native";
import { width } from "../constants/size";
import { ActivityIndicator } from "react-native";

export const ContinueBtn = ({
  label,
  onPress,
  bottom,
  position,
  loaderVisible,
  disabled,
  style,
}) => (
  <LinearGradient
    colors={["#009387", "#23837a", "#1b6e66"]}
    style={{
      height: 40,
      width: width * 0.9,
      position: position || "absolute",
      left: width * 0.05,
      borderRadius: 20,
      bottom: bottom,
      ...style,
    }}
  >
    <TouchableOpacity
      disabled={disabled || false}
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: width * 0.9,
        height: 40,
        flexDirection: "row",
      }}
      onPress={onPress}
    >
      {loaderVisible && (
        <ActivityIndicator
          size={"small"}
          color={"white"}
          style={{ paddingRight: 5 }}
        />
      )}
      <Text style={{ color: "white" }}>{label}</Text>
    </TouchableOpacity>
  </LinearGradient>
);
