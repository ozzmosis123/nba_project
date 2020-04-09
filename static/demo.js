// const url = "https://api.spacexdata.com/v2/launchpads";
// url = "json/teams"
url = "http://127.0.0.1:5000/json/teams"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// // Promise Pending
// const dataPromise = d3.json(url);
// console.log("Data Promise: ", dataPromise);
