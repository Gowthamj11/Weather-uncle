let selectElement = document.querySelector(".country");
let loading = document.querySelector(".loading");
let resultContainer = document.querySelector(".result-container")
let footer = document.querySelector("footer")
let lastcard = 
loading.style.display = "none";

retrievingCities = () => {
    for (let key in cities) {
        let citiesData = cities[key];

        for (let i = 0; i < citiesData.length; i++) {
            let option = document.createElement('option');
            option.value = `${citiesData[i].name},${citiesData[i].longitude},${citiesData[i].latitude}`;
            option.text = `${citiesData[i].name}, ${key}`;
            selectElement.appendChild(option);
        }
    }
}


selectElement.addEventListener('change',()=> {
        loading.style.display = "block";
        
        let selectedValue = selectElement.value;
        if (selectedValue) {
            let [cityName, longitude, latitude] = selectedValue.split(",");
            citiesFetch(longitude, latitude);

        }
        
    });


// Function to fetch weather data from the 7timer API
citiesFetch = (longitude, latitude) => {
    fetch(`https://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=civillight&output=json`)
        .then(response => response.json())
        .then(data => {
            loading.style.display = "none";
            resultContainer.innerHTML = ""; // Clear previous forecast cards
            data.dataseries.forEach((dataseries, index) => {
                if (index < 7) { // Limit to 7 days
                    let forecastCard = document.createElement("div");
                    forecastCard.classList.add("days");

                    // Date
                    let dateValue = readableDate(dataseries.date);
                    let dateObject = new Date(dateValue);
                    let d = dateObject.toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });


                    let dateElem = document.createElement("p");
                    dateElem.classList.add("weather-date");
                    dateElem.textContent = d;
                    forecastCard.appendChild(dateElem);

                    let wDiv = document.createElement("div");
                    wDiv.classList.add("weather-icon-div")
                    let imgElem = document.createElement("img");
                    imgElem.classList.add("weaather-icon");
                    imgElem.src = getWeatherImage(dataseries.weather);
                    wDiv.appendChild(imgElem)
                    forecastCard.appendChild(wDiv);

                    // Weather (human-readable format)
                    let cardBody = document.createElement("div");
                    cardBody.classList.add("card-body")
                    let hr = document.createElement("hr");
                    hr.classList.add("hr")
                    cardBody.appendChild(hr);
                    let weatherElem = document.createElement("p");
                    weatherElem.classList.add("weather-description");
                    weatherElem.textContent = getHumanReadableWeather(dataseries.weather);
                    cardBody.appendChild(weatherElem)


                    // Max Temperature
                    let maxElem = document.createElement("p");
                    maxElem.classList.add("weather-temperature");
                    maxElem.classList.add("max");
                    maxElem.textContent = "High: " + dataseries.temp2m.max + "°C";
                    cardBody.appendChild(maxElem);

                    // Min Temperature
                    let minElem = document.createElement("p");
                    minElem.classList.add("weather-temperature");
                    minElem.classList.add("min");
                    minElem.textContent = "Low: " + dataseries.temp2m.min + "°C";
                    cardBody.appendChild(minElem);
                    forecastCard.appendChild(cardBody);
                    if(index === 6){
                        forecastCard.classList.add("lastcard");
                    }

                    // Append the forecast card to the parent container
                    resultContainer.appendChild(forecastCard);
                     
                }
            });


        })
        .catch(error => {
            console.error('Fetch error:', error);
            loading.style.display = "none";
        });
}

// Function to convert date number to readable date
readableDate=(dateNumber)=> {
    var d = dateNumber.toString();
    var year = d.substring(0, 4);
    var month = d.substring(4, 6);
    var day = d.substring(6, 8);
    return `${year}-${month}-${day}`;
}

// Function to get the appropriate weather image based on weather condition
getWeatherImage=(weather)=> {
    var weatherImages = {
        "humid": "images/humid.png",
        "windy": "images/windy.png",
        "clear": "images/clear.png",
        "cloudy": "images/cloudy.png",
        "fog": "images/fog.png",
        "ishower": "images/ishower.png",
        "lightrain": "images/lightrain.png",
        "lightsnow": "images/lightsnow.png",
        "mcloudy": "images/mcloudy.png",
        "oshower": "images/oshower.png",
        "pcloudy": "images/pcloudy.png",
        "rain": "images/rain.png",
        "rainsnow": "images/rainsnow.png",
        "snow": "images/snow.png",
        "ts": "images/tsrain.png",
        "tstorm": "images/tstorm.png"
    };
    return weatherImages[weather.toLowerCase()]  // Return the correct image according to weather
}

// Function to get human-readable weather description
getHumanReadableWeather=(weather)=> {
    var weatherDescriptions = {
        "humid": "Humid",
        "windy": "Windy",
        "clear": "Clear",
        "cloudy": "Cloudy",
        "fog": "Fog",
        "ishower": "Isolated Showers",
        "lightrain": "Light Rain",
        "lightsnow": "Light Snow",
        "mcloudy": "Mostly Cloudy",
        "oshower": "Occasional Showers",
        "pcloudy": "Partly Cloudy",
        "rain": "Rain",
        "rainsnow": "Rain and Snow",
        "snow": "Snow",
        "ts": "Thunderstorm Possible",
        "tstorm": "Thunderstorm"
    };
    return weatherDescriptions[weather.toLowerCase()] || "Unknown Weather"; // Return unknown description if weather condition not found
}

retrievingCities()