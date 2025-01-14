import { CurrentWeather, ForecastResponse } from "../types/api-types";
import axios from "axios";
import { REACT_APP_API_KEY as API } from "@env";

export const fetchWeatherByCoordinates = async (
  lat: number,
  lon: number
): Promise<CurrentWeather> => {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat,
          lon,
          appid: API,
          units: "metric"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error receiving weather data by coordinates:", error);
    throw new Error("Could not get weather data at the coordinates");
  }
};

export const fetchWeatherByCity = async (
  city: string
): Promise<ForecastResponse> => {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          q: city,
          appid: API,
          units: "metric"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failure to receive outdoor weather data:", error);
    throw new Error("Unable to obtain weather data outside the city");
  }
};
