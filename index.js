const Map_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const Hike_URL = 'https://www.hikingproject.com/data/get-trails';
const Weather_URL = 'https://api.weatherbit.io/v2.0/forecast/daily'

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
        // displayWeatherData(data);
    });
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
            weather_today: {},
            weather_tmrw: {},
        });
    }
    console.log(info);
}

const pushWeatherData = item => {
    console.log(item);
    info[weather_today].push('hello');
}

const displayHikeData = data => {
    // console.log('data dot trails is ', data.trails);
    const results = getItemsHtml(data.trails);
    $('.results').html(results);
}

const getItemsHtml = trails => (
    trails.map((trail) => (
        `<div>
            <a href="${trail.url} target="blank">
                <img src="${trail.imgSmallMed}" alt="picture of ${trail.name}">
            </a>
            <a href="${trail.url} target="blank">
                <h2>${trail.name}</h2>
            </a>
            <h3>${trail.location}</h3>
            <h4>Length: ${trail.length} miles</h4>
        </div>`
    ))
)



const displayWeatherData = data => {
    console.log ('weather data is ', data);
    // console.log ('weather data.data is ', data.data);
    let sixteenDay = getWeatherHtml(data);
    console.log(sixteenDay);
    // getWeatherHtml(data);
    $('.results').append(sixteenDay);
}

const getWeatherHtml = (data) => {
    let array = [];
    data.data.map(day => {
        array.push(    
            `<div>
            <h3>${day.max_temp}</h3>
            </div>`
        );    
    }) 
    return array;     
}

const initApp = () => {
    search();
}

$(initApp);