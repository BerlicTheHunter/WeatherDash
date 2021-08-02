// ...............OpenWeather API Info...............\\
// API Key = c217ece50a8addb1ac8b2f4eb17981a4
const owKey = 'c217ece50a8addb1ac8b2f4eb17981a4';
var lat;
var lon;
var currentDataList= document.getElementById("currentDataList");
var weartherULEl= document.querySelectorAll("ul");
console.log(weartherULEl);
// ...............Use Geolocation for Weather before First Search...............\\
navigator.geolocation.getCurrentPosition(success);
function success(pos){
    lat= pos.coords.latitude;
    lon= pos.coords.longitude;
    lat= lat.toString();
    lon= lon.toString();
    getWeather(lat,lon);
}

// ...............Openweather OneCall APi...............\\
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// {lat}= latitude
// {lon}= longitude
// {part}= part to exclude mostly minuetly, hourly, and alerts

// ...............OpenWeather Geoloction API...............\\
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
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely,hourly,alerts&units=imperial&appid='+owKey)
    .then(function(response){
            if(response.status !== 200){
                console.log("error with request:"+response.status);
                return;
            }
            response.json()
            .then(function(data){
                console.log(data);
                // sets the current weater parameters
                var temp=data.current.temp;
                var windSpeed=data.current.wind_speed;
                var humid= data.current.humidity;
                var uvIndex= data.current.uvi;
                var iconID= data.current.weather[0].icon;
                // format date based on provided time
                var utcDate= data.current.dt;
                var date= new Date(utcDate*1000);
                var day= date.getDate();
                var month= date.getMonth() + 1;
                var year= date.getFullYear();
                var dateFormatted= month.toString()+'/'+day.toString()+'/'+year.toString();
                               
                // writes the current weather to the UL for current weather
                currentDataList.innerHTML= "<li>"+dateFormatted+"</li> <li><img src='http://openweathermap.org/img/wn/"+iconID.toString()+".png'></li> <li>Temp: "+temp.toString()+"</li> <li>Wind: "+windSpeed.toString()+" MPH</li> <li>Humidity: "+humid.toString()+"%</li> <li>UV Index: "+uvIndex.toString()+"</li>";
            });
            
        }
    )
    
    


}

