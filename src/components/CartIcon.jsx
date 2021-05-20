import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const areSameArrayOfObjects = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const keys = Object.keys(arr1[0]);

  for (let idx1 in arr1) {
    let areSameObj = true;
    for (let idx2 in arr2) {
      let allKeysSame = true;
      for (let idx in keys) {
        if (arr1[idx1][keys[idx]] !== arr2[idx2][keys[idx]]) {
          allKeysSame = false;
          break;
        }
      }
      if (allKeysSame) {
        console.log();
        areSameObj = true;
        break;
      } else {
        areSameObj = false;
      }
    }
    if (!areSameObj) {
      console.log("reached");
      return false;
    }
  }
  return true;
};

const CartIcon = ({ navigation, badge, paramObj, oldMenu }) => {
  const isMenuChanged = !areSameArrayOfObjects(oldMenu, paramObj.newMenu);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Cart", { ...paramObj, isMenuChanged });
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
};

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
