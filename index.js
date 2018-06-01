const Map_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const Hike_URL = 'https://www.hikingproject.com/data/get-trails';
const Weather_URL = 'https://api.weatherbit.io/v2.0/forecast/daily';

let geoCode = {
    address: '',
    key: 'AIzaSyB7-qMo_U4ijeTIbNWJ8TS_C2akTo_Vfcs',
};

let hikeQuery = {
    key: '200265082-fbc1bc2d3aae4542c7fdc5335e6d16b9',
    lat: '',
    lon: '',
    maxResults: 2,
};

let weatherQuery = {
    key: 'e3b4b76d027b48dfad9acd269e86e54b',
    lat: '',
    lon: ''
};

let info = [];
let today = [];
let tmrw = [];


const search = () => {
    $('.js-search-form').on('submit', event => {
        event.preventDefault();
        const queryTarget = $(event.target).find('.js-query')
        geoCode.address = queryTarget.val(); 
        queryTarget.val('');
        getGeoData();
    });
}

const getGeoData = () => {
    $.getJSON(Map_URL, geoCode, (data) => {
        hikeQuery.lat = data.results[0].geometry.location.lat;
        hikeQuery.lon = data.results[0].geometry.location.lng;
        getHikeData(data);
    });
}

const getHikeData = (data) => {
    $.getJSON(Hike_URL, hikeQuery, (data) => {
        // console.log(data.trails);
        pushHikeData(data.trails);
        data.trails.forEach(trail => {
            weatherQuery.lat = trail.latitude;
            weatherQuery.lon = trail.longitude;
            getWeatherData();
        })
    });
}

const getWeatherData = () => {
    $.getJSON(Weather_URL, weatherQuery, (data) => {
        // console.log(data.data);
        pushWeatherData(data.data)
    });
}

const showQueries = () => {
    // console.log(info);
    // console.log(weather_now);
    // console.log(weather_tmrw);
}

const pushHikeData = trail => {
    // console.log(trail);
    for (i = 0; i < trail.length; i++) {
        info.push({
            name: `${trail[i].name}`,
            location: `${trail[i].location}`,
            length: `${trail[i].length} mi`,
            img: `${trail[i].imgSmallMed}`,
            difficulty: `${trail[i].difficulty}`,
        });
    }
    // console.log(info);
}

const pushWeatherData = item => {
    // console.log(item);
    today.push({
        high: `${item[0].max_temp}`,
        low: `${item[0].min_temp}`,
        wind_speed: `${item[0].wind_spd} m/s`,
        prob_of_precip: `${item[0].pop}`,
        weather_icon: `${item[0].weather.icon}`,
        weather_code: `${item[0].weather.code}`,
        weather_description: `${item[0].weather.description}`
    });
    
    tmrw.push({
        high: `${item[1].max_temp}`,
        low: `${item[1].min_temp}`,
        wind_speed: `${item[1].wind_spd} m/s`,
        prob_of_precip: `${item[1].pop}`,
        weather_icon: `${item[1].weather.icon}`,
        weather_code: `${item[1].weather.code}`,
        weather_description: `${item[1].weather.description}`
    })
    
    getItemsHtml();
    // showQueries();
}

const getItemsHtml = () => {
    let trailDiv = '';
    for (i = 0; i < hikeQuery.maxResults; i++) {
        trailDiv += `
            <div class="row">
                <div class="hike-result box col-3">
                    <h2>${info[i].name}</h2>    
                    <img src="${info[i].img}" alt="picture of ${info[i].name}">
                    <h3>Length: ${info[i].length}</h3>
                    <h3>Difficulty: ${info[i].difficulty}</h3>
                    <h3>Location: ${info[i].location}</h3>
                </div>
                <div class="forecast today box col-3">
                    <h3>Today's weather at ${info[i].name}:</h3>
                    <img src="https://www.weatherbit.io/static/img/icons/${today[i].weather_icon}.png" alt="${today[i].weather_description}">
                    <h4>${today[i].weather_description}</h4>
                    <h4>High: ${today[i].high}C</h4>
                    <h4>Low: ${today[i].low}C</h4>
                    <h4>Chance of Rain: ${today[i].prob_of_precip}%</h4>
                    <h4>Wind Speed: ${today[i].wind_speed}</h4>
                </div>
                <div class="forecast tmrw box col-3">
                    <h3>Tomorrow's weather at ${info[i].name}:</h3>
                    <img src="https://www.weatherbit.io/static/img/icons/${tmrw[i].weather_icon}.png" alt="${tmrw[i].weather_description}">
                    <h4>${tmrw[i].weather_description}</h4>
                    <h4>High: ${tmrw[i].high}C</h4>
                    <h4>Low: ${tmrw[i].low}C</h4>
                    <h4>Chance of Rain: ${tmrw[i].prob_of_precip}%</h4>
                    <h4>Wind Speed: ${tmrw[i].wind_speed}</h4>   
                </div>
            </div>`;

    }
    console.log(trailDiv);
    displayData(trailDiv)
}

const displayData = (trailDiv) => {
    $('.results').html(trailDiv);
    info = [];
    today = [];
    tmrw = [];
}

const initApp = () => {
    search();
}

$(initApp);