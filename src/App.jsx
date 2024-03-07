import { useState, useEffect } from "react";
import "./App.css";
import WeatherCard from "./components/WeatherCard";
import SearchBar from "./components/SearchBar";
import Loader from "./components/Loader";
import NoLocationFoundMessage from "./components/NoLocationFoundMessage";

function App() {
  const [coords, setCoords] = useState({});
  const [weather, setWeather] = useState();
  const [temp, setTemp] = useState();
  const [minTemp, setMinTemp] = useState();
  const [maxTemp, setMaxTemp] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [rewriteCity, setRewriteCity] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [cityName, setCityName] = useState("");

  const APIKEY = "58263b9b6c04a51231eadfdea1f53d4d";

  const success = (info) => {
    setCoords({
      lat: info?.coords.latitude,
      long: info?.coords.longitude,
    });
  };

  const error = (err) => {
    console.log(err, "erroe");
    setRewriteCity(true);
  };

  const handleSearchCity = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCoords({});
    setWeather();
    try {
      const API = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${APIKEY}`;
      const response = await fetch(API);
      const result = await response.json();

      if (result.cod === 200) {
        setWeather(result);
        setIsLoading(false);
        const celsius = Number(result.main.temp.toFixed(1));
        const fahrenheit = ((9 / 5) * celsius + 32).toFixed(1);

        setTemp({ celsius, fahrenheit });
        const dataSunrise = new Date(result.sys.sunrise * 1000);
        const dataSunset = new Date(result.sys.sunset * 1000);
        const now = new Date();
        if (now > dataSunrise && now < dataSunset) {
          setNightMode(false);
        } else {
          setNightMode(false);
        }
      } else {
        setRewriteCity(true);
        setIsLoading(false);
      }
    } catch (e) {
      // setLoader(false);
      console.log(e);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  useEffect(() => {
    if (coords) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.long}&appid=${APIKEY}`;
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setWeather(data);
          const celsius = (data.main.temp - 273.15).toFixed(1);
          const fahrenheit = ((9 / 5) * celsius + 32).toFixed(1);
          setTemp({ celsius, fahrenheit });
          const dataSunrise = new Date(data.sys.sunrise * 1000);
          const dataSunset = new Date(data.sys.sunset * 1000);
          const now = new Date();

          if (now > dataSunrise && now < dataSunset) {
            setNightMode(false);
          } else {
            setNightMode(false);
          }
        })
        .catch((error) => {
          console.error(
            "There was a problem with your fetch operation:",
            error
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [coords]);

  return (
    <div
      className={`app
      ${
        weather?.weather[0].description === "clear sky"
          ? "bg-sky-clear"
          : weather?.weather[0].description === "few clouds"
          ? "bg-few-clouds"
          : weather?.weather[0].description === "scattered clouds"
          ? "bg-scattered-clouds"
          : weather?.weather[0].description === "broken clouds"
          ? "bg-broken-clouds"
          : weather?.weather[0].description === "shower rain" ||
            weather?.weather[0].description === "light rain"
          ? "bg-shower-rain"
          : weather?.weather[0].description === "rain"
          ? "bg-rain"
          : weather?.weather[0].description === "thunderstorm"
          ? "bg-storm"
          : weather?.weather[0].description === "snow"
          ? "bg-mist"
          : weather?.weather[0].description === "mist" && "bg-broken-clouds"
      }
      `}
    >
      <SearchBar
        handleSearchCity={handleSearchCity}
        setCityName={setCityName}
        cityName={cityName}
      />
      {isLoading ? (
        <Loader />
      ) : weather && weather?.weather[0].icon ? (
        <>
          <article
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100vw",
              alignItems: "center",
            }}
          >
            <WeatherCard
              weather={weather}
              temp={temp}
              nightMode={nightMode}
              maxTemp={maxTemp}
              minTemp={minTemp}
            />
          </article>{" "}
        </>
      ) : (
        rewriteCity && <NoLocationFoundMessage rewriteCity={rewriteCity} />
      )}
    </div>
  );
}

export default App;
