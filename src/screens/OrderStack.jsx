import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getDatabase, getWalletList } from "../store/DBSlice";
import Orders from "./OrdersList";
import { getDinnerOrders, getLunchOrders } from "../store/DBSlice";

const OrderStack = () => {
  const [focusedMeal, setFocusedMeal] = useState("lunch");

  const dispatch = useDispatch();
  const { lunchOrders, dinnerOrders, walletList } = useSelector(getDatabase);

  useEffect(() => {
    lunchOrders.status === "idle" && dispatch(getLunchOrders());
    dinnerOrders.status === "idle" && dispatch(getDinnerOrders());
    walletList.status === "idle" && dispatch(getWalletList());
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View
          style={{
            opacity: focusedMeal === "lunch" ? 0.6 : 0.3,
            borderBottomWidth: focusedMeal === "lunch" ? 1 : 0,
          }}
        >
          <Text
            style={styles.headerText}
            onPress={() => {
              setFocusedMeal("lunch");
            }}
          >
            Lunch
          </Text>
        </View>

        <View
          style={{
            borderBottomWidth: focusedMeal === "dinner" ? 1 : 0,
            opacity: focusedMeal === "dinner" ? 0.6 : 0.3,
          }}
        >
          <Text
            style={styles.headerText}
            onPress={() => {
              setFocusedMeal("dinner");
            }}
          >
            Dinner
          </Text>
        </View>
      </View>
      {focusedMeal === "lunch" ? (
        <Orders orders={lunchOrders} orderType={"Lunch"} />
      ) : (
        <Orders orders={dinnerOrders} orderType={"Dinner"} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "8%",
  },
  headerContainer: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-around",
  },
  headerText: {
    fontSize: 30,
  },
});
export default OrderStack;
