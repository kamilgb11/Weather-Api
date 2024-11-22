const input = document.querySelector('input');
const button = document.querySelector('button');
const errorMessage = document.querySelector('p.error');
const dateInfo = document.querySelector('p.date');
const cityName = document.querySelector('h2.city_name');
const weatherImg = document.querySelector('img.weather_img');
const temp = document.querySelector('p.temp');
const description = document.querySelector('p.description');
const feelsLike = document.querySelector('span.feels_like');
const pressure = document.querySelector('span.pressure');
const humidity = document.querySelector('span.humidity');
const windSpeed = document.querySelector('span.wind_speed');
const clouds = document.querySelector('span.clouds');
const visibility = document.querySelector('span.visibility');
const pollutionImg = document.querySelector('img.pollution_img');
const pm25 = document.querySelector('p.pollution_value');

const apiInfo = {
    link: 'https://api.openweathermap.org/data/2.5/weather?q=',
    key: '&appid=7dc1e3959907f252891451585f715299',
    units: '&units=metric',
    lang: '&lang=pl'
}

function checkWeatherByGeolocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log(lat, lon);
        })
    }
}

checkWeatherByGeolocation();

function checkWeather() {
    const apiInfoCity = input.value;
    // const apiURL = apiInfo.link + apiInfoCity + apiInfo.key + apiInfo.units + apiInfo.lang;
    const apiURL = `${apiInfo.link}${apiInfoCity}${apiInfo.key}${apiInfo.units}${apiInfo.lang}`;

    axios.get(apiURL).then((response) => {
        console.log(response.data);
        cityName.textContent = `${response.data.name}, ${response.data.sys.country}`;
        weatherImg.src = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        temp.textContent = `${Math.round(response.data.main.temp)}℃`;
        description.textContent = `${response.data.weather[0].description}`;
        description.classList.add('description_color');
        feelsLike.textContent = `${Math.round(response.data.main.feels_like)}℃`;
        pressure.textContent = `${response.data.main.pressure}hPa`;
        humidity.textContent = `${response.data.main.humidity}%`;
        windSpeed.textContent = `${response.data.wind.speed}m/s`;
        clouds.textContent = `${response.data.clouds.all}%`;
        visibility.textContent = `${response.data.visibility / 1000}km`;
        errorMessage.textContent = '';

        //air pollution api
        const lat = `${response.data.coord.lat}`;
        const lon = `${response.data.coord.lon}`;
        
        const apiLinkPollution = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}`;

        axios.get(apiLinkPollution+apiInfo.key).then((response) => {
            console.log(response);

            pm25.textContent = `${response.data.list[0].components.pm2_5}`;
            const pm25Value = `${response.data.list[0].components.pm2_5}`;

            if (pm25Value >= 0 && pm25Value < 10) {
                pollutionImg.style.backgroundColor = 'green';
            } else if (pm25Value >= 10 && pm25Value < 25) {
                pollutionImg.style.backgroundColor = 'yellowgreen';
            } else if (pm25Value >= 25 && pm25Value < 50) {
                pollutionImg.style.backgroundColor = 'yellow';
            } else if (pm25Value >= 50 && pm25Value < 75) {
                pollutionImg.style.backgroundColor = 'orange';
            } else {
                pollutionImg.style.backgroundColor = 'red';
            }
        })

    }).catch((error) => {
        errorMessage.textContent = `${error.response.data.message}`;

        [cityName, temp, description, feelsLike, pressure, humidity, windSpeed, clouds, visibility, pm25].forEach((el) => {
            //parametr el reprezentuje każdy element tablicy
            el.textContent = '';
            pollutionImg.style.backgroundColor = 'transparent';
        })
        weatherImg.src = '';
        description.classList.remove('description_color');

    }).finally(() => {
        input.value = '';
    })
}

const checkWeatherByEnter = (e) => {
    if (e.key === "Enter") {
        checkWeather();
    }
}

input.addEventListener('keydown', checkWeatherByEnter)
button.addEventListener('click', checkWeather);