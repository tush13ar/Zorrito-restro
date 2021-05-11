import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import MapView, { Marker, Overlay } from "react-native-maps";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { getDistance } from "geolib";

import { useLayoutEffect } from "react";
import { Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const getLocationPermission = async () => {
  const result = await Permissions.askAsync(Permissions.LOCATION);
  if (result.status !== "granted") {
    Alert.alert("Please provide location permission.");
    return false;
  }
  return true;
};

export const hello = () => (
  <View>
    <Text>t</Text>
  </View>
);

const Map = ({ navigation, route }) => {
  const [location, setLocation] = useState({
    latitude: 26.86639,
    longitude: 75.78103,
  });
  const [address, setAddress] = useState(null);

  useLayoutEffect(() => {
    console.log("address", address);
    navigation.setOptions({
      headerRight: () =>
        address && (
          <TouchableOpacity onPress={confirmLocation} style={styles.btn}>
            <Text style={styles.btnText}>Proceed</Text>
          </TouchableOpacity>
        ),
    });
  }, [navigation, address]);

  let mapRegion = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const pickLocationHandler = async (event) => {
    setLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${event.nativeEvent.coordinate.latitude},${event.nativeEvent.coordinate.longitude}&key=AIzaSyAo9kdrpcvZnEY4amU19k4_LbUCMVkzFWk`
      );
      const resData = await response.json();
      setAddress(resData.results[0].formatted_address);
    } catch (err) {}
  };

  const getCurrentLocation = useCallback(async () => {
    const locationPermission = await getLocationPermission();
    if (!locationPermission) return;
    try {
      const locationData = await Location.getCurrentPositionAsync({
        timeout: 5000,
      });
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationData.coords.latitude},${locationData.coords.longitude}&key=AIzaSyAo9kdrpcvZnEY4amU19k4_LbUCMVkzFWk`
      );
      const resData = await response.json();
      setAddress(resData.results[0].formatted_address);
      setLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      });
    } catch (err) {
      Alert.alert("Unable to fetch location");
    }
  }, []);

  const getDist = () => {
    const val = getDistance(
      { latitude: 26.86639, longitude: 75.78103 },
      { latitude: location.latitude, longitude: location.longitude }
    );
    return val;
  };

  const confirmLocation = () => {
    if (getDist() > 5000) {
      Alert.alert(
        "Sorry we do not deliver here yet.",
        "We will get there soon."
      );
      return;
    }
    console.log(" route params", route);
    navigation.navigate("email", {
      coord: {
        lat: location.latitude,
        lng: location.longitude,
      },

      address,
      ...route.params,
    });
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        onPress={pickLocationHandler}
      >
        <Marker title="You" coordinate={location} />
      </MapView>

      <Icon
        name="locate-outline"
        size={30}
        color="#fff"
        onPress={getCurrentLocation}
        style={styles.locationBtn}
      />
      <View style={styles.footer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Select delivery location</Text>
        </View>
        <View style={styles.addressContainer}>
          <Text style={{ color: "#A9A9A9" }}>Your location</Text>
          <Text style={{ fontWeight: "bold" }}>{address || ""}</Text>
        </View>
        {/* <TouchableOpacity style={styles.btn} onPress={confirmLocation}>
            <Text style={styles.btnText}>Confirm location and proceed</Text>
          </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  addressContainer: {
    flex: 2,
    padding: width * 0.02,
  },
  btn: {
    height: "70%",
    width: "100%",
    padding: width * 0.02,
    backgroundColor: "#009387",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  btnText: {
    fontSize: 20,
    color: "#fff",
  },
  container: {
    flex: 1,
  },
  footer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  locationBtn: {
    position: "absolute",
    right: 10,
    bottom: 150,
    padding: 3,
    borderRadius: 20,
    backgroundColor: "#009387",
  },
  map: {
    flex: 3,
  },
  title: {
    fontSize: 18,
  },
  titleContainer: {
    flex: 1,
    padding: width * 0.02,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});

export default Map;
