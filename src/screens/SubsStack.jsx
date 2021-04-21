import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
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
} from "../store/DBSlice";
import PendingSub from "./PendingSub";
import ActiveSub, { ActiveList } from "./ActiveSub";

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

const Subscriptions = ({ navigation }) => {
  const [focusedSub, setFocusedSub] = useState("active");

  const dispatch = useDispatch();

  const {
    userMetaData: { data: metaDatas },
    meals,
    menuItems,
  } = useSelector(getDatabase);

  useEffect(() => {
    dispatch(getUsersMetaData());
    meals.status === "idle" && dispatch(getMeals());
    menuItems.status === "idle" && dispatch(getMenuItems());
  }, []);

  // useEffect(() => {
  //   console.log("metaDataList", metaDatas);
  //   console.log("meals", meals);
  //   console.log("menuItems", menuItems);
  // }, [metaDatas, meals, menuItems]);

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
    <Stack.Navigator>
      <Stack.Screen
        name={"Subscriptions"}
        component={Subscriptions}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={"Pending"} component={PendingSub} />
      <Stack.Screen name={"Active"} component={ActiveSub} />
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
