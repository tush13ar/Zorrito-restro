import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ContinueBtn } from "../components/ContinueBtn";
import { height } from "../constants/size";
import { getDatabase, setOrder } from "../store/DBSlice";

const Cart = ({
  navigation,
  route: {
    params: { newMenu, total, userId, mealType, wallet, isMenuChanged },
  },
}) => {
  const dispatch = useDispatch();
  const { dinnerOrders } = useSelector(getDatabase);

  const [loaderVisible, setLoaderVisible] = useState(false);

  useEffect(() => {
    console.log("isMenuChanged", isMenuChanged);
  }, []);

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
      setLoaderVisible(true);
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
        setLoaderVisible(false);
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
      setLoaderVisible(false);
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
      </ScrollView>
      <ContinueBtn
        loaderVisible={loaderVisible}
        disabled={!isMenuChanged}
        position={"absolute"}
        onPress={onContinueAlert}
        label={`Continue @ Rs ${total}`}
        bottom={height * 0.01}
      />
    </View>
  );
};

export default Cart;
