const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
    .options({
        a: {
            alias: 'address',
            describe: 'Address for fetching Weather data',
            string: true
        }
    })
    .help()
    .alias('h','help')
    .argv;

var address = 'Mumbai India';
var addressType = 'Default Address';
if(argv.address != '' && argv.address != null) {
    address = argv.address;
    addressType = 'Address';
}

var addressEncoded = encodeURIComponent(address);
var url = `https://maps.googleapis.com/maps/api/geocode/json?address=${addressEncoded}`;

axios.get(url).then((response) => {
    if(response.data.status === 'ZERO_RESULTS') {
        throw new Error('Unable to find the address. Make another Try!');
    }

    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var apiKey = '870beae739c903b3f70daf614f5f4f68';
    var weatherURL = `https://api.darksky.net/forecast/${apiKey}/${lat},${lng}?units=si`;

    var address = response.data.results[0].formatted_address;

    console.log(`${addressType} : ${address}`);

    return axios.get(weatherURL);
}).then((response) => {
    var cTemperature = response.data.currently.temperature;
    var cActualTemperature = response.data.currently.apparentTemperature;

    var weekSummary = response.data.daily.summary;
    var daySummary = response.data.daily.data[0].summary;
    var minTemperature = response.data.daily.data[0].temperatureMin;
    var maxTemperature = response.data.daily.data[0].temperatureMax;
    var humidity = response.data.daily.data[0].humidity *100;
    var windSpeed = response.data.daily.data[0].windSpeed;
    var pressure = response.data.daily.data[0].pressure;

    console.log(`Day's Weather Summary : ${daySummary}`);
    console.log(`Week's Weather Summary : ${weekSummary}`);
    console.log(`Current Tempereture : ${cTemperature} \u00B0C`);
    console.log(`Minimum Temperature : ${minTemperature} \u00B0C`);
    console.log(`Maximum Temperature : ${maxTemperature} \u00B0C`);
    console.log(`Currently Feels Like : ${cActualTemperature} \u00B0C`);
    console.log(`Humidity : ${humidity} %`);
    console.log(`Wind Speed : ${windSpeed} m/s`);
    console.log(`Pressure : ${pressure} hPa`);

}).catch((e) => {
    if(e.code === 'ENOTFOUND') {
        console.log('Unable to connect to servers');
    } else {
        console.log(e.message);
    }
});