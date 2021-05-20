import React, { Component } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import MainNavigator from "./MainNavigator";
import SignUp from "../screens/auth/SignUp";
import SignIn from "../screens/auth/SignIn";
import { useSelector } from "react-redux";
import { getUser } from "../store/AuthSlice";
import RegisterRestro from "../screens/newRestaurant";
import PassResetScreen from "../screens/auth/PassReset";

const Stack = createStackNavigator();

const RootNavigator = () => {
  const {
    authDetails: { userId },
  } = useSelector(getUser);
  const { name: restroName } = useSelector((state) => state.db.restro);
  return !userId ? (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signIn" component={SignIn} />
      <Stack.Screen name="signUp" component={SignUp} />
      <Stack.Screen name="passReset" component={PassResetScreen} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* {!restroName ? (
        <Stack.Screen name="regRestro" component={RegisterRestro} />
      ) : null} */}
      <Stack.Screen name="main" component={MainNavigator} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
