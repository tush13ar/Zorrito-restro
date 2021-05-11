import React, { Component } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import SubsStack from "../screens/SubsStack";
import OrderStack from "../screens/OrderStack";
import Modify from "../screens/Modify";
import Icon from "react-native-vector-icons/FontAwesome5";
import Map from "../screens/Map";

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          let size;
          let color;

          if (route.name === "Subscriptions") {
            iconName = "briefcase";
            size = focused ? 25 : 20;
            color = focused ? "orange" : "gray";
          } else if (route.name === "Orders") {
            iconName = "utensils";
            size = focused ? 25 : 20;
            color = focused ? "orange" : "gray";
          } else if (route.name === "Modify") {
            iconName = "user";
            size = focused ? 25 : 20;
            color = focused ? "orange" : "gray";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Subscriptions" component={SubsStack} />
      <Tab.Screen name="Orders" component={OrderStack} />
      <Tab.Screen name="Modify" component={Modify} />
    </Tab.Navigator>
  );
};
export default MainNavigator;
