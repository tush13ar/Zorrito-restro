import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "react-native-elements";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import t from "tcomb-form-native";
import {
  getActiveSubList,
  getDatabase,
  getDatabaseRef,
  getWalletList,
} from "../store/DBSlice";
import Cart from "./Cart";
import CustomizeScreen from "./Menu";
import { ListEmptyComponent } from "./SubsStack";
import FormError from "../components/FormError";
import BackIcon from "../components/BackIcon";
import UserCard from "../components/UserCard";

const { height, width } = Dimensions.get("window");

export const ActiveList = ({ metaDatas }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [activeSubDataList, setActiveSubDatalist] = useState([]);

  const { activeSubList } = useSelector(getDatabase);

  const getActiveSubMetaData = () => {
    const activeSubMetaData = activeSubList.data.map((activeSub) => {
      const obj = metaDatas.find((item) => activeSub.key === item.key);
      return { ...obj, ...activeSub };
    });
    setActiveSubDatalist(activeSubMetaData);
  };

  useEffect(() => {
    activeSubList.status === "idle" && dispatch(getActiveSubList());
  }, [activeSubList]);

  useEffect(() => {
    activeSubList.data.length && getActiveSubMetaData();
  }, [activeSubList, metaDatas]);

  const renderItem = ({ item }) => (
    <UserCard
      item={item}
      onPress={() => {
        navigation.navigate("Active", {
          screen: "ActiveSub",
          params: { activeData: item },
        });
      }}
    />
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

let Phone = t.refinement(t.Number, (num) => {
  return num.toString().length === 10;
});

const ActiveModel = t.struct({
  name: t.String,
  phone: Phone,
  email: t.String,
  address: t.String,
});

const subModel = t.struct({
  subTitle: t.String,
});

const walletModel = t.struct({
  wallet: t.Number,
});

const ActiveSub = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { activeData } = route.params;
  const {
    meals,
    walletList,
    lunchOrders,
    dinnerOrders,
    menuItems,
    activeSubList,
  } = useSelector(getDatabase);
  const [form, setForm] = useState({
    name: activeData.name,
    phone: activeData.mobNum,
    email: activeData.email,
    address: activeData.location?.address,
  });
  const [subForm, setSubForm] = useState({
    subTitle: "",
  });
  const [walletForm, setWalletForm] = useState({
    wallet: null,
  });
  const [metaDataOptions, setMetaDataOptions] = useState({
    fields: {
      name: {
        editable: false,
      },
      phone: {
        editable: false,
        error: () => <FormError msg="Invalid Phone Number!" />,
      },
      address: {
        multiline: true,
        editable: false,
      },
      email: {
        editable: false,
      },
    },
  });
  const [subOptions, setSubOptions] = useState({
    fields: {
      subTitle: {
        editable: false,
      },
    },
  });
  const [walletOptions, setWalletOptions] = useState({
    fields: {
      wallet: {
        editable: false,
        error: () => <FormError msg="Enter valid amount!" />,
      },
    },
  });
  const [formEditable, setFormEditable] = useState(false);
  const [subFormEditable, setSubFormEditable] = useState(false);
  const [walletFormEditable, setWalletFormEditable] = useState(false);

  const getMealItems = (mealType) => {
    let mealItems;
    let privilege;
    if (mealType === "Lunch") {
      const lunchOrder = lunchOrders.data.find(
        (order) => order.key === activeData.key
      );
      mealItems = Object.keys(lunchOrder.items).map((item) => ({
        type: item,
        ...lunchOrder.items[item],
      }));
      privilege = lunchOrder?.privilege || "none";
    } else {
      const dinnerOrder = dinnerOrders.data.find(
        (order) => order.key === activeData.key
      );
      mealItems = Object.keys(dinnerOrder.items).map((item) => ({
        type: item,
        ...dinnerOrder.items[item],
      }));
      privilege = dinnerOrder?.privilege || "none";
    }
    const items = mealItems.map((item) => {
      let obj = {};
      for (const menuItem of menuItems.data) {
        if (menuItem.type === item.type) {
          obj = { ...item, name: menuItem.name };
          break;
        }
      }
      return obj;
    });
    return { items, privilege };
  };

  const updateDB = (type, value) => {
    let ref;
    switch (type) {
      case "wallet":
        ref = getDatabaseRef("users/" + type);

        ref.update({ [activeData.key]: Number(value) });
        break;

      case "metaData":
        ref = getDatabaseRef("users/" + "metaData/" + activeData.key);

        ref.update({ name: value.name, mobNum: value.phone });
        break;

      default:
        break;
    }
  };

  const editMeal = (mealType) => {
    const { items, privilege } = getMealItems(mealType);
    let nav = () => {
      navigation.navigate("Menu", {
        mealItems: items,
        mealType,
        userId: activeData.key,
        wallet: walletForm.wallet,
      });
    };
    if (mealType === "Dinner") {
      const { privilege: lunchPrivilege } = getMealItems("Lunch");
      lunchPrivilege === "delivered"
        ? nav()
        : alert("Dinner can only be edited after Lunch is delivered!");
    } else if (mealType === "Lunch") {
      privilege === "delivered"
        ? alert("Lunch has already been delivered!")
        : nav();
    }
  };

  const getSubTitle = () => ({
    subTitle: meals?.data.find((meal) => meal.key === activeData.subscriptionId)
      ?.title,
  });
  const getWallet = () => {
    return {
      wallet: walletList.data.find((wallet) => wallet.key === activeData.key)
        ?.amount,
    };
  };

  useEffect(() => {
    walletList.status === "idle" && dispatch(getWalletList());
  }, [walletList.status]);

  useEffect(() => {
    setSubForm(getSubTitle());
  }, [meals, activeSubList]);

  useEffect(() => {
    setWalletForm(getWallet());
  }, [walletList]);

  const formRef = useRef();
  const subFormRef = useRef();
  const walletFormRef = useRef();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, marginTop: 70 }}>
        <Icon
          name={
            metaDataOptions.fields.name.editable &&
            metaDataOptions.fields.phone.editable
              ? "arrow-right"
              : "pen"
          }
          size={18}
          style={{ alignSelf: "flex-end", paddingRight: 10 }}
          onPress={() => {
            let options = t.update(metaDataOptions, {
              fields: {
                name: {
                  editable: { $set: !metaDataOptions.fields.name.editable },
                },
                phone: {
                  editable: { $set: !metaDataOptions.fields.phone.editable },
                },
              },
            });

            if (formRef.current.getValue()) {
              setMetaDataOptions(options);
              metaDataOptions.fields.name.editable &&
                metaDataOptions.fields.phone.editable &&
                updateDB("metaData", form);
            }
          }}
        />
        <Form
          type={ActiveModel}
          ref={formRef}
          value={form}
          onChange={setForm}
          options={metaDataOptions}
        />
        {/* <Icon
          name={subFormEditable ? "arrow-right" : "pen"}
          size={18}
          style={{ alignSelf: "flex-end", paddingRight: 10, paddingTop: 10 }}
          onPress={() => {
            setSubFormEditable(!subFormEditable);
          }}
        /> */}
        <Form
          type={subModel}
          ref={subFormRef}
          value={subForm}
          onChange={setSubForm}
          options={subOptions}
        />
        <Icon
          name={walletOptions.fields.wallet.editable ? "arrow-right" : "pen"}
          size={18}
          onPress={() => {
            let options = t.update(walletOptions, {
              fields: {
                wallet: {
                  editable: { $set: !walletOptions.fields.wallet.editable },
                },
              },
            });
            if (walletFormRef.current.getValue()) {
              setWalletOptions(options);
              walletOptions.fields.wallet.editable &&
                updateDB("wallet", walletForm.wallet);
            }
          }}
          style={{ alignSelf: "flex-end", paddingRight: 10, paddingTop: 10 }}
        />

        <Form
          type={walletModel}
          ref={walletFormRef}
          value={walletForm}
          onChange={setWalletForm}
          options={walletOptions}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: 20,
            paddingBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              editMeal("Lunch");
            }}
          >
            <Text style={styles.editLabel}>Edit Lunch</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              editMeal("Dinner");
            }}
          >
            <Text style={styles.editLabel}>Edit Dinner</Text>
          </TouchableOpacity>
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

const Stack = createStackNavigator();

const ActiveSubStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ActiveSub"
      component={ActiveSub}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Menu" component={CustomizeScreen} />
    <Stack.Screen name="Cart" component={Cart} />
  </Stack.Navigator>
);

export default ActiveSubStack;

const styles = StyleSheet.create({
  editLabel: {
    fontSize: 18,
    color: "#930055",
  },
});
