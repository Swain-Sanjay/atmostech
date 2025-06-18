const API_KEY = "a8e71c9932b20c4ceb0aed183e6a83bb";

const getWeatherData = (city) => {
    const URL = "https://api.openweathermap.org/data/2.5/weather";
    const FULL_URL = `${URL}?q=${city}&appid=${API_KEY}&units=imperial`;
    return fetch(FULL_URL).then((res) => {
        return res.json();
    })
}

const searchCity = () => {
    const city = document.getElementById('city-input').value;
    getWeatherData(city)
        .then((res) => {
            showWeatherData(res);
        }).catch((error) => {
            console.log(error);
            console.log("Something happened");
        })
}
showWeatherData = (weatherData) => {
    document.getElementById("city-name").innerText = weatherData.name;
    document.getElementById("weather-type").innerText = weatherData.weather[0].main;
    document.getElementById("temp").innerText = weatherData.main.temp;
    document.getElementById("min-temp").innerText = weatherData.main.temp_min;
    document.getElementById("max-temp").innerText = weatherData.main.temp_max;
}

const districts = [
  "Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Deogarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada","Sambalpur","Subarnapur","Sundargarh"
];

const weatherEmojis = {
  "Thunderstorm": "⛈️",
  "Drizzle": "🌦️",
  "Rain": "🌧️",
  "Snow": "❄️",
  "Clear": "☀️",
  "Clouds": "☁️",
  "Mist": "🌫️",
  "Smoke": "🌫️",
  "Haze": "🌫️",
  "Dust": "🌫️",
  "Fog": "🌫️",
  "Sand": "🌫️",
  "Ash": "🌫️",
  "Squall": "🌬️",
  "Tornado": "🌪️"
};

const bgIcons = {
  "Thunderstorm": "⛈️",
  "Drizzle": "🌦️",
  "Rain": "🌧️",
  "Snow": "❄️",
  "Clear": "☀️",
  "Clouds": "☁️",
  "Mist": "🌫️",
  "Smoke": "🌫️",
  "Haze": "🌫️",
  "Dust": "🌫️",
  "Fog": "🌫️",
  "Sand": "🌫️",
  "Ash": "🌫️",
  "Squall": "🌬️",
  "Tornado": "🌪️"
};

let useCelsius = true;
let recent = [];

function showSuggestions() {
  const input = document.getElementById("citySearch");
  const suggestions = document.getElementById("suggestions");
  const value = input.value.trim().toLowerCase();
  suggestions.innerHTML = "";
  if (!value) {
    suggestions.style.display = "none";
    return;
  }
  const matches = districts.filter(d => d.toLowerCase().startsWith(value));
  if (matches.length === 0) {
    suggestions.style.display = "none";
    return;
  }
  matches.forEach((district, idx) => {
    const li = document.createElement("li");
    li.textContent = district;
    li.tabIndex = 0;
    li.onmousedown = () => {
      input.value = district;
      suggestions.style.display = "none";
      showWeather();
    };
    suggestions.appendChild(li);
  });
  suggestions.style.display = "block";
}

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".autocomplete")) {
    document.getElementById("suggestions").style.display = "none";
  }
});

function formatTemp(temp) {
  if (useCelsius) return `${Math.round(temp)}°C`;
  return `${Math.round(temp * 9/5 + 32)}°F`;
}

function formatTime(unix, timezone) {
  const date = new Date((unix + timezone) * 1000);
  return date.toUTCString().match(/\d{2}:\d{2}/)[0];
}

function setBackground(main) {
  const bg = document.body;
  const icon = document.getElementById("backgroundIcon");
  if (main === "Clear") {
    bg.style.background = "linear-gradient(135deg, #f6d365 0%, #fda085 100%)";
  } else if (main === "Rain" || main === "Drizzle" || main === "Thunderstorm") {
    bg.style.background = "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)";
  } else if (main === "Snow") {
    bg.style.background = "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)";
  } else if (main === "Clouds") {
    bg.style.background = "linear-gradient(135deg, #d7d2cc 0%, #304352 100%)";
  } else {
    bg.style.background = "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)";
  }
  icon.innerText = bgIcons[main] || "🌈";
}

function saveRecent(city) {
  if (!recent.includes(city)) {
    recent.unshift(city);
    if (recent.length > 5) recent = recent.slice(0, 5);
    localStorage.setItem("recentWeatherSearches", JSON.stringify(recent));
  }
  renderRecent();
}

function renderRecent() {
  const container = document.getElementById("recentSearches");
  container.innerHTML = "";
  recent.forEach(city => {
    const btn = document.createElement("button");
    btn.innerText = city;
    btn.onclick = () => {
      document.getElementById("citySearch").value = city;
      showWeather();
    };
    container.appendChild(btn);
  });
}

async function getWeather(city) {
  const spinner = document.getElementById("spinner");
  const errorMsg = document.getElementById("errorMsg");
  const weatherContent = document.getElementById("weatherContent");
  spinner.style.display = "block";
  errorMsg.innerText = "";
  weatherContent.style.display = "none";
  try {
    const apiKey = "4cbafd1bcd01ce497a8639dd2db5cb52";
    // Current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const currentRes = await fetch(currentUrl);
    if (!currentRes.ok) throw new Error('City not found');
    const currentData = await currentRes.json();

    document.getElementById("cityName").innerText = currentData.name;
    document.getElementById("weatherTemp").innerText = formatTemp(currentData.main.temp);
    document.getElementById("weatherDesc").innerText = currentData.weather[0].description;
    document.getElementById("feelsLike").innerText = `Feels like: ${formatTemp(currentData.main.feels_like)}`;
    document.getElementById("humidity").innerText = `💧 ${currentData.main.humidity}%`;
    document.getElementById("wind").innerText = `💨 ${currentData.wind.speed} m/s`;
    document.getElementById("sunrise").innerText = `🌅 Sunrise: ${formatTime(currentData.sys.sunrise, currentData.timezone)}`;
    document.getElementById("sunset").innerText = `🌇 Sunset: ${formatTime(currentData.sys.sunset, currentData.timezone)}`;
    document.getElementById("weatherEmoji").innerText = weatherEmojis[currentData.weather[0].main] || "🌈";
    setBackground(currentData.weather[0].main);

    // 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const forecastRes = await fetch(forecastUrl);
    if (!forecastRes.ok) throw new Error("Forecast not found");
    const forecastData = await forecastRes.json();

    // Group forecast by day (get one forecast per day at 12:00)
    const forecastList = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
    const forecastGrid = document.getElementById("forecastGrid");
    forecastGrid.innerHTML = "";
    forecastList.slice(0, 5).forEach(item => {
      const date = new Date(item.dt_txt);
      const day = date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
      const emoji = weatherEmojis[item.weather[0].main] || "🌈";
      const card = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `
        <div class="forecast-date">${day}</div>
        <div class="forecast-emoji">${emoji}</div>
        <div class="forecast-temp">${formatTemp(item.main.temp)}</div>
        <div class="forecast-desc">${item.weather[0].description}</div>
      `;
      forecastGrid.appendChild(card);
    });

    spinner.style.display = "none";
    weatherContent.style.display = "block";
    saveRecent(currentData.name);
  } catch (error) {
    spinner.style.display = "none";
    weatherContent.style.display = "none";
    errorMsg.innerText = error.message === "City not found"
      ? "City not found. Please check the spelling or try another district."
      : "Unable to fetch weather data. Please try again later.";
    setBackground("Clear");
    console.error(error);
  }
}

function showWeather() {
  const searchValue = document.getElementById("citySearch").value.trim();
  const city = searchValue.length > 0 ? searchValue : "Bhubaneswar";
  getWeather(city);
}

function toggleUnit() {
  useCelsius = !useCelsius;
  document.getElementById("unitLabel").innerText = useCelsius ? "°C" : "°F";
  showWeather();
}

document.getElementById("locationBtn").onclick = function() {
  if (navigator.geolocation) {
    document.getElementById("spinner").style.display = "block";
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      try {
        const apiKey = "4cbafd1bcd01ce497a8639dd2db5cb52";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Location not found');
        const data = await response.json();
        document.getElementById("citySearch").value = data.name;
        showWeather();
      } catch (e) {
        document.getElementById("spinner").style.display = "none";
        document.getElementById("errorMsg").innerText = "Could not get weather for your location.";
      }
    }, () => {
      document.getElementById("spinner").style.display = "none";
      document.getElementById("errorMsg").innerText = "Location access denied.";
    });
  } else {
    document.getElementById("errorMsg").innerText = "Geolocation not supported.";
  }
};

document.getElementById("themeToggle").onclick = function() {
  document.body.classList.toggle("dark");
  this.innerText = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

window.onload = () => {
  // Load recent searches
  const stored = localStorage.getItem("recentWeatherSearches");
  if (stored) {
    recent = JSON.parse(stored);
    renderRecent();
  }
  showWeather();
};
