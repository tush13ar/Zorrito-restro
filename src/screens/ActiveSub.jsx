import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Card } from "react-native-elements";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../store/AuthSlice";
import {
  getDatabase,
  getUsersMetaData,
  getMeals,
  getMenuItems,
  getActiveSubList,
} from "../store/DBSlice";
import t from "tcomb-form-native";
import { ListEmptyComponent } from "./SubsStack";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

export const ActiveList = ({ metaDatas }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [activeSubDataList, setActiveSubDatalist] = useState([]);

  const { activeSubList } = useSelector(getDatabase);

  const getActiveSubMetaData = () => {
    //console.log("activeSubList", activeSubList);
    const activeSubMetaData = activeSubList.data.map((activeSub) => {
      const obj = metaDatas.find((item) => activeSub.key === item.key);
      return { ...obj, ...activeSub };
    });
    setActiveSubDatalist(activeSubMetaData);
    //console.log("activeSubMetaData", activeSubMetaData);
  };

  useEffect(() => {
    activeSubList.status === "idle" && dispatch(getActiveSubList());
  }, [activeSubList]);

  useEffect(() => {
    activeSubList.data.length && getActiveSubMetaData();
  }, [activeSubList, metaDatas]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ width }}
      onPress={() => {
        navigation.navigate("Active", { activeData: item });
      }}
    >
      <Card>
        <Text>Name: {item.name}</Text>
        <Text>Phone: {item.mobNum}</Text>
        <Text>Email: {item.email}</Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={activeSubDataList}
      renderItem={renderItem}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};

const Form = t.form.Form;

const ActiveModel = t.struct({
  name: t.String,
  phone: t.String,
  email: t.String,
  address: t.String,
});

const ActiveSub = ({ route }) => {
  const { activeData } = route.params;
  const [form, setForm] = useState({
    name: activeData.name,
    phone: activeData.mobNum,
    email: activeData.email,
    address: activeData.location.address,
  });
  const navigation = useNavigation();
  const formRef = useRef();
  const onChange = (val) => {
    setForm(val);
  };
  return (
    <ScrollView style={{ flex: 1 }}>
      <Form type={ActiveModel} ref={formRef} value={form} onChange={onChange} />
    </ScrollView>
  );
};

export default ActiveSub;
