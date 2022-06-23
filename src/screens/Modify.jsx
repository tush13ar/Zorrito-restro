import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import firebase from "firebase";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import BackIcon from "../components/BackIcon";
import { ContinueBtn } from "../components/ContinueBtn";
import Details from "./Details";
import ModifyHome from "./ModifyHome";

const { height, width } = Dimensions.get("window");

const Stack = createStackNavigator();

const AddUserStack = () => (
  <Stack.Navigator initialRouteName={"ModifyHome"}>
    <Stack.Screen
      name="ModifyHome"
      component={ModifyHome}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Details"
      component={Details}
      options={{
        headerTransparent: true,
        headerTitle: "Add New User",
        headerTitleAlign: "center",
      }}
    />

    <Stack.Screen
      name="Email"
      component={Email}
      options={{ headerTransparent: true, headerTitle: null }}
    />
  </Stack.Navigator>
);

const Email = ({ route }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState(null);
  const [loaderVisible, setLoaderVisible] = useState(false);

  const generateRandomNum = () => {
    const num = Math.floor(Math.random() * 100000000);
    return num;
  };

  const createNewUser = async () => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      try {
        // const pass = generateRandomNum().toString();
        setLoaderVisible(true);
        const pass = "12345678";
        const response = await firebase
          .app("Zorrito-restro")
          .auth()
          .createUserWithEmailAndPassword(email, pass);
        console.log("response", response);
        if (response.user) {
          const { name, phone, selectedMeal, subType, tempLocation } =
            route.params;
          const userId = response.user.uid;
          const subDetails = {
            subscriptionId: selectedMeal,
            mealNum: subType ? 30 : 14,
            timestamp: Date.now(),
          };
          const userData = {
            name,
            mobNum: phone,
            email,
            tempLocation,
          };
          const updates = {};
          updates["/pendingSubscription/" + userId] = subDetails;
          updates["/metaData/" + userId] = userData;
          await firebase
            .app("Zorrito-restro")
            .database()
            .ref("users")
            .update(updates, (error) => {
              if (error) {
                alert("Subscription can't be added!");
              } else {
                setLoaderVisible(false);
                navigation.navigate("Subscriptions", {
                  screen: "Subscriptions",
                  params: {
                    navigatorKey: navigation.dangerouslyGetState().key,
                  },
                });
              }
            });
        }
      } catch (error) {
        setLoaderVisible(false);
        alert(error);
      }
    } else {
      alert("Invalid email address!");
      return;
    }
  };

  const onChangeText = (val) => {
    setEmail(val);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        paddingTop: height * 0.14,
        // paddingTop: height * 0.02,
        backgroundColor: "#FFFFFF",
      }}
    >
      <Text
        style={{ fontSize: 25, color: "#009387", paddingLeft: width * 0.05 }}
      >
        Enter User's Email Address
      </Text>
      <TextInput
        style={{
          marginLeft: width * 0.05,
          borderBottomColor: "#009387",
          marginTop: 25,
          borderBottomWidth: 1,
          width: width * 0.9,
          paddingBottom: 5,
          paddingLeft: 10,
        }}
        placeholder={"John@example.com"}
        value={email}
        onChangeText={onChangeText}
      />
      <ContinueBtn
        position={"absolute"}
        onPress={createNewUser}
        bottom={height * 0.05}
        label={"SUBMIT"}
        loaderVisible={loaderVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default AddUserStack;
