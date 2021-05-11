import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height } = Dimensions.get("screen");

const MenuCard = (props) => {
  const [count, setCount] = useState(props.quantity);

  const modifyQuantity = (modificationType) => {
    const obj = {
      modificationType,
      itemName: props.name,
      price: props.price,
      type: props.type,
    };

    if (modificationType === "remove") {
      if (count !== 0) {
        setCount(count - 1);
        props.onModify(obj);
      }
    } else {
      setCount(count + 1);
      props.onModify(obj);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={props.onSelect}>
      <View style={styles.card}>
        <View style={styles.cardImgWrapper}>
          <Image
            source={{
              uri: props.url,
            }}
            resizeMode="cover"
            style={styles.cardImg}
          />
        </View>

        {props.category === "Meal" && (
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{props.title}</Text>
            <Text style={styles.cardDetails}>{props.details}</Text>
            <Text style={styles.cardPrice}>Rs. {props.price} / month</Text>
          </View>
        )}
        {props.category === "Item" && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1.5,
            }}
          >
            <View style={{ marginHorizontal: "5%" }}>
              <Text style={styles.cardTitle}>{props.name}</Text>
              <Text style={styles.cardPrice}>Rs. {props.price}</Text>
            </View>

            <View
              style={{
                marginRight: "5%",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Pressable
                hitSlop={{ left: 10, right: 10, top: 8, bottom: 8 }}
                onPress={() => {
                  modifyQuantity("add");
                }}
              >
                <Text style={styles.modifyItem}>+</Text>
              </Pressable>

              {count > 0 && <Text style={styles.count}>{count}</Text>}
              <Pressable
                hitSlop={{ left: 10, right: 10, top: 8, bottom: 8 }}
                onPress={() => {
                  modifyQuantity("remove");
                }}
              >
                <Text style={styles.modifyItem}>-</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: height * 0.12,
    width: "100%",
    marginTop: height * 0.01,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    overflow: "hidden",
  },
  cardImgWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  cardImg: {
    height: "100%",
    width: "100%",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  cardInfo: {
    flex: 2,
    paddingHorizontal: height * 0.02,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "black",
  },
  cardDetails: {
    fontSize: 13,
    color: "#444",
  },
  cardPrice: {
    fontSize: 14,
    color: "#05375a",
  },
  modifyItem: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },
  count: {
    fontSize: 14,
    fontWeight: "bold",
    color: "orange",
    paddingTop: "4%",
  },
});

export default MenuCard;
