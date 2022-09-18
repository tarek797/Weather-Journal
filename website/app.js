/* Global Variables */
const server = "http://127.0.0.1:4000";
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?zip='
// Personal API Key for OpenWeatherMap API
const Key = ',&appid=b58d479dab9b0b06996d5ea12636890a&units=imperial';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();

/*event listener on the generate button that takes the user input after it's clicked.*/
document.getElementById("generate").addEventListener("click", performAction)

function performAction() {
    const ZipCode = document.getElementById("zip").value;
    const feelings = document.getElementById("feelings").value;
    getWeather(ZipCode).then((data) => {
        const { main: { temp }, } = data;
        const info = {
            newDate,
            temp: Math.round(temp),
            feelings
        };
        postData(server + "/add", info).then(function () {
            updatingUI()
        })
    })
}

/*get method to get the data from the weather api 
depending on the the zip code taken from the user*/
const getWeather = async (zipCode) => {
    try {
        // Transform into JSON
        const res = await fetch(baseUrl + zipCode + Key)
        const data = await res.json()
        return data
    } catch (error) {
        console.log("error", error)
    }
}

/*Post data from the user to our local server*/
const postData = async (url = "", info = {}) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "content-Type": "application/json"
        },
        body: JSON.stringify(info),
    });
    try {
        const newData = await res.json();
        console.log('you saved', newData)
        return newData
    } catch (error) {
        console.log(error);
    }
};

/*updating the UI with the data processed in the local server*/
const updatingUI = async () => {
    const res = await fetch(server + "/all");
    try {
        const savedData = await res.json();

        document.getElementById("date").innerHTML = savedData.newDate;
        document.getElementById("temp").innerHTML = savedData.temp + '&degC';
        document.getElementById("content").innerHTML = savedData.feelings;
    } catch (error) {
        console.log(error);
    }
};