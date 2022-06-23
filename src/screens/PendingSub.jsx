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
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase";
import { ListEmptyComponent } from "./SubsStack";
import _ from "lodash";
import FormError from "../components/FormError";
import { ContinueBtn } from "../components/ContinueBtn";
import BackIcon from "../components/BackIcon";

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
  address: t.maybe(t.String),
  mealTitle: t.String,
  mealNum: t.Number,
  mealPrice: t.Number,
});

const options = {
  i18n: {
    optional: "",
    required: "",
  },
  fields: {
    address: {
      multiline: true,
      label: "Address/Location",
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
    address: pendingData?.location?.address || pendingData?.tempLocation,
    mealTitle: null,
    mealNum: pendingData.mealNum,
    mealPrice: null,
    mealId: pendingData.subscriptionId,
  });
  const [loaderVisible, setLoaderVisible] = useState(false);
  const formRef = useRef();

  const { meals, lunchOrders } = useSelector(getDatabase);

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

  const isLunchDelivered = () => {
    return (
      lunchOrders.data.find((order) => order.privilege === "delivered") !==
      undefined
    );
  };

  const approveSub = async () => {
    let value = formRef.current.getValue();
    console.log(value);

    if (value) {
      try {
        setLoaderVisible(true);
        console.log("hi");
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
        const newLunchKey = lunchRef.p;

        await pendingRef.remove();
        await activeRef.update({
          [pendingData.key]: {
            mealNum: formValue.mealNum,
            subscriptionId: formValue.mealId,
          },
        });
        await lunchRef.update({
          [pendingData.key]: {
            status: isLunchDelivered() ? "cancelled" : "incoming",
            items: lunchItems,
            orderId: uuidv4(),
            mealId: formValue.mealId,
          },
        });
        await dinnerRef.update({
          [pendingData.key]: {
            status: "incoming",
            items: dinnerItems,
            orderId: uuidv4(),
            mealId: formValue.mealId,
          },
        });
        await walletRef.update({
          [pendingData.key]: formValue.mealPrice,
        });
        setLoaderVisible(false);
        navigation.goBack();
      } catch (error) {
        alert(error);
        setLoaderVisible(false);
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
        marginTop: height * 0.12,
        // paddingTop: height * 0.02,
        backgroundColor: "#FFFFFF",
      }}
    >
      <ScrollView style={{ flex: 1, marginBottom: 60 }}>
        <Form
          ref={formRef}
          type={userModel}
          value={formValue}
          onChange={onChange}
          options={options}
        />
      </ScrollView>

      <ContinueBtn
        loaderVisible={loaderVisible}
        label={"APPROVE"}
        onPress={approveSub}
        bottom={10}
        position={"absolute"}
      />
    </View>
  );
};

export default PendingSub;
