import React, { useRef, useState } from "react";
import t from "tcomb-form-native";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { authenticate } from "../../store/AuthSlice";

var Form = t.form.Form;

var UserModel = t.struct({
  email: t.String,
  password: t.String,
  confirmPass: t.String,
});

const SignUp = () => {
  const [formObj, setFormObj] = useState({
    email: null,
    password: null,
    confirmPass: null,
  });
  const dispatch = useDispatch();
  const formRef = useRef();

  const onChange = (value) => {
    setFormObj(value);
  };

  const onSubmit = () => {
    const value = formRef.current.getValue();
    dispatch(
      authenticate({
        authType: "signUp",
        email: formObj.email,
        password: formObj.password,
      })
    );
    //console.log(typeof value.email, value.password);
  };

  return (
    <View style={styles.container}>
      <Form
        ref={formRef}
        type={UserModel}
        value={formObj}
        onChange={onChange}
      />
      <TouchableOpacity style={styles.submitbtn} onPress={onSubmit}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  submitbtn: {
    alignItems: "center",
  },
});

export default SignUp;
