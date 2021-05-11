import React, { useState, useRef, useEffect } from "react";
import t from "tcomb-form-native";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  FlatList,
  Card,
  Dimensions,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getDatabase } from "../store/DBSlice";
import { LinearGradient } from "expo-linear-gradient";

import firebase from "firebase";
import { ListEmptyComponent } from "./SubsStack";
import _ from "lodash";
import FormError from "../components/FormError";

const { height, width } = Dimensions.get("window");

const Form = t.form.Form;

t.form.Form.stylesheet.controlLabel.normal = {
  fontSize: 16,
  color: "#930055",
  marginTop: 20,
  paddingLeft: width * 0.05,
};

(t.form.Form.stylesheet.controlLabel.error = {
  fontSize: 16,
  color: "#a94442",
  marginTop: 20,
  paddingLeft: width * 0.05,
}),
  (t.form.Form.stylesheet.textbox.normal = {
    marginLeft: width * 0.05,
    borderBottomColor: "#009387",
    borderBottomWidth: 1,
    width: width * 0.9,
    paddingBottom: 5,
    paddingLeft: 10,
    color: "black",
  });
t.form.Form.stylesheet.textbox.notEditable = {
  marginLeft: width * 0.05,
  borderBottomColor: "#009387",
  borderBottomWidth: 1,
  width: width * 0.9,
  paddingBottom: 5,
  paddingLeft: 10,
  color: "#777777",
};
t.form.Form.stylesheet.textbox.error = {
  marginLeft: width * 0.05,
  borderBottomColor: "#a94442",
  borderBottomWidth: 1,
  width: width * 0.9,
  paddingBottom: 5,
  paddingLeft: 10,
  color: "#a94442",
};

const userModel = t.struct({
  name: t.String,
  phone: t.Number,
  email: t.String,
  address: t.String,
  mealTitle: t.String,
  mealNum: t.Number,
  mealPrice: t.Number,
});

const options = {
  fields: {
    address: {
      multiline: true,
    },
    email: {
      editable: false,
    },
    mealNum: {
      editable: false,
      label: "Number of meals",
    },
    mealPrice: {
      editable: false,
      label: "Price",
    },
    mealTitle: {
      editable: false,
    },
    phone: {
      error: () => <FormError msg={"Invalid Phone Number!"} />,
    },
  },
};

export const PendingSub = ({ route, navigation }) => {
  const { pendingData } = route.params;

  const [formValue, setFormValue] = useState({
    name: pendingData.name,
    phone: pendingData.mobNum,
    email: pendingData.email,
    address: pendingData.location.address,
    mealTitle: null,
    mealNum: pendingData.mealNum,
    mealPrice: null,
    mealId: pendingData.subscriptionId,
  });
  const formRef = useRef();

  const { meals } = useSelector(getDatabase);

  useEffect(() => {
    console.log("changeinpendingData");
  }, [route.params]);

  const getSubDetail = () => {
    const mealObj =
      meals.data.find((meal) => meal.key === pendingData.subscriptionId) || {};
    const mealTitle = mealObj?.title;
    const mealPrice =
      pendingData.mealNum === 30 ? mealObj?.monthlyPrice : mealObj?.weeklyPrice;
    setFormValue({ ...formValue, mealTitle, mealPrice });
  };

  useEffect(() => {
    getSubDetail();
  }, [
    meals,
    pendingData.mealNum,
    pendingData.subscriptionId,
    pendingData.timeStamp,
  ]);

  const approveSub = async () => {
    let value = formRef.current.getValue();
    if (value) {
      try {
        const mealObj =
          meals.data.find((meal) => meal.key === formValue.mealId) || {};
        const itemTypes = Object.keys(mealObj.details);
        let lunchItems = {};
        let dinnerItems = {};
        itemTypes.forEach((item) => {
          if (mealObj.details[item]?.timing === "Lunch") {
            lunchItems[item] = mealObj.details[item];
          } else if (mealObj.details[item]?.timing === "Dinner") {
            dinnerItems[item] = mealObj.details[item];
          } else {
            lunchItems[item] = mealObj.details[item];
            dinnerItems[item] = mealObj.details[item];
          }
        });
        const pendingRef = firebase
          .app("Zorrito-restro")
          .database()
          .ref("users/" + "pendingSubscription/" + pendingData.key);
        const activeRef = firebase
          .app("Zorrito-restro")
          .database()
          .ref("users/" + "activeSubscription");
        const lunchRef = firebase
          .app("Zorrito-restro")
          .database()
          .ref("users/" + "meals/" + "Lunch");
        const dinnerRef = firebase
          .app("Zorrito-restro")
          .database()
          .ref("users/" + "meals/" + "Dinner");
        const walletRef = firebase
          .app("Zorrito-restro")
          .database()
          .ref("users/" + "wallet");

        await pendingRef.remove();
        await activeRef.update({
          [pendingData.key]: {
            mealNum: formValue.mealNum,
            subscriptionId: formValue.mealId,
          },
        });
        await lunchRef.update({
          [pendingData.key]: { status: "incoming", items: lunchItems },
        });
        await dinnerRef.update({
          [pendingData.key]: { status: "incoming", items: dinnerItems },
        });
        await walletRef.update({
          [pendingData.key]: formValue.mealPrice,
        });
        navigation.goBack();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onChange = (value) => {
    console.log(value);
    setFormValue(value);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        marginTop: 20,
      }}
    >
      <ScrollView style={{ flex: 1, marginBottom: 70 }}>
        <Form
          ref={formRef}
          type={userModel}
          value={formValue}
          onChange={onChange}
          options={options}
        />
      </ScrollView>
      <LinearGradient
        colors={["#009387", "#23837a", "#1b6e66"]}
        style={{
          height: 40,
          width: width * 0.9,
          position: "absolute",
          left: width * 0.05,
          borderRadius: 20,
          bottom: 25,
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: width * 0.9,
            height: 40,
          }}
          onPress={approveSub}
        >
          <Text style={{ color: "white" }}>Approve</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default PendingSub;
