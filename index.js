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
    maxResults: 50,
};

let forecast = {
    key: 'e3b4b76d027b48dfad9acd269e86e54b',
    lat: '',
    lon: ''
};

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
        console.log(data);
        data.results.forEach(item => {
            hikeQuery.lat = item.geometry.location.lat;
            hikeQuery.lon = item.geometry.location.lng;
            getHikeData(data);
        })
    });
}

const getHikeData = () => {
    $.getJSON(Hike_URL, hikeQuery, (data) => {
        console.log(data);
        displayHikeData(data);
    });
}

const getWeatherData = () => {

}

const displayHikeData = data => {
    console.log(data.trails);
    const results = formatData(data.trails);
    console.log(results);
    $('.results').html(results);
}

const formatData = trails => {
    trails.forEach((trail) => {
        console.log(trail);
        return `<div>
            <a href="${trail.url} target="blank">
                <img src="${trail.imgSmallMed}" alt="picture of ${trail.name}">
            </a>
            <a href="${trail.url} target="blank">
                <h2>${trail.name}</h2>
            </a>
            <h3>${trail.location}</h3>
            <h4>Length: ${trail.length} miles</h4>
        </div>`
    });
}

const initApp = () => {
    search();
}

$(initApp);