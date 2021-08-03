// Variables and DOM Elements
var lat;
var lon;
var currentDataList= document.getElementById("currentDataList");
var weatherULEl= document.querySelectorAll("ul");
var searchCityEl= document.getElementById("citySearch");
var searchCity= searchCityEl.innerText;
var searchBtn= document.getElementById('searchBtn');
var saveBtnEl= document.getElementById('saveBtnEl');
var savedBtn= document.querySelectorAll("saved")

//Use Geolocation for Weather before First Search\\
function currentLocal(){
    if (searchCity==""){
        navigator.geolocation.getCurrentPosition(success);
        function success(pos){
        lat= pos.coords.latitude;
        lon= pos.coords.longitude;
        lat= lat.toString();
        lon= lon.toString();
        searchCity= "Current Location";
        console.log(searchCity);
        getWeather(lat,lon,searchCity);
        }
    };
};

//OpenWeather API Info\\
const owKey = 'c217ece50a8addb1ac8b2f4eb17981a4';
// Openweather OneCall APi\\
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
    fetch("https://api.openweathermap.org/geo/1.0/direct?q="+searchCity+"&limit=3&appid="+owKey)
    .then(
        function(response){
            if(response.status !== 200){
                console.log("error with request:"+response.status);
                return;
            }
        
        response.json().then(function(data){
            console.log(data);
            if(data.length !== 0){
                lat= data[0].lat;
                lon= data[0].lon;
                lat= lat.toString();
                lon= lon.toString();
                getWeather(lat,lon,searchCity);
                savedSearches(searchCity);
            }
            else{
                alert("City Not Found");
            };
        });
        }
    )
    
};

function getWeather(){
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely,hourly,alerts,current&units=imperial&appid='+owKey)
    .then(function(response){
            if(response.status !== 200){
                console.log("error with request:"+response.status);
                return;
            }
            response.json()
            .then(function(data){
                console.log(data);
                for(i=0; i< weatherULEl.length; i++){
                    var tempDay=data.daily[i].temp.day;
                    var windSpeed=data.daily[i].wind_speed;
                    var humid= data.daily[i].humidity;
                    var uvIndex= data.daily[i].uvi;
                    var iconID= data.daily[i].weather[0].icon;
                    // format date based on provided time
                    var utcDate= data.daily[i].dt;
                    var date= new Date(utcDate*1000);
                    var day= date.getDate();
                    var month= date.getMonth() + 1;
                    var year= date.getFullYear();
                    var dateFormatted= month.toString()+'/'+day.toString()+'/'+year.toString();
                                
                    // writes the current weather to the UL for current weather
                    if (i === 0){
                        currentDataList.innerText= searchCity +"  ("+dateFormatted+")";
                        weatherULEl[i].innerHTML= "<li><img src='https://openweathermap.org/img/wn/"+iconID.toString()+".png'></li><li>Temp: "+tempDay.toString()+"</li> <li>Wind: "+windSpeed.toString()+" MPH</li> <li>Humidity: "+humid.toString()+"%</li> <li id='uvI'>UV Index: "+uvIndex.toString()+"</li>";
                        var uvIEl= document.getElementById('uvI');
                        console.log(uvIEl);
                        if(uvIndex <= 2){
                            uvIEl.classList.add("low");
                        }
                        else if (uvIndex > 7){
                            uvIEl.classList.add("high");
                        }
                        else{
                            uvIEl.classList.add("medium");
                        }
                    }
                    else{
                        weatherULEl[i].innerHTML= "<li><label>Date:</label>"+dateFormatted+"</li> <li><img src='https://openweathermap.org/img/wn/"+iconID.toString()+".png'></li> <li>Temp: "+tempDay.toString()+"</li> <li>Wind: "+windSpeed.toString()+" MPH</li> <li>Humidity: "+humid.toString()+"%</li>"
                    }
                };
            })
            
        }
    )
}

function savedSearches(){
    if(localStorage.savedCity == undefined){
        var savedCity=[searchCity];       
        localStorage.savedCity= JSON.stringify(savedCity);
    };
    var newSearch=[searchCity];
    var currentList = localStorage.savedCity
    var savedCity= JSON.parse(currentList);
    if(!savedCity.includes(searchCity)){
        savedCity= savedCity.concat(newSearch);
        localStorage.savedCity= JSON.stringify(savedCity);
    };
    makeSavedBtns();
};    
  
function makeSavedBtns(){
    if(localStorage.savedCity != undefined){
        var currentList = localStorage.savedCity
        var savedCity= JSON.parse(currentList);
        console.log(savedCity)
        for(i=0; i<savedCity.length; i++){
            if(i === 0){
                var savedBtnCity="<button class='btn my-2 btn-secondary w-100 saved'>"+savedCity[0]+"</button>";
            }
            else{
                savedBtnCity= savedBtnCity+"<button class='btn my-2 btn-secondary w-100 saved'>"+savedCity[i]+"</button>";
            };
        };
        console.log(savedBtnCity);
        saveBtnEl.innerHTML= savedBtnCity;
        savedBtn= document.getElementsByClassName("saved");
        findBtns();
    };
};

currentLocal();
makeSavedBtns();
var savedBtn= document.getElementsByClassName("saved");
findBtns();

searchBtn.addEventListener("click",function(){
    console.log("clicked");
    searchCity= searchCityEl.value;
    if(searchCity==""){
        currentLocal();
    }
    else{
        getLatLon(searchCity);
    };
});

function findBtns(){
    Array.from(savedBtn).forEach(function(index){
        index.addEventListener("click",function(){
            console.log(this.innerHTML);
            searchCity=this.innerText;
            getLatLon(searchCity);
        });
    });
};
