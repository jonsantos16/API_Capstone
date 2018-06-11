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
        $('.instructions').remove();
        const queryTarget = $(event.target).find('.js-query');
        if (queryTarget.val() === '') {
            alert('Please enter a location')
        }
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
        if (data.results.length === 0) {
            showErr();
        }
    }).fail(showErr());
}

const getHikeData = (data) => {
    $.getJSON(Hike_URL, hikeQuery, (data) => {
        pushHikeData(data.trails);
        data.trails.forEach(trail => {
            weatherQuery.lat = trail.latitude;
            weatherQuery.lon = trail.longitude;
            getWeatherData();
        });
        if (data.trails.length === 0) {
            showErr();
        }
    })
}

const getWeatherData = () => {
    $.getJSON(Weather_URL, weatherQuery, (data) => {
        pushWeatherData(data.data)
    })
}

const pushHikeData = trail => {
    for (i = 0; i < trail.length; i++) {
        info.push({
            name: `${trail[i].name}`,
            location: `${trail[i].location}`,
            length: `${trail[i].length} mi`,
            img: `${trail[i].imgSmallMed}`,
            difficulty: `${trail[i].difficulty}`,
            url: `${trail[i].url}`,
        });
        if (info[i].img === '') {
            info[i].img = 'pictures/no-pic-available.png';
        }
        
    }
    convertDifficulties();
}

const convertDifficulties = () => {
    for (i = 0; i < hikeQuery.maxResults; i++) {
        if (info[i].difficulty === 'green') {
            info[i].difficulty = 'Easy';
        } else if (info[i].difficulty === 'greenBlue') {
            info[i].difficulty = 'Easy-Moderate';
        } else if (info[i].difficulty === 'blue') {
            info[i].difficulty = 'Moderate';
        } else if (info[i].difficulty === 'blueBlack') {
            info[i].difficulty = 'Moderate-Difficult';
        } else if (info[i].difficulty === 'black') {
            info[i].difficulty = 'Difficult';
        }
    }
}

const pushWeatherData = item => {
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
    if (today.length === hikeQuery.maxResults) {
        getItemsHtml();
    }
}

const getItemsHtml = () => {
    let trailDiv = '';
    for (i = 0; i < hikeQuery.maxResults; i++) {
            trailDiv += `
            <div class="row">
                <div class="hike-result box col-3">
                    <h2><a href="${info[i].url}" target="blank">${info[i].name}</a></h2>    
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
    displayData(trailDiv)
}

const displayData = (trailDiv) => {
    $('.results')
        .prop('hidden', false)
        .html(trailDiv);
    info = [];
    today = [];
    tmrw = [];
}

const showErr = () => {
    const errMsg = 
        `<p>Sorry, we couldn't find a hike near that location. Please try another.</p>`;
    $('.results')
        .prop('hidden', false)
        .html(errMsg);
}

$(search);