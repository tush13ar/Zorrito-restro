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
import firebase from "firebase";
import { ListEmptyComponent } from "./SubsStack";

const { height, width } = Dimensions.get("window");

const Form = t.form.Form;

const userModel = t.struct({
  name: t.String,
  phone: t.String,
  email: t.String,
  address: t.String,
  mealTitle: t.String,
  mealNum: t.Number,
  mealPrice: t.Number,
});

export const PendingSub = ({ route, navigation }) => {
  const { pendingData } = route.params;

  const [formValue, setFormValue] = useState({
    name: pendingData.name,
    phone: pendingData.mobNum,
    email: pendingData.email,
    address: pendingData.location.address,
    mealTitle: null,
    mealNum: null,
    mealPrice: null,
    mealId: null,
  });
  const formRef = useRef();

  const { meals } = useSelector(getDatabase);

  const getSubscribedMeal = ({ mealId, mealNum }) => {
    const mealObj = meals.data.find((meal) => meal.key === mealId) || {};
    console.log("mealObject", mealObj.details);
    const mealTitle = mealObj?.title;
    const mealPrice =
      mealNum === 30 ? mealObj?.monthlyPrice : mealObj?.weeklyPrice;
    console.log(mealTitle, mealPrice);
    setFormValue({ ...formValue, mealTitle, mealPrice, mealNum, mealId });
  };

  const approveSub = async () => {
    try {
      const mealObj =
        meals.data.find((meal) => meal.key === formValue.mealId) || {};
      const itemTypes = Object.keys(mealObj.details);
      
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
  };

  const getSubDetail = () => {
    try {
      const pendingRef = firebase
        .app("Zorrito-restro")
        .database()
        .ref("users/" + "pendingSubscription/" + pendingData.key + "/");
      pendingRef.once("value", (snapshot) => {
        const val = snapshot.val();
        if (val) {
          getSubscribedMeal({
            mealId: val.subscriptionId,
            mealNum: val.mealNum,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    //console.log(meals);
    getSubDetail();
  }, [meals]);

  const onChange = (value) => {
    setFormValue(value);
  };

  return (
    <ScrollView>
      <Form
        ref={formRef}
        type={userModel}
        value={formValue}
        onChange={onChange}
      />
      <TouchableOpacity
        onPress={() => {
          approveSub();
        }}
        style={{ alignItems: "center" }}
      >
        <Text>Approve</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PendingSub;
