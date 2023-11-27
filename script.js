let currentDate = new Date();
let tom = toDate(currentDate);

async function checkWeather() {
  const query = document.querySelector("#query").value;
  const card = document.querySelector("#card");
  const forcastContainer = document.querySelector("#forcast-container");
  const nav = document.querySelector("#nav");
  const body = document.querySelector("body");
  nav.innerHTML = "";
  card.innerHTML = "";
  forcastContainer.innerHTML = "";

  if (query !== "") {
    const forcast = await fetch(`
      https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=391cf50843605f32395e81a39be36f08
      `);
    const forecastData = await forcast.json();

    const statusCode = parseInt(forecastData.cod, 10);

    if (statusCode < 300) {
      let data = {};
      for (let item of forecastData.list) {
        let sample = new Date(item.dt * 1000);

        const result = toDate(sample);
        if (result === tom) {
          data = item;
          break;
        }
      }

      const currentTime = new Date(data.dt * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      });
      const wTemp = (data.main.temp - 273.15).toFixed(2);
      const wCity = forecastData.city.name;
      const wDateUnformated = new Date(data.dt * 1000);
      const wDate = toDate(wDateUnformated);
      const wHum = data.main.humidity;
      const wVis = data.visibility;
      const wAir = data.main.pressure;
      const wWind = data.wind.speed;
      const wMain = data.weather[0].description;
      const wId = data.weather[0].id;

      const array = forecastData.list;

      if (wId < 600) {
        body.style.background = `url(./images/rainy.jpg)`;
      } else if (wId <= 700) {
        body.style.background = `url(./images/snow.jpg)`;
      } else if (wId < 800) {
        body.style.background = `url(./images/mist.jpg)`;
      } else {
        body.style.background = `url(./images/cloud.jpg)`;
      }

      nav.innerHTML += `
      <p>${currentTime}</p>
    `;
      array.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const dateFinal = toDate(date);
        const time = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
        });
        if (tom === dateFinal) {
          forcastContainer.innerHTML += `
        <div class="small-card">
          <p>${time}</p>
          <img src="https://openweathermap.org/img/wn/${
            item.weather[0].icon
          }@2x.png" alt="" />
            <p>${(item.main.temp - 273.15).toFixed(2)}&deg;C</p>
        </div>
        `;
        }
      });
      card.innerHTML = `
      <div class="card blur">
        <div id="city">${wCity}</div>
        <div id="date">${wDate}</div>
        <div id="temp">${wTemp}&deg;C
          <div>
      <img src="https://openweathermap.org/img/wn/${
        data.weather[0].icon
      }@2x.png">
          <span>${wMain}</span> 
      </div>
        </div>
        <div id="humidity">Humidity<span>${wHum}<span class="small"%</span></span></div>
        <div id="visibility">Visibility <span>${
          wVis / 1000
        }<span class="small">km</span></span></div>
        <div id="air-pressure">Air Pressure <span>${wAir}<span class="small">hPa</span></span></div>
        <div id="wind">Wind-speed <span>${wWind}<span class="small">m/s</span></span></div>
      </div>
    `;
    } else {
      card.innerHTML = `

        <div class="error">
          <h1>${statusCode}</h1>
          <p>${forecastData.message}</p>
        </div>

      `;
    }
  } else {
    card.innerHTML = `

        <div class="error">
          <p>*Please Enter Something.</p>
        </div>

      `;
  }
}

function today() {
  let currentDate = new Date();
  let result = toDate(currentDate);
  tom = result;
  checkWeather();
}

function tommorow() {
  let currentDate = new Date();
  let tommorowDate = new Date(currentDate);
  tommorowDate.setDate(currentDate.getDate() + 1);
  const resultTommorow = toDate(tommorowDate);
  tom = resultTommorow;
}

function checkTommorow() {
  tommorow();
  checkWeather();
}

function toDate(date) {
  let result = date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return result;
}
