import React, { useEffect, useRef, useState } from "react";
import t from "tcomb-form-native";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { authenticate, getUser } from "../../store/AuthSlice";
import { ContinueBtn } from "../../components/ContinueBtn";
import { height, width } from "../../constants/size";
import FormError from "../../components/FormError";
import { alertError } from "./SignUp";
import CheckBox from "@react-native-community/checkbox";
import { colors } from "../../constants/colors";

var Form = t.form.Form;

let Email = t.refinement(t.String, (str) =>
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    str
  )
);

var UserModel = t.struct({
  email: Email,
  password: t.String,
});

const SignIn = ({ navigation }) => {
  const [formObj, setFormObj] = useState({
    email: null,
    password: null,
  });
  const [formOptions, setFormOptions] = useState({
    fields: {
      password: {
        secureTextEntry: true,
      },
      email: {
        error: () => <FormError msg={"Invalid Email Address!"} />,
      },
    },
  });
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [toggle, setToggle] = useState(false);
  const { status, error } = useSelector(getUser);
  const dispatch = useDispatch();
  const formRef = useRef();

  useEffect(() => {
    if (status === "loading") {
      setLoaderVisible(true);
    } else {
      setLoaderVisible(false);
      if (status === "failed") {
        alertError(error);
      }
    }
  }, [status, error]);

  const onChange = (value) => {
    setFormObj(value);
  };

  const onPressCheckBox = (newValue) => {
    setToggle(newValue);
    setFormOptions({
      fields: {
        ...formOptions.fields,
        password: {
          secureTextEntry: !newValue,
        },
      },
    });
  };

  const onSubmit = () => {
    const value = formRef.current.getValue();
    value &&
      dispatch(
        authenticate({
          authType: "signIn",
          email: formObj.email,
          password: formObj.password,
        })
      );
    //console.log(typeof value.email, value.password);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ justifyContent: "flex-start" }}
    >
      <Image
        source={require("../../../assets/icon.png")}
        style={{
          height: width * 0.4,
          width: width * 0.4,
          alignSelf: "center",
          marginVertical: height * 0.13,
        }}
      />
      <Form
        ref={formRef}
        type={UserModel}
        value={formObj}
        options={formOptions}
        onChange={onChange}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: width * 0.05,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CheckBox value={toggle} onValueChange={onPressCheckBox} />
          <Text>Show Password</Text>
        </View>
        <Text
          style={{ color: "blue" }}
          onPress={() => {
            navigation.navigate("passReset");
          }}
        >
          Forgot Password?
        </Text>
      </View>

      <ContinueBtn
        label={"Sign In"}
        onPress={onSubmit}
        bottom={-10}
        position={"relative"}
        loaderVisible={loaderVisible}
      />

      <View
        style={{
          borderWidth: 1,
          width: width * 0.9,
          borderColor: colors.primary,
          alignSelf: "center",
          marginTop: height * 0.05,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 15,
        }}
      >
        <Text>Don't have an account? </Text>

        <Text
          onPress={() => {
            navigation.navigate("signUp");
          }}
          style={{ color: "blue" }}
        >
          Sign Up
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  submitbtn: {
    alignItems: "center",
  },
});

export default SignIn;
