import React, { useRef } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getDatabase, setOrder } from "../store/DBSlice";

const Cart = ({
  navigation,
  route: {
    params: { newMenu, total, userId, mealType, wallet },
  },
}) => {
  const dispatch = useDispatch();
  const { dinnerOrders } = useSelector(getDatabase);
  const springValue = useRef(new Animated.Value(0)).current;

  // const animate = () => {
  //   springValue.setValue(0);
  //   //console.log("start");
  //   Animated.spring(springValue, {
  //     toValue: 2,
  //     friction: 2,
  //   }).start(({ finished }) => {
  //     //console.log("springValue", springValue);
  //     navigation.navigate("CurrentMeal");
  //   });
  // };

  const getDinnerOrderDetails = () => {
    const dinnerOrder = dinnerOrders.data.filter(
      (order) => order.key === userId
    )[0];
    console.log("dinnerOrder", dinnerOrder);
    const dinnerItems = Object.keys(dinnerOrder.items).map((item) => ({
      ...dinnerOrder.items[item],
    }));
    const cost = dinnerItems.reduce((acc, cur) => {
      return acc + cur.price * cur.quantity;
    }, 0);
    return { cost, status: dinnerOrder.status };
  };

  const onContinueAlert = () => {
    if (total < 45) {
      return Alert.alert("", "Minimum order value should be Rs 45.");
    } else if (total > wallet) {
      return Alert.alert("", "You don't have sufficient funds for this order.");
    }
    if (mealType === "Lunch") {
      const { cost, status } = getDinnerOrderDetails();
      if (status !== "insufficient_funds" && cost + total > wallet) {
        Alert.alert(
          "",
          "You can make this order but your Dinner will be cancelled due to insufficient wallet balance.",
          [
            {
              text: "Continue",
              onPress: () => {
                onContinue(true);
              },
            },
            { text: "Cancel", style: "cancel" },
          ],
          {
            cancelable: true,
            onDismiss: () => {
              console.log("alert closed");
            },
          }
        );
      } else {
        onContinue(false);
      }
    } else {
      onContinue(false);
    }
  };

  const onContinue = async (shouldCancelDinner) => {
    try {
      const itemsObj = newMenu.reduce((acc, cur) => {
        return {
          ...acc,
          [`${cur.type}`]: {
            name: cur.name,
            price: cur.price,
            quantity: cur.quantity,
          },
        };
      }, {});
      shouldCancelDinner &&
        setOrder({
          userId,
          mealType: "Dinner",
          updateInfo: { status: "insufficient_funds" },
        });
      const result = setOrder({
        userId,
        mealType,
        updateInfo: { items: itemsObj, status: "modified" },
      });
      result.then((res) => {
        alert(res);
        console.log(res);
        navigation.navigate("ActiveSub");
      });

      // (await dispatch(
      //   Database.setMeal({
      //     userId,
      //     mealType: "Dinner",
      //     updateInfo: { status: "insufficient_funds" },
      //   })
      // ));

      // await dispatch(
      //   Database.setMeal({
      //     userId,
      //     mealType,
      //     updateInfo: { items: itemsObj, status: "modified" },
      //   })
      // );
      //animate();
    } catch (error) {
      throw error;
    }
  };

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      <ScrollView>
        <Text style={{ fontWeight: "bold", alignSelf: "center" }}>
          Your Order
        </Text>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
            paddingVertical: "3%",
          }}
        >
          <Text style={{ marginLeft: "5%", fontWeight: "bold", fontSize: 16 }}>
            Item
          </Text>
          <Text style={{ marginRight: "5%", fontWeight: "bold", fontSize: 16 }}>
            Quantity
          </Text>
        </View>
        {newMenu.map((item) => (
          <View
            key={item.name}
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ marginLeft: "5%" }}>{item.name}</Text>
            <Text style={{ marginRight: "10%" }}>{item.quantity}</Text>
          </View>
        ))}
        {/* <View
          style={{
            width: "90%",
            height: 0,
            borderWidth: 1,
            alignSelf: "center",
            marginVertical: "1%",
          }}
        />
        <Text style={{ alignSelf: "flex-end", marginRight: "9%" }}>
          Total: {total}
        </Text> */}
      </ScrollView>

      <TouchableOpacity
        //disabled={true}
        style={{
          backgroundColor: "#009387",
          width: "70%",
          height: "8%",
          position: "absolute",
          bottom: "2%",
          left: "15%",
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onContinueAlert}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          Continue @ Rs {total}
        </Text>
      </TouchableOpacity>
      {/* <Animated.Image
        source={require("../../../assets/checkMark.png")}
        style={{
          position: "absolute",
          top: "30%",
          height: "20%",
          left: "40%",
          width: "20%",
          transform: [{ scale: springValue }],
        }}
        resizeMode="contain"
      /> */}
    </View>
  );
};

export default Cart;
