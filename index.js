

//grab the tabs that is Your Weather and Search weather by using their attribute names
const userTab = document.querySelector("[data-userWeather]");

const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");

const apiErrorContainer = document.querySelector(".api-error-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//First our current tab is equal to usertab, i/e the user is in

//by default our app should open on Your Weather tab 
let oldTab = userTab;

//the API key
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

//Add properties related to current-tab to the current tab

//currentTab variables stores kaunse tab ko open rakhna hai.
//And us tab pe current-tab wali properties lagado CSS se by making a class called current-tab 
oldTab.classList.add("current-tab");

//this call is made if co-ordinates of location are already present
getfromSessionStorage();

//Whateber function we click, pass that tab into the switch Tab. Whatever tab is clicked so it's Ui will be shown
function switchTab(newTab){

    //What if we click on the tab we are at, means if we are at search tab and we click on search weather again so don't do anything
    if(newTab != oldTab){ 

        //remove the styling properties from the current tab
        oldTab.classList.remove("current-tab");
        
        //make the clicked tab as current tab
        oldTab = newTab;

        //add the style properties to the newly created tab
        oldTab.classList.add("current-tab");

        //If search form does not have active, so we need to active it because it is clicked


        //go to CSS and see the active class, we are just changing the opacity to make visible or invisible the Ui
        if(!searchForm.classList.contains("active")){
            //So let's go to search Ui, so remove grant acess screen, remove user weather, add search form Ui

            //hide two things and make one thing visible

            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");

        } else{
            //But if we are at search tab and now Your Weather tab has to become visisble
            searchForm.classList.remove("active");

            //User info should also hide
            userInfoContainer.classList.remove("active");


            //but if automatically the location's coordinates will be taken only if the coordinates are saved in session storage!!

             //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();

            //if coordinates are saved in local storage of my location so automatically the weather is shown.


        }


    }
}

// - - - - - - - - - - - -User Weather Handling- - - - - - - - - - - -
const grantAccessBtn = document.querySelector("[data-grantAccess]");
const messageText = document.querySelector("[data-messageText]");

const apiErrorImg = document.querySelector("[data-notFoundImg]");
const apiErrorMessage = document.querySelector("[data-apiErrorText]");
const apiErrorBtn = document.querySelector("[data-apiErrorBtn]");



userTab.addEventListener('click', () => {
    //Pass clicked tab as input parameter
    switchTab(userTab);
} );

searchTab.addEventListener('click', () => {
    //Pass clicked tab as input parameter
    switchTab(searchTab);
})

//check if co-ordinates are already in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates) {
        //if we don't get co-ordinates
        //means location access is not shown!
        //so show grant access window and its name is -> grantAccessContainer!!
        grantAccessContainer.classList.add("active");
    } else {

        //if local co-ordinates are present so use them and make API Call to show weather data
        const coordinates = JSON.parse(localCoordinates);

        //it fetches info according to data
        fetchUserWeatherInfo(coordinates);
    }

}





async function fetchUserWeatherInfo(coordinates){
    //find latitude and longitude
    const {lat, lon} = coordinates;
    //first remove grant access Ui
    grantAccessContainer.classList.remove("active");
    //make loader Ui visible
    loadingScreen.classList.add("active");

    //make the error Ui disable
    apiErrorContainer.classList.remove("active");

    //make the API call
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );

          const  data = await response.json();

        
          //data has come now remove the loader
          loadingScreen.classList.remove("active");
          //Now make the container visible
          userInfoContainer.classList.add("active");

          //to put value on the Ui we make a separate function
          renderWeatherInfo(data);

    }  catch (error) {
        // console.log("User - Api Fetch Error", error.message);
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorImg.style.display = "none";
        apiErrorMessage.innerText = `Error: ${error?.message}`;
        apiErrorBtn.addEventListener("click", fetchUserWeatherInfo);
      }
    }

function renderWeatherInfo(weatherInfo){
    //We need lots of info like temp, country code to show flag, humidity etc.
    //But first we need to grab elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    

    //to use a particular property in a JSON object we use -> optional chaining operator
    //if that property does not exist so this operator returns undefined value

    //Now we need to put values into these grabbed elements
    //fetch values from weatherInfo object

    //see the JSON object coming from APIcall in JSON formatter

    cityName.innerText = weatherInfo?.name; //grab city name and put into the cityName element

    //grab the country code from the JSON object.
    //to embed flags we use flagcdn
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    // weather is an array in the JSON object, grab description
    desc.innerText = weatherInfo?.weather?.[0]?.description;

    //grab the icon of weather
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    //grab the temperature that is inside main in the JSON object
    //degree celcius should be present in all cases
    
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}


function getLocation() {
    //if geolocation is supported means it's weather is available so find the location
    if(navigator.geolocation) {
        //callback funciton is showPosition(), now create it
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //show an alert for no gelolocation support available
    }
}

function showPosition(position) {
 
    //find the users latitude and longitude
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    //store user co-ordinates in the sessionStorage

    //convert it into JSON string and save.
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

    //also show it on the Ui with function called fetchUserWeather() 
    fetchUserWeatherInfo(userCoordinates);

}



//put listener on grant access button
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

//put event listener on Search form i.e. whenever we submit something should happen
//delete its default action
const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

     // if city is empty don't do anything 
    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

//Now lets make the function to call API according to Searched city name
async function fetchSearchWeatherInfo(city) {

    //first show the loader on screen
    loadingScreen.classList.add("active");

     // remove the old weather container 
    userInfoContainer.classList.remove("active");

    //also remove grant access container
    grantAccessContainer.classList.remove("active");
    apiErrorContainer.classList.remove("active");

     //now make the API call 
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        
        //when user types an invalid name in input an error response is saved in the variable called data

        //throw is used to throw custom error and it has the error codeas 404
        if (data.cod == "404") {
            throw data;
          }

          // --> When the throw statement is executed, it exits out of the block and goes to the catch block. And the code below the throw statement is not executed. <-----

        
        //now we get the response and find the data according to it
        //remove loader and put the weather container 
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        
        //when error occurs remove the loader and make the error Ui active
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");

        //the error message is city not found
        apiErrorMessage.innerText = `${error?.message}`;
        apiErrorBtn.style.display = "none"; 
      }
}







