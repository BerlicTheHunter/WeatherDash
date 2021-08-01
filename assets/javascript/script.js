// ...............OpenWeather API Info...............\\
// API Key = c217ece50a8addb1ac8b2f4eb17981a4
const owKey = 'c217ece50a8addb1ac8b2f4eb17981a4';
var lat;
var lon;

// ...............Use Geolocation for Weather before First Search...............\\
navigator.geolocation.getCurrentPosition(success);
function success(pos){
    lat= pos.coords.latitude;
    lon= pos.coords.longitude;
    lat= lat.toString();
    lon= lon.toString();
    getWeather(lat,lon);
}


// Openweather OneCall APi
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// {lat}= latitude
// {lon}= longitude
// {part}= part to exclude mostly minuetly, hourly, and alerts

// OpenWeather Geoloction API
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// {city name}= city name from search input
// {state code}= not used  
// {country code}= not used
// {limit}= 3

function getLatLon(){
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=Columbus&limit=3&appid="+owKey)
    .then(
        function(response){
            if(response.status !== 200){
                console.log("error with request:"+response.status);
                return;
            }
        
        response.json().then(function(data){
            console.log(data);
            lat= data[0].lat;
            lon= data[0].lon;
            lat= lat.toString();
            lon= lon.toString();
            getWeather(lat,lon);
            });
        }
    )    
};

function getWeather(){
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely,hourly,alerts&appid='+owKey)
    .then(
        function(response){
            if(response.status !== 200){
                console.log("error with request:"+response.status);
                return;
            }
            response.json().then(function(data){
                console.log(data);
                weatherData = data;
            
            });
        }
    )
}

