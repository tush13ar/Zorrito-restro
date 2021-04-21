import t from "tcomb-form-native";
import React, { useState, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { registerRestro } from "../store/DBSlice";

var Form = t.form.Form;

var RestroModel = t.struct({
  name: t.String,
});

const RegisterRestro = () => {
  const dispatch = useDispatch();

  const [restroDetails, setRestroDetails] = useState({ name: null });
  const formRef = useRef();

  const onChange = (obj) => {
    const value = formRef.current.getValue();
    if (value) {
      setRestroDetails(value);
    }
  };

  const onSubmit = () => {
    dispatch(registerRestro(restroDetails));
    console.log("pressed");
  };

  return (
    <View style={styles.container}>
      <Form
        ref={formRef}
        type={RestroModel}
        value={restroDetails}
        onChange={onChange}
      />
      <Text onPress={onSubmit} style={{ marginTop: 10 }}>
        Submit
      </Text>
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

export default RegisterRestro;
