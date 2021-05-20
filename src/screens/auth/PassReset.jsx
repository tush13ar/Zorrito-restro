import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import firebase from "firebase";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../../constants/colors";

import { height, width } from "../../constants/size";
import { ContinueBtn } from "../../components/ContinueBtn";
import BackIcon from "../../components/BackIcon";
import { ColorPropType } from "react-native";

const PassResetScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState();
  const [loaderVisible, setLoaderVisible] = useState(false);
  const auth = firebase.app("Zorrito-restro").auth();

  const emailValidityHandler = () => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      setEmailValid(true);
    } else if (email === "") setEmailValid(null);
    else setEmailValid(false);
  };

  const passResetHandler = async () => {
    if (!emailValid) return;
    try {
      setLoaderVisible(true);
      await auth.sendPasswordResetEmail(email);
      setLoaderVisible(false);
      alert("Password reset link has been sent to your email address.");
    } catch (err) {
      console.log(err.code);
      setLoaderVisible(false);
      if (err.code === "auth/user-not-found") {
        alert("This email address is not registed with Zorrito!");
      } else if (err.code === "auth/invalid-email") {
        alert("Invalid Email address.");
      } else if (err.code === "auth/network-request-failed") {
        alert("Please Check your Internet Connection.");
      } else {
        Alert.alert("Error", err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>Enter your Registered Email Address</Text>
        <TextInput
          placeholder="xyz@abc.com"
          style={styles.txtInput}
          autoCapitalize="none"
          value={email}
          onChangeText={(val) => setEmail(val.trim())}
          onEndEditing={emailValidityHandler}
        />

        {email !== "" && emailValid === false && (
          <Text style={styles.errorMsg}>invalid email address</Text>
        )}
        <View style={{ paddingTop: height * 0.55 }}>
          <ContinueBtn
            loaderVisible={loaderVisible}
            disabled={!emailValid}
            label={"Send Reset link"}
            position={"relative"}
            onPress={passResetHandler}
          />
        </View>
      </ScrollView>
      <BackIcon
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: height * 0.02,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  errorMsg: {
    color: colors.errorText,
    fontSize: 14,
    paddingLeft: width * 0.05,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.02,
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: width * 0.02,
    paddingBottom: height * 0.04,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    color: colors.textColor,
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: height * 0.02 * 0.5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: 30,
  },
  textFooter: {
    color: colors.textColor,
    fontSize: 18,
    marginTop: height * 0.02,
  },
  scroll: {
    flexGrow: 1,
    marginTop: height * 0.15,
  },
  passReset: {
    width: "75%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.02,
    marginTop: height * 0.02,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  passResetText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  label: {
    fontSize: 24,
    color: "#930055",
    paddingLeft: width * 0.05,
    paddingBottom: height * 0.03,
  },
  txtInput: {
    marginLeft: width * 0.05,
    borderBottomColor: "#009387",
    borderBottomWidth: 1,
    width: width * 0.9,
    paddingBottom: 5,
    paddingLeft: 10,
  },
});

export default PassResetScreen;
