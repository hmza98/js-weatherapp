import {
  API,
  tmpHeading,
  windSHeading,
  windDHeading,
  selectedlocation,
  cityName,
  errorMsg,
  playArea,
} from "./constants.js";

const getWeatherUpdate = async (city) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}`
  );
  if (response.status === 404) {
    return "404";
  }

  const {
    main: { temp },
    wind,
    name,
    sys: { country },
    weather,
  } = await response.json();

  let celsius = parseFloat(temp);
  celsius = Math.round(celsius - 273.15);
  setBackground(weather[0].main);
  return [celsius, name, country, wind.speed, wind.deg];
};

const displayWeatherData = async (event, city = "Lahore") => {
  let weatherData = await getWeatherUpdate(city);

  if (weatherData === "404") {
    weatherData = await getWeatherUpdate("Lahore");
    errorMsg.innerHTML = "Please enter a valid city name.";
  } else {
    errorMsg.innerHTML = "";
  }

  const [temp, cityNameIs, countryName, windSpeed, windDeg] = weatherData;
  tmpHeading.innerHTML = `${temp}&deg`;
  windSHeading.innerHTML = `${windSpeed}`;
  windDHeading.innerHTML = `${windDeg}&deg`;
  selectedlocation.innerHTML = `${cityNameIs}, ${countryName}`;
};

const setBackground = (color = "all") => {
  playArea.className = "";
  playArea.className = "playarea";
  switch (color) {
    case "Smoke" || "Fog" || "Clouds" || "Rain":
      playArea.classList.add("smoke");
      break;
    case "Clear":
      playArea.classList.add("clear");
      break;
    default:
      playArea.classList.add("all");
  }
};

const searchWeather = async (e) => {
  if (removeWhiteSpaces(cityName.value).length > 1) {
    displayWeatherData(e, cityName.value);
  } else {
    errorMsg.innerHTML = "Please enter a valid city name.";
  }
};

const removeWhiteSpaces = (str) => {
  return str.replace(/ /g, "");
};
window.onload = displayWeatherData;

export { searchWeather };
