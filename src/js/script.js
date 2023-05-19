// ai tips
const aiTipElem = document.querySelector(".ai__tip");

function generateTips() {
  // Define an array of tips
  const tipsArr = [
    'Say "John show weather in Kabul"',
    'Say "John show home"',
    'Say "John open facebook.com"',
  ];

  let index = 0;

  aiTipElem.innerHTML = tipsArr[index];

  aiTipElem.classList.add("fadeIn");

  setTimeout(() => {
    aiTipElem.classList.remove("fadeIn");
  }, 2000);

  setInterval(() => {
    // If we have reached the end of the tips array, reset the index to 0
    if (index >= tipsArr.length - 1) {
      index = -1;
    }
    index++;

    // Update the DOM element's innerHTML with the next tip in the array
    aiTipElem.innerHTML = tipsArr[index];

    aiTipElem.classList.add("fadeIn");

    setTimeout(() => {
      aiTipElem.classList.remove("fadeIn");
    }, 2000);
  }, 2500);
}

generateTips();

/**
 * Create Clock
 */
const clockElem = document.querySelector(".time__section .clock");
const clockIdleElem = document.querySelector(".idle__section .clock");

function generateClock() {
  const today = new Date();

  let hr = today.getHours();
  let min = today.getMinutes();
  let sec = today.getSeconds();

  clockElem.innerHTML = `
  <div class="hour">${formatTime(hr)}:</div>
  <div class="minutes">${addZero(min)}:</div>
  <div class="seconds">${addZero(sec)}</div>`;

  clockIdleElem.innerHTML = `
  <div class="hour">${formatTime(hr)}:</div>
  <div class="minutes">${addZero(min)}</div>`;
}

setInterval(generateClock, 1000);

// format time
function formatTime(num) {
  if (num > 12) {
    num = num - 12;
  }

  return addZero(num);
}

// add zero to the one digit number
function addZero(num) {
  if (num < 10) {
    num = "0" + num;
  }

  return num;
}

/**
 * Annyang AI
 */

const allSections = document.querySelectorAll("section");
const speechPopup = document.querySelector(".speech__popup");

function removeActiveSections() {}
allSections.forEach((section) => {
  section.classList.remove("active");
  allSections[0].classList.add("active");
});

function activeSection(id) {
  if (id == null || id == "") return;
  allSections[id].classList.add("active");
}

function removeActiveSection(id) {
  if (id == null || id == "") return;
  allSections[id].classList.remove("active");
}

// setting up annyang

// phrases array for home
const homeArr = [
  "john show home",
  "john head back to home",
  "john go home",
  "john go to home",
  "john go back",
  "john go back to home",
];

// phrases array for time
const timeArr = [
  "john what time is it",
  "john what time is it now",
  "john what time is it right now",
  "john show time",
  "john show current time",
  "john what is current time",
  "john what is the time",
  "john what is the time now",
  "john what is the time right now",
];

// pharases array for weather
const weatherArr = [
  "john how is the weather",
  "john how's the weather now",
  "john how is the weather now",
  "john how's the weather right now",
  "john how is the weather right now",
  "john show weather",
  "john show current weather",
];

if (annyang) {
  // Define your wildcard command
  var commands = {
    "john open *website": function (website) {
      window.open("https://" + website, "_blank");
    },
    "*phrase": function (phrase) {
      phrase = phrase.toLowerCase();
      // phrase = phrase.toLowerCase();
      if (phrase == "hello" || phrase == "hello john") {
        console.log("hello from annyang");
      } else if (phrase == "bye") {
        console.log("bye from annyang");

        // home
      } else if (homeArr.includes(phrase)) {
        removeActiveSection(1);
        removeActiveSection(2);
        removeActiveSections();

        // time
      } else if (timeArr.includes(phrase)) {
        activeSection(1);
        removeActiveSection(2);
        removeActiveSections();

        // weather
      } else if (phrase.includes("weather")) {
        const countryName = extractCountryName(phrase);
        if (countryName != null) {
          removeActiveSection(1);
          activeSection(2);
          removeActiveSections();
          getWeatherData(countryName);
        }
      }
      speechPopup.classList.add("active");
      speechPopup.innerHTML = phrase;
    },
  };

  // Add your commands to annyang
  annyang.addCommands(commands);

  // Start listening
  annyang.start();
}

/**
 * Fetch weather
 */

const weatherContainer = document.querySelector(".weather__container");

function getWeatherData(country) {
  const WEATHER_API_KEY = "6cbb713e07f1c0b625e373dc0d3889ca";
  let API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${WEATHER_API_KEY}&units=metric`;

  weatherContainer.innerHTML =
    "<p class='weather__msg'>Getting weather. Please wait</p>";
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod == "404") {
        weatherContainer.innerHTML =
          "<p class='weather__msg'>Country/City not found!</p>";
      } else {
        let weatherDetails = `
        <div class="weather__type">${data.weather[0].description}</div>

          <div class="weather__details">
            <div class="row">
              <div class="country__name">${data.name}</div>
              <div class="country__flag">
                <img src="${getCountryFlag(data.sys.country)}"/>
              </div>
            </div>

            <div class="row">
              <div class="left">
                <div class="weather__degree">${Math.floor(
                  data.main.temp
                )}°C</div>
                <div class="city__name">Kabul</div>
              </div>
              <div class="right">
                <img src="${getIcon(data.weather[0].id)}" alt="weather icon" />
              </div>
            </div>
          </div>

          <div class="weather__more">
            <div class="box">
              <i class="fa-solid fa-temperature-three-quarters"></i>

              <div class="feel__degree">
                <p>${Math.floor(data.main.feels_like)}°C</p>
                <span>Feels Like</span>
              </div>
            </div>

            <div class="box">
              <i class="fa-solid fa-droplet"></i>
              <div class="hum__percent">
                <p>${Math.floor(data.main.humidity)}</p>
                <span>Humidity</span>
              </div>
            </div>
          </div>
        `;
        weatherContainer.innerHTML = weatherDetails;
      }
    });
}

// celsius to fahrenheit
function celsiusToFahrenheit(celsius) {
  let fahrenheit = Math.floor((celsius * 9) / 5 + 32);
  return fahrenheit;
}

// country name from the sentence
function extractCountryName(sentence) {
  const countryRegex = /(?:\bin|from|of|to|,)\s*([A-Za-z\s]+)/i;
  const matches = sentence.match(countryRegex);

  if (matches && matches.length > 1) {
    return matches[1].trim();
  }

  return null;
}

// get icon of the weather
const weatherSection = document.querySelector(".weather__section");
function getIcon(icon) {
  if (icon == 800) {
    icon = "src/images/weather/clear.svg";
    weatherSection.style.background =
      "linear-gradient(to top, rgba(0 0 0 / .8), rgba(0 0 0 / 0)),url('/src/images/weather/bg/clear.jpg')";
    weatherSection.style.backgroundRepeat = "no-repeat";
    weatherSection.style.backgroundSize = "cover";
    weatherSection.style.backgroundPosition = "center";
  } else if (icon >= 200 && icon <= 232) {
    icon = "src/images/weather/storm.svg";
    weatherSection.style.background =
      "linear-gradient(to top, rgba(0 0 0 / .8), rgba(0 0 0 / 0)),url('/src/images/weather/bg/storm.jpg')";
    weatherSection.style.backgroundRepeat = "no-repeat";
    weatherSection.style.backgroundSize = "cover";
    weatherSection.style.backgroundPosition = "center";
  } else if ((icon >= 300 && icon <= 321) || (icon >= 500 && icon <= 531)) {
    icon = "src/images/weather/rain.svg";
    weatherSection.style.background =
      "linear-gradient(to top, rgba(0 0 0 / .8), rgba(0 0 0 / 0)),url('/src/images/weather/bg/rain.jpg')";
    weatherSection.style.backgroundRepeat = "no-repeat";
    weatherSection.style.backgroundSize = "cover";
    weatherSection.style.backgroundPosition = "center";
  } else if (icon >= 600 && icon <= 622) {
    icon = "src/images/weather/snow.svg";
    weatherSection.style.background =
      "linear-gradient(to top, rgba(0 0 0 / .8), rgba(0 0 0 / 0)),url('/src/images/weather/bg/snow.jpg')";
    weatherSection.style.backgroundRepeat = "no-repeat";
    weatherSection.style.backgroundSize = "cover";
    weatherSection.style.backgroundPosition = "center";
  } else if (icon >= 701 && icon <= 781) {
    icon = "src/images/weather/haze.svg";
    weatherSection.style.background =
      "linear-gradient(to top, rgba(0 0 0 / .8), rgba(0 0 0 / 0)),url('/src/images/weather/bg/haze.jpg')";
    weatherSection.style.backgroundRepeat = "no-repeat";
    weatherSection.style.backgroundSize = "cover";
    weatherSection.style.backgroundPosition = "center";
  } else if (icon >= 801 && icon <= 804) {
    icon = "src/images/weather/cloud.svg";
    weatherSection.style.background =
      "linear-gradient(to top, rgba(0, 0, 0, .75), rgba(0, 0, 0, 0)),url('/src/images/weather/bg/cloud.jpg')";
    weatherSection.style.backgroundRepeat = "no-repeat";
    weatherSection.style.backgroundSize = "cover";
    weatherSection.style.backgroundPosition = "center";
  }
  return icon;
}

// get country flag
function getCountryFlag(country) {
  country = country.toLowerCase();
  country = `src/images/flags/${country}.png`;

  return country;
}
