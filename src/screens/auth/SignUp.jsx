import React, { useEffect, useRef, useState } from "react";
import t from "tcomb-form-native";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { authenticate, getUser } from "../../store/AuthSlice";
import { ContinueBtn } from "../../components/ContinueBtn";
import FormError from "../../components/FormError";
import { match } from "tcomb";
import BackIcon from "../../components/BackIcon";
import { colors } from "../../constants/colors";
import { height } from "../../constants/size";
import CheckBox from "@react-native-community/checkbox";

export const alertError = (error) => {
  const errorId = error;
  let message = "Something went wrong.";
  if (errorId === "auth/email-already-in-use")
    message = "User already exists. Try signing in.";
  else if (errorId === "auth/invalid-email") message = "Invalid Email";
  else if (errorId === "auth/user-not-found")
    message = "Email not found. Please sign up first.";
  else if (errorId === "auth/wrong-password") message = "Incorrect password.";
  alert(message);
};

var Form = t.form.Form;

let Email = t.refinement(t.String, (str) =>
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    str
  )
);

var UserModel = t.struct({
  email: Email,
  password: t.String,
  confirmPass: t.String,
});

const SignUp = ({ navigation }) => {
  const [formObj, setFormObj] = useState({
    email: null,
    password: null,
    confirmPass: null,
  });
  const [toggle, setToggle] = useState(false);
  const [formOptions, setFormOptions] = useState({
    fields: {
      password: {
        secureTextEntry: true,
      },
      confirmPass: {
        secureTextEntry: true,
      },
      email: {
        error: () => <FormError msg={"Invalid Email address!"} />,
      },
    },
  });
  const [loaderVisible, setLoaderVisible] = useState(false);
  const { status, error } = useSelector(getUser);
  const dispatch = useDispatch();
  const formRef = useRef();

  useEffect(() => {
    if (status === "loading") {
      setLoaderVisible(true);
    } else {
      setLoaderVisible(false);
      if (status === "failed") {
        //alertError(error);
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
        confirmPass: {
          secureTextEntry: !newValue,
        },
      },
    });
  };

  const onSubmit = () => {
    const value = formRef.current.getValue();
    console.log(value);
    if (value) {
      if (value?.password === value?.confirmPass) {
        dispatch(
          authenticate({
            authType: "signUp",
            email: formObj.email,
            password: formObj.password,
          })
        );
      } else {
        alert("Password do not match.");
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ justifyContent: "flex-start" }}
    >
      <BackIcon
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Text
        style={{
          color: colors.dark,
          fontSize: 26,
          alignSelf: "center",
          paddingTop: height * 0.2,
          paddingBottom: height * 0.022,
        }}
      >
        Welcome to Zorrito
      </Text>
      <Form
        ref={formRef}
        type={UserModel}
        value={formObj}
        options={formOptions}
        onChange={onChange}
      />
      <View
        style={{ flexDirection: "row", alignItems: "center", paddingLeft: 15 }}
      >
        <CheckBox value={toggle} onValueChange={onPressCheckBox} />
        <Text style={{ paddingLeft: 4 }}>Show Password</Text>
      </View>

      <View style={{ paddingTop: height * 0.1 }}>
        <ContinueBtn
          label="Submit"
          position={"relative"}
          onPress={onSubmit}
          bottom={0}
          loaderVisible={loaderVisible}
        />
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

export default SignUp;
