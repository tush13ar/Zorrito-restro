import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-elements";
import { width } from "../constants/size";
import { colors } from "../constants/colors";

const UserCard = ({ item, onPress }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={{ width: width }} onPress={onPress}>
      <Card
        containerStyle={{
          borderRadius: 10,
          backgroundColor: colors.primary,
          borderWidth: 0,
          //padding: 10,
        }}
        wrapperStyle={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <View>
          <View style={styles.row}>
            <Icon name={"user-circle"} color={"white"} size={16} />
            <Text style={[styles.cardText]}>{item.name}</Text>
          </View>
          <View style={styles.row}>
            <Icon name={"phone-alt"} color={"white"} size={16} />

            <Text style={[styles.cardText]}>{item.mobNum}</Text>
          </View>
          <View style={styles.row}>
            <Icon name={"envelope"} color={"white"} size={16} />

            <Text style={[styles.cardText]}>{item.email}</Text>
          </View>
        </View>

        <Icon
          name={"phone-alt"}
          size={18}
          color={"white"}
          onPress={() => {
            Linking.openURL(`tel: ${item.mobNum}`);
          }}
        />
      </Card>
    </TouchableOpacity>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 2,
  },
  cardText: {
    color: "white",
    paddingLeft: 5,
    fontSize: 14,
  },
});
