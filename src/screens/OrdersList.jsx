import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import { Modal } from "react-native";
import { StyleSheet } from "react-native";
import { ScrollView, View, Text, Flatlist } from "react-native";
import { Card } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import { getDatabase, getLunchOrders, getDatabaseRef } from "../store/DBSlice";

const { height, width } = Dimensions.get("window");

const ChefView = ({ incomingOrders, modifiedOrders, orderType, orders }) => {
  const { walletList, meals, lunchOrders, dinnerOrders } = useSelector(
    getDatabase
  );
  const [privilege, setPrivilege] = useState(null);
  const [lunchDelivered, setLunchDelivered] = useState(false);
  useEffect(() => {
    //console.log("allItems", allItems);
  }, []);

  useEffect(() => {
    //console.log("newOrdersList", orders);
  }, [orders, incomingOrders, modifiedOrders]);
  useEffect(() => {
    //console.log("incomingOrders", incomingOrders);
    setPrivilege(incomingOrders[1]?.privilege);
  }, [incomingOrders, modifiedOrders, orders, lunchOrders, dinnerOrders]);

  useEffect(() => {
    if (orderType === "Dinner") {
      checkIfLunchDelivered();
    }
  }, [lunchOrders]);

  const checkIfLunchDelivered = () => {
    console.log("check");
    const validLunchOrders = lunchOrders.data.filter(
      (order) => order.status === "incoming" || order.status === "modified"
    );
    const isLunchDelivered =
      validLunchOrders[0]?.privilege === "delivered" ? true : false;
    setLunchDelivered(isLunchDelivered);
  };

  const changePrivilege = (privilege) => {
    const validOrderIds = [...incomingOrders, ...modifiedOrders].map(
      (order) => order.key
    );
    validOrderIds.forEach((subId) => {
      const ref = getDatabaseRef(
        "users/" + "meals/" + orderType + "/" + subId + "/"
      );
      ref.update({
        privilege,
      });
    });
  };

  const onPressDelivered = () => {
    const ordersWithCost = orders.map((order) => {
      const cost = Object.keys(order.items).reduce((acc, cur) => {
        const itemCost = order.items[cur].price * order.items[cur].quantity;
        return acc + itemCost;
      }, 0);
      return { ...order, cost };
    });
    const ordersWithWallet = ordersWithCost.map((order) => {
      let obj = {};
      walletList.data.forEach((wallet) => {
        if (wallet.key === order.key) {
          obj = { ...order, wallet: wallet.amount };
        }
      });
      return obj;
    });
    ordersWithWallet
      .filter(
        (order) => order.status === "incoming" || order.status === "modified"
      )
      .forEach((order) => {
        // console.log(
        //   "wallet" +
        //     typeof order.wallet +
        //     " " +
        //     order.wallet +
        //     "cost" +
        //     typeof order.cost +
        //     " " +
        //     order.cost
        // );
        // console.log(order.wallet - order.cost);
        const walletRef = getDatabaseRef("users/" + "wallet");
        //console.log(order.key);
        walletRef.update({
          [order.key]: order.wallet - order.cost,
        });
      });
    if (orderType === "Dinner") {
      const ordersWithOriginalMeal = ordersWithWallet.map((order) => {
        let obj = {};

        meals.data.forEach((meal) => {
          if (meal.key === order.subscriptionId) {
            const itemTypes = Object.keys(meal.details);
            let lunchItems = {};
            let dinnerItems = {};
            let cost = 0;
            itemTypes.forEach((item) => {
              if (meal.details[item]?.timing === "Lunch") {
                lunchItems[item] = meal.details[item];
                cost =
                  cost + meal.details[item].price * meal.details[item].quantity;
              } else if (meal.details[item]?.timing === "Dinner") {
                console.log("item", meal.details[item]);
                dinnerItems[item] = meal.details[item];
              } else {
                lunchItems[item] = meal.details[item];
                dinnerItems[item] = meal.details[item];
                cost =
                  cost + meal.details[item].price * meal.details[item].quantity;
              }
            });
            console.log("lunchItems", lunchItems);
            console.log("dinnerItems", dinnerItems);
            obj = {
              ...order,
              Lunch: { items: lunchItems, status: "incoming" },
              Dinner: { items: dinnerItems, status: "incoming" },
            };
            if (order.status !== "cancelled") {
              let walletAfterCurrentDeduction = order.wallet - order.cost;

              if (
                walletAfterCurrentDeduction >= cost &&
                walletAfterCurrentDeduction < 2 * cost
              ) {
                obj.Dinner.status = "insufficient_funds";
              } else if (walletAfterCurrentDeduction < cost) {
                obj.Lunch.status = "insufficient_funds";
                obj.Dinner.status = "insufficient_funds";
              }
            }
          }
        });
        return obj;
      });
      ordersWithOriginalMeal.forEach((order) => {
        const lunchRef = getDatabaseRef(
          "users/" + "meals/" + "Lunch/" + order.key
        );
        const DinnerRef = getDatabaseRef(
          "users/" + "meals/" + "Dinner/" + order.key
        );
        lunchRef.set({
          ...order.Lunch,
        });
        DinnerRef.set({
          ...order.Dinner,
        });
      });
    } else {
      changePrivilege("delivered");
    }
  };

  const allOrders = [...incomingOrders, ...modifiedOrders];

  const allItems = allOrders.reduce((acc, cur) => {
    let existingItems = [...acc];
    let Items = Object.keys(cur.items).map((item) => ({
      name: cur.items[item].name,
      quantity: cur.items[item].quantity,
    }));
    Items.forEach((item) => {
      let caught = false;
      existingItems.forEach((existingItem) => {
        if (existingItem.name === item.name) {
          caught = true;
          existingItem.quantity = existingItem.quantity + item.quantity;
          return;
        }
      });
      if (!caught) {
        existingItems.push(item);
      }
      //console.log(existingItems);
    });
    return existingItems;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
            paddingVertical: "3%",
          }}
        >
          <Text style={{ marginLeft: "5%", fontWeight: "bold", fontSize: 20 }}>
            Item
          </Text>
          <Text style={{ marginRight: "5%", fontWeight: "bold", fontSize: 20 }}>
            Quantity
          </Text>
        </View>
        {allItems.map((item) => (
          <View
            key={item.name}
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ marginLeft: "5%", fontSize: 16 }}>{item.name}</Text>
            <Text style={{ marginRight: "10%", fontSize: 16 }}>
              {item.quantity}
            </Text>
          </View>
        ))}
        <View
          style={{
            width: "90%",
            height: 0,
            borderWidth: 1,
            alignSelf: "center",
            marginVertical: "3%",
          }}
        />
      </ScrollView>
      <TouchableOpacity
        disabled={orderType === "Dinner" ? !lunchDelivered : false}
        style={[
          styles.absoluteBtn,
          {
            left: width * 0.05,
            borderRadius: 10,
            backgroundColor:
              orderType === "Dinner"
                ? lunchDelivered
                  ? "#009387"
                  : "#00e1cf"
                : "#009387",
          },
        ]}
        onPress={() => {
          changePrivilege("editable");
        }}
      >
        <Text style={{ color: "white" }}>Start Taking Order</Text>
        {privilege && <Icon name="check-circle" size={18} color={"white"} />}
      </TouchableOpacity>
      <TouchableOpacity
        disabled={privilege !== "editable"}
        style={[
          styles.absoluteBtn,
          {
            right: width * 0.05,
            borderRadius: 10,
            backgroundColor: !privilege ? "#00e1cf" : "#009387",
          },
        ]}
        onPress={() => {
          changePrivilege("confirmed");
        }}
      >
        <Text style={{ color: "white" }}>Confirm Meals</Text>
        {(privilege === "confirmed" || privilege === "delivered") && (
          <Icon name="check-circle" size={18} color={"white"} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        disabled={privilege !== "confirmed"}
        style={[
          styles.absoluteBtn,
          {
            width: width * 0.9,
            bottom: 30,
            left: width * 0.05,
            backgroundColor:
              !privilege || privilege === "editable" ? "#00e1cf" : "#009387",
          },
        ]}
        onPress={onPressDelivered}
      >
        <Text style={{ color: "white" }}>Delivered ({privilege})</Text>
        {privilege === "delivered" && (
          <Icon name="check-circle" size={18} color={"white"} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const MealTypeCard = ({ type, orders }) => {
  const [shouldExpand, setShouldExpand] = useState(false);

  return (
    <View style={{ width: "100%", flex: 1, alignItems: "center" }}>
      <Card
        wrapperStyle={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        containerStyle={{ width: width * 0.9, backgroundColor: "#009387" }}
      >
        <Text style={{ fontSize: 20, color: "white" }}>{type}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              height: 20,
              width: 20,
              borderRadius: 10,
              backgroundColor: "orange",
              alignItems: "center",
              marginRight: 15,
            }}
          >
            <Text style={{ color: "#009387" }}>{orders.length}</Text>
          </View>
          <Icon
            name={shouldExpand ? "chevron-up" : "chevron-down"}
            size={20}
            color={"white"}
            onPress={() => {
              setShouldExpand(!shouldExpand);
            }}
          />
        </View>
      </Card>
      {shouldExpand &&
        orders.map((order) => <OrderCard order={order} key={order.key} />)}
    </View>
  );
};

const OrderCard = ({ order }) => {
  const [shouldExpand, setShouldExpand] = useState(false);

  const orderItems = Object.keys(order.items).map((itemType) => ({
    type: order,
    ...order.items[itemType],
  }));

  return (
    <Card containerStyle={{ flex: 1, width: width * 0.8, borderRadius: 10 }}>
      <Icon
        name={shouldExpand ? "chevron-up" : "chevron-down"}
        size={20}
        color={"black"}
        onPress={() => {
          setShouldExpand(!shouldExpand);
        }}
        style={{ alignSelf: "flex-end" }}
      />
      <Text>{order.name}</Text>
      <Text>{order.mobNum}</Text>
      <Text numberOfLines={1}>{order.location.address}</Text>
      {shouldExpand &&
        orderItems.map((item) => (
          <Text key={item.name}>
            {item.quantity} {item.name}
          </Text>
        ))}
    </Card>
  );
};

const Orders = ({ orders, orderType }) => {
  const { menuItems, userMetaData, meals, activeSubList } = useSelector(
    getDatabase
  );

  const [mealTypes, setMealTypes] = useState([]);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [modifiedOrders, setModifiedOrders] = useState([]);
  const [updatedOrders, setUpdatedOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const getDataForList = () => {
    const dataWithSubId = orders.data.map((order) => {
      let obj = {};
      activeSubList.data.forEach((sub) => {
        if (sub.key === order.key) {
          obj = { ...order, subscriptionId: sub.subscriptionId };
        }
      });
      return obj;
    });
    const dataWithSubName = dataWithSubId.map((order) => {
      let obj = {};
      meals.data.forEach((meal) => {
        if (meal.key === order.subscriptionId) {
          obj = { ...order, subTitle: meal.title };
        }
      });
      return obj;
    });
    const dataWithItemName = dataWithSubName.map((order) => {
      let obj = { ...order };
      let itemTypes = Object.keys(order.items);
      itemTypes.forEach((itemType) => {
        for (let item of menuItems.data) {
          if (item.type === itemType) {
            obj.items = {
              ...obj.items,
              [itemType]: { ...obj.items[itemType], name: item.name },
            };
            break;
          }
        }
      });
      return obj;
    });
    const dataWithUserInfo = dataWithItemName.map((order) => {
      let obj = {};
      userMetaData.data.forEach((userData) => {
        if (userData.key === order.key) {
          obj = { ...order, ...userData };
        }
      });
      return obj;
    });
    const modifiedOrderList = dataWithUserInfo.filter(
      (order) => order.status === "modified"
    );
    const incomingOrderList = dataWithUserInfo.filter(
      (order) => order.status === "incoming"
    );
    const mealTypeList = [];
    incomingOrderList.forEach((order) => {
      if (mealTypeList.find((mealType) => mealType === order.subTitle)) {
        return;
      } else {
        mealTypeList.push(order.subTitle);
      }
    });
    setMealTypes(mealTypeList);
    setIncomingOrders(incomingOrderList);
    setModifiedOrders(modifiedOrderList);
    setUpdatedOrders(dataWithUserInfo);
  };

  useEffect(getDataForList, [
    orders,
    menuItems,
    userMetaData,
    meals,
    activeSubList,
  ]);

  const renderItem = ({ item }) => {
    const ordersOfThisType = incomingOrders.filter(
      (order) => order.subTitle === item
    );
    return <MealTypeCard orders={ordersOfThisType} type={item} key={item} />;
  };

  return (
    <ScrollView>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 15,
          marginRight: 5,
        }}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={{ color: "#009387", paddingRight: 5 }}>Chef's View</Text>
        <Icon name={"eye"} size={20} color={"#009387"} />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <ChefView
          incomingOrders={incomingOrders}
          modifiedOrders={modifiedOrders}
          orderType={orderType}
          orders={updatedOrders}
        />
      </Modal>
      <MealTypeCard orders={modifiedOrders} type={"Modified"} />
      <FlatList
        data={mealTypes}
        renderItem={renderItem}
        ListEmptyComponent={
          <View>
            <Text>Empty List</Text>
          </View>
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  absoluteBtn: {
    position: "absolute",
    bottom: 80,
    height: 40,
    width: width * 0.425,
    backgroundColor: "#009387",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default Orders;
