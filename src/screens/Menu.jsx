import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import CartIcon from "../components/CartIcon";
import MenuCard from "../components/MenuCard";
import { getDatabase } from "../store/DBSlice";

const { height, width } = Dimensions.get("window");

const Menu = ({
  menu,
  navigation,
  route: {
    params: { mealItems, mealType, userId, wallet },
  },
}) => {
  const [newMenu, setNewMenu] = useState([]);
  const [total, setTotal] = useState(null);

  const paramObj = { newMenu, total, userId, mealType, wallet };

  let menuItems = menu.map((item) => {
    let matchingItem = mealItems.find(
      (mealItem) => mealItem.type === item.type
    );
    if (matchingItem) {
      return { ...item, quantity: matchingItem.quantity };
    } else {
      return { ...item, quantity: 0 };
    }
  });

  useEffect(() => {
    console.log("mealItems", mealItems);
  }, []);

  useEffect(() => {
    setNewMenu(mealItems.map((items) => ({ ...items })));
  }, []);

  useEffect(() => {
    getTotal();
    navigation.setOptions({
      headerRight: () => (
        <CartIcon
          badge={newMenu.length}
          paramObj={paramObj}
          navigation={navigation}
          oldMenu={mealItems}
        />
      ),
    });
  }, [newMenu, total]);

  const getTotal = () => {
    const total = newMenu.reduce((acc, cur) => {
      return acc + Number(cur.quantity) * Number(cur.price);
    }, 0);
    setTotal(total);
  };

  const onModify = ({ modificationType, itemName, price, type }) => {
    const index = newMenu.findIndex((item) => item.name === itemName);
    //console.log(modificationType + "  " + itemName);
    if (index !== -1) {
      let menu = [...newMenu];
      if (modificationType === "remove") {
        if (newMenu[index].quantity === 1) {
          menu.splice(index, 1);
          setNewMenu(menu);
        } else {
          menu[index].quantity = menu[index].quantity - 1;
          setNewMenu(menu);
        }
      } else if (modificationType === "add") {
        menu[index].quantity = menu[index].quantity + 1;
        setNewMenu(menu);
      }
    } else {
      const item = { name: itemName, quantity: 1, price, type };
      const arr = [...newMenu, item];
      setNewMenu(arr);
      console.log(arr);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: "2.5%",
      }}
    >
      <ScrollView style={{ paddingBottom: "50%", flex: 1 }}>
        {menuItems.map((item) => (
          <MenuCard {...item} category={"Item"} onModify={onModify} />
        ))}
      </ScrollView>
    </View>
  );
};

const CustomizeScreen = ({ navigation, route }) => {
  const { menuItems } = useSelector(getDatabase);

  return <Menu menu={menuItems.data} navigation={navigation} route={route} />;
};

export default CustomizeScreen;
