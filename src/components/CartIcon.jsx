import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const CartIcon = ({ navigation, badge, paramObj }) => (
  <TouchableOpacity
    onPress={() => {
      navigation.navigate("Cart", paramObj);
    }}
  >
    <View style={styles.cart}>
      <Text style={{ color: "white" }}>{badge}</Text>
    </View>
    <Icon
      name="shopping-cart"
      size={26}
      style={{ marginRight: 20 }}
      color={"#009387"}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  cart: {
    position: "absolute",
    top: -4,
    right: 12,
    zIndex: 1,
    height: 20,
    width: 20,
    backgroundColor: "orange",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CartIcon;
