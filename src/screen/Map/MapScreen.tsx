import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import MapView, { Marker, LongPressEvent } from "react-native-maps";
import { AppColors } from "../../constants/Colors";
import { AppText } from "../../components/AppText";
import { styles } from "./MapStyle";
import { fetchWeatherByCoordinates } from "../../api/api";
import { CurrentWeather } from "../../types/api-types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootTabParamList } from "../../types/navigation-types";
import Geolocation from "@react-native-community/geolocation";

type MapScreenNavigationProp = StackNavigationProp<RootTabParamList, "Map">;

export const MapScreen = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const [markerCoordinate, setMarkerCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [weatherData, setWeatherData] = useState<null | CurrentWeather>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserLocation = async () => {
    try {
      const location = await new Promise<{
        latitude: number;
        longitude: number;
      }>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            reject(error);
          }
        );
      });
      setUserLocation(location);
      setLoading(false);
    } catch (error) {
      console.error("Unable to get the location:", error);
      setUserLocation({ latitude: 48.3794, longitude: 31.1656 });
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleMapLongPress = async (event: LongPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setMarkerCoordinate(coordinate);
    try {
      const response = await fetchWeatherByCoordinates(
        coordinate.latitude,
        coordinate.longitude
      );
      setWeatherData(response);
    } catch (error) {
      console.error("Error receiving weather data:", error);
    }
  };

  const handleMarkerPress = () => {
    if (weatherData) {
      navigation.navigate("Search", { cityName: weatherData.name });
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={AppColors.blue} />
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: userLocation?.latitude ?? 48.3794,
              longitude: userLocation?.longitude ?? 31.1656,
              latitudeDelta: 5,
              longitudeDelta: 5
            }}
            onLongPress={handleMapLongPress}>
            {markerCoordinate && weatherData && (
              <Marker
                coordinate={markerCoordinate}
                title={weatherData?.name}
                description={`${weatherData?.weather[0].main}, ${Math.round(
                  weatherData.main.temp
                )}°`}
                onPress={handleMarkerPress}
              />
            )}
          </MapView>
          <AppText
            toUpperCase
            color={AppColors.blue}
            fontSize={20}
            fontWeight={"bold"}
            style={styles.header}>
            Location
          </AppText>
        </>
      )}
    </View>
  );
};
