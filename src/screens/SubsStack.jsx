import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  CommonActions,
  StackActions,
  useNavigation,
} from "@react-navigation/native";
import { Card } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../store/AuthSlice";
import {
  getDatabase,
  getUsersMetaData,
  getMeals,
  getMenuItems,
  getPendingSubList,
  getLunchOrders,
  getDinnerOrders,
} from "../store/DBSlice";
import PendingSub from "./PendingSub";
import ActiveSub, { ActiveList } from "./ActiveSub";
import ActiveSubStack from "./ActiveSub";

const { height, width } = Dimensions.get("window");

const Stack = createStackNavigator();

export const ListEmptyComponent = () => (
  <View style={styles.emptyListComp}>
    <Text>Nothing to show here.</Text>
  </View>
);

const PendingList = ({ metaDatas }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [pendingSubDataList, setPendingSubDatalist] = useState([]);

  const { pendingSubList } = useSelector(getDatabase);

  const getPendingSubMetaData = () => {
    const pendingSubMetaData = pendingSubList.data.map((pendingSub) => {
      const obj = metaDatas.find((item) => pendingSub.key === item.key);
      return { ...obj, ...pendingSub };
    });
    console.log("change in pendingList");

    setPendingSubDatalist(pendingSubMetaData);
    //console.log("pendingSubMetaData", pendingSubMetaData);
  };

  useEffect(() => {
    pendingSubList.status === "idle" && dispatch(getPendingSubList());
  }, [pendingSubList]);

  useEffect(() => {
    pendingSubList.data.length && getPendingSubMetaData();
  }, [pendingSubList, metaDatas]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ width }}
      onPress={() => {
        navigation.navigate("Pending", { pendingData: item });
      }}
    >
      <Card>
        <Text>Name: {item.name}</Text>
        <Text>Phone: {item.mobNum}</Text>
        <Text>Email: {item.email}</Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={pendingSubDataList || []}
      renderItem={renderItem}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};

const Subscriptions = ({ navigation, route }) => {
  const [focusedSub, setFocusedSub] = useState("active");

  const dispatch = useDispatch();

  const {
    userMetaData: { data: metaDatas },
    meals,
    menuItems,
    lunchOrders,
    dinnerOrders,
  } = useSelector(getDatabase);

  useEffect(() => {
    dispatch(getUsersMetaData());
    lunchOrders.status === "idle" && dispatch(getLunchOrders());
    dinnerOrders.status === "idle" && dispatch(getDinnerOrders());

    meals.status === "idle" && dispatch(getMeals());
    menuItems.status === "idle" && dispatch(getMenuItems());
  }, []);

  useLayoutEffect(() => {
    if (route?.params?.navigatorKey) {
      setFocusedSub("pending");
      resetAddNewTab();
    }
  }, [route.params]);
  // useEffect(() => {
  //   console.log("metaDataList", metaDatas);
  //   console.log("meals", meals);
  //   console.log("menuItems", menuItems);
  // }, [metaDatas, meals, menuItems]);
  const resetAddNewTab = () => {
    const { navigatorKey } = route.params;
    navigation.dispatch({
      ...CommonActions.reset({
        index: 1,
        routes: [{ name: "Details" }],
      }),
      target: navigatorKey,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View
          style={{
            opacity: focusedSub === "active" ? 0.6 : 0.3,
            borderBottomWidth: focusedSub === "active" ? 1 : 0,
          }}
        >
          <Text
            style={styles.headerText}
            onPress={() => {
              setFocusedSub("active");
            }}
          >
            Active
          </Text>
        </View>

        <View
          style={{
            borderBottomWidth: focusedSub === "pending" ? 1 : 0,
            opacity: focusedSub === "pending" ? 0.6 : 0.3,
          }}
        >
          <Text
            style={styles.headerText}
            onPress={() => {
              setFocusedSub("pending");
            }}
          >
            Pending
          </Text>
        </View>
      </View>
      {focusedSub === "pending" ? (
        <PendingList metaDatas={metaDatas} navigation={navigation} />
      ) : (
        <ActiveList metaDatas={metaDatas} navigation={navigation} />
      )}
    </View>
  );
};

const SubsStack = () => {
  const {
    authDetails: { userId },
  } = useSelector(getUser);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={"Subscriptions"} component={Subscriptions} />
      <Stack.Screen name={"Pending"} component={PendingSub} />
      <Stack.Screen name={"Active"} component={ActiveSubStack} />
    </Stack.Navigator>
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
  emptyListComp: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default SubsStack;
