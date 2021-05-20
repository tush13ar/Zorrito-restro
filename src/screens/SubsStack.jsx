import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  CommonActions,
  StackActions,
  useFocusEffect,
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
import { colors } from "../constants/colors";
import { useRef } from "react";
import { cos } from "react-native-reanimated";
import { useCallback } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Linking } from "react-native";
import UserCard from "../components/UserCard";

const { height, width } = Dimensions.get("window");

const Stack = createStackNavigator();

export const ListEmptyComponent = ({ img }) => {
  const source =
    img === "iceCream"
      ? require("../../assets/droppedIceCream.png")
      : require("../../assets/spilledDrink.png");

  return (
    <View style={styles.emptyListComp}>
      <Image
        source={source}
        style={{ height: width * 0.4, width: width * 0.6 }}
        resizeMode={"center"}
      />
      <Text style={{ paddingTop: 10, fontSize: 20, color: colors.complement }}>
        Nothing to show here.
      </Text>
    </View>
  );
};

const PendingList = ({ metaDatas, shouldScrollToBottom }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const listRef = useRef();

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

  useFocusEffect(
    useCallback(() => {
      shouldScrollToBottom && listRef.current.scrollToEnd();
    }, [shouldScrollToBottom])
  );

  // useLayoutEffect(() => {
  //   console.log("stb", shouldScrollToBottom);
  //   shouldScrollToBottom && listRef.current.scrollToEnd();
  // }, [shouldScrollToBottom]);

  useEffect(() => {
    pendingSubList.status === "idle" && dispatch(getPendingSubList());
  }, [pendingSubList]);

  useEffect(() => {
    pendingSubList.data.length && getPendingSubMetaData();
  }, [pendingSubList, metaDatas]);

  const renderItem = ({ item }) => (
    <UserCard
      item={item}
      onPress={() => {
        navigation.navigate("Pending", { pendingData: item });
      }}
    />
  );

  return (
    <FlatList
      ref={listRef}
      data={pendingSubDataList || []}
      renderItem={renderItem}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};

const Subscriptions = ({ navigation, route }) => {
  const [focusedSub, setFocusedSub] = useState("active");
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

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
      setShouldScrollToBottom(true);
      setFocusedSub("pending");
      resetAddNewUserTab();
    }
  }, [route.params]);

  const resetAddNewUserTab = () => {
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
        <PendingList
          metaDatas={metaDatas}
          shouldScrollToBottom={shouldScrollToBottom}
        />
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
    alignItems: "center",
    paddingTop: "8%",
    backgroundColor: "#FFFFFF",
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
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: height * 0.25,
  },
});
export default SubsStack;
