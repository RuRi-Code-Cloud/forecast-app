function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 4) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
              <div class="forecast-date">${formatDay(forecastDay.time)}</div>
              <img
                src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                  forecastDay.condition.icon
                }.png"
                alt=""
                width="65px"
                
              />
              <div class="forecast-temp">
                <span class="max-temp"><strong>${Math.round(
                  forecastDay.temperature.maximum
                )}°</strong></span
                ><span class="min-temp">${Math.round(
                  forecastDay.temperature.minimum
                )}°</span>
              </div>
            </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = `2b03bfeb040ctdb92faf2af53622202o`;
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  document.querySelector("h1").innerHTML = response.data.city;
  document.querySelector("h2").innerHTML = response.data.country;

  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  celsiusTemp = response.data.temperature.current;
  document.querySelector("#heat").innerHTML = Math.round(celsiusTemp);
  document.querySelector("#type").innerHTML =
    response.data.condition.description;
  document.querySelector("#time").innerHTML = formatDate(
    response.data.time * 1000
  );

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    `src`,
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );

  getForecast(response.data.coordinates);
}

function search(event) {
  let apiKey = `2b03bfeb040ctdb92faf2af53622202o`;
  let city = document.querySelector("#text").value;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function findCity(event) {
  event.preventDefault();
  let textElement = document.querySelector("#text");
  search(textElement.value);
}

function changeFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#heat");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
}

function changeCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#heat");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
}

let celsiusTemp = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", findCity);

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", changeFahrenheit);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", changeCelsius);
