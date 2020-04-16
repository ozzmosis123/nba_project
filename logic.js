// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Add a tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

function teamMarkers(team_data, team_players){
  console.log(team_data)
  icon_url = './logos/'+team_data.team_abbr+'_logo.png';
  console.log(icon_url);

  if(team_data.team === "Clippers" || team_data.team === "Nets"){
    var teamIcon = L.icon({
      iconUrl: icon_url,
      // shadowUrl: 'leaf-shadow.png',
  
      iconSize:     [50, 50], // size of the icon
      // shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [0, -5], // point of the icon which will correspond to marker's location
      // shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [25, 25] // point from which the popup should open relative to the iconAnchor
    });
  }else{
  var teamIcon = L.icon({
      iconUrl: icon_url,
      // shadowUrl: 'leaf-shadow.png',

      iconSize:     [50, 50] // size of the icon
      // shadowSize:   [50, 64], // size of the shadow
      // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      // shadowAnchor: [4, 62],  // the same for the shadow
      // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
  }

  marker =L.marker([team_data.lat, team_data.lon], {icon: teamIcon})
    // .on("click", createRadarChart(team_data.team, team_data))
    .bindPopup("<h3>" + team_data.place + " " + team_data.team + "</h3")
    // .on({click: createRadarChart(team_data.team, team_data)})
    // .addTo(myMap)
    .addTo(myFeatureGroup)
  marker.team_info = team_data;
  marker.players_info = team_players;
  return marker;
}

function createCharts(event){
  // createRadarChart(event);
  plotRadarCahrt(event);
  createPieCharts(event);

}

function createPieCharts(event){
  console.log(event)
  players_data = event.layer.players_info
  players = players_data.map(data => data.player)
  points = players_data.map(data => data.PTS)
  assists = players_data.map(data => data.AST)
  blocks = players_data.map(data => data.BLK)
  rebounds = players_data.map(data => data.BLK)
  steals = players_data.map(data => data.STL)
  turnovers = players_data.map(data => data.TOV)
  console.log(players)

  var data = [{
    values: points,
    labels: players,
    // textposition: 'inside',
    textinfo: 'none',
    domain: {row: 0, column: 0},
    name: 'points',
    hoverinfo: 'label+percent+value',
    hole: .4,
    type: 'pie'
  },{
    values: assists,
    labels: players,
    // textposition: 'inside',
    textinfo: 'none',
    domain: {row: 0, column: 1},
    name: 'assists',
    hoverinfo: 'label+percent+value',
    hole: .4,
    type: 'pie'
  },{
    values: blocks,
    labels: players,
    // textposition: 'inside',
    textinfo: 'none',
    domain: {row: 1, column: 0},
    name: 'blocks',
    hoverinfo: 'label+percent+value',
    hole: .4,
    type: 'pie'
  },{
    values: rebounds,
    labels: players,
    // textposition: 'inside',
    textinfo: 'none',
    domain: {row: 1, column: 1},
    name: 'rebounds',
    hoverinfo: 'label+percent+value',
    hole: .4,
    type: 'pie'
  },{
    values: steals,
    labels: players,
    // textposition: 'inside',
    textinfo: 'none',
    domain: {row: 2, column: 0},
    name: 'steals',
    hoverinfo: 'label+percent+value',
    hole: .4,
    type: 'pie'
  },{
    values: turnovers,
    labels: players,
    // textposition: 'inside',
    textinfo: 'none',
    domain: {row: 2, column: 1},
    name: 'turnovers',
    hoverinfo: 'label+percent+value',
    hole: .4,
    type: 'pie'
  }
  
  ];
  
  var layout = {
    title: 'Team status detail',
    titlefont: {size: 25},
    annotations: [
      {
        font: {
          size: 10
        },
        showarrow: false,
        text: 'Points',
        x: 0.20,
        y: 0.875
      },
      {
        font: {
          size: 10
        },
        showarrow: false,
        text: 'Assists',
        x: 0.815,
        y: 0.875
      },
      {
        font: {
          size: 10
        },
        showarrow: false,
        text: 'Blocks',
        x: 0.20,
        y: 0.5
      },
      {
        font: {
          size: 10
        },
        showarrow: false,
        text: 'Rebounds',
        x: 0.82,
        y: 0.5
      },
      {
        font: {
          size: 10
        },
        showarrow: false,
        text: 'Steals',
        x: 0.20,
        y: 0.13
      },
      {
        font: {
          size: 10
        },
        showarrow: false,
        text: 'Turnovers',
        x: 0.82,
        y: 0.13
      }
    ],
    height: 600,
    width: 600,
    showlegend: false,
    grid: {rows: 3, columns: 2}
  };
  
  Plotly.newPlot('piechart', data, layout);
}

function plotRadarCahrt(event){
  var team_data = event.layer.team_info;
  console.log(team_data)
  team_status = []
  Object.entries(team_data).forEach(([key, value]) => {
    if(key === "rk_AST" || key === "rk_BLK" || key === "rk_PTS" || key === "rk_STL" || key === "rk_TOV" || key === "rk_TRB"){
      team_status.push(Math.round((30-value)/29*100));
      // team_status.push(value)
    }
  });
  
  team_status.push(Math.round((30-team_data.rk_AST)/29*100));
  // team_status.push(team_data.rk_AST);

  data = [{
    type: 'scatterpolar',
    r: team_status,
    theta: ['Assist','Block','Point', 'Steal', 'Turnover', 'Rebound', 'Assist'],
    text: team_status,
    hoverinfo: 'text',
    fill: 'toself',
    name: team_data.place + " " + team_data.team
  }]
  
  layout = {
    title: "Team performance radar chart",
    titlefont: {size: 25},
    polar: {
      radialaxis: {
        visible: true,
        range: [0, 100]
        // range: [30, 1]
      }
    },
    legend:{
      font: {
        size: 15
      }
    },
    // showlegend: false
    showlegend: true
  }

  // data = [{
  //   type: 'scatterpolar',
  //   r: [39, 28, 8, 7, 28, 39],
  //   theta: ['A','B','C', 'D', 'E', 'A'],
  //   fill: 'toself'
  // }]
  
  // layout = {
  //   polar: {
  //     radialaxis: {
  //       visible: true,
  //       range: [0, 50]
  //     }
  //   },
  //   showlegend: false
  // }
  
  // Plotly.newPlot("myDiv", data, layout)
  
  Plotly.newPlot("plotRadar", data, layout)
}

// function createRadarChart(event){
//       console.log(event)
//       var team_data = event.layer.team_info;
//       console.log(team_data)
//   //////////////////////////////////////////////////////////////
// 			//////////////////////// Set-Up //////////////////////////////
// 			//////////////////////////////////////////////////////////////

// 			var margin = { top: 50, right: 80, bottom: 50, left: 80 };
// 			//////////////////////////////////////////////////////////////
// 			////////////////////////// Data //////////////////////////////
// 			//////////////////////////////////////////////////////////////
           
// 			team_name = team_data.place + " " + team_data.team;

// 			var data = [
		
//         { name: team_name,
// 					axes: [
// 						{axis: 'Points', value: (30 - team_data.rk_PTS)/29*100},
// 						{axis: 'Assits', value: (30- team_data.rk_AST)/29*100},
// 						{axis: 'Rebounds', value: (30 - team_data.rk_TRB)/29*100},
// 						{axis: 'Steals', value: (30 - team_data.rk_STL)/29*100},
// 						{axis: 'Turnovers', value: (30 - team_data.rk_TOV)/29*100},
// 						{axis: 'Blocks', value: (30 - team_data.rk_BLK)/29*100}
// 					],
//          color: '#2a2fd4'
// 				}
// 			];
      
//       console.log(data[0].color);

		
// 			var radarChartOptions = {
// 			  w: 290,
// 			  h: 350,
// 			  margin: margin,
// 			  maxValue: 100,
// 			  levels: 5,
// 			  roundStrokes: false,
// 			  color: d3.scaleOrdinal().range(["#AFC52F", "#ff6600", "#2a2fd4"]),
// 				format: '.0f',
// 				legend: { title: "Team Performance radar chart", translateX: 50, translateY: 10 },
// 				// unit: '$'
// 			};

// 			// Draw the chart, get a reference the created svg element :
//       let svg_radar2 = RadarChart(".radarChart", data, radarChartOptions);
    
// }

var myFeatureGroup = L.featureGroup().addTo(myMap).on("click", createCharts);
// Loop through the cities array and create one marker for each city, bind a popup containing its name and population add it to the map

teams_data_url = "http://127.0.0.1:5000/json/teams"
players_data_url = "http://127.0.0.1:5000/json/players"

d3.json(teams_data_url).then(function(teams_data) {
  d3.json(players_data_url).then(function(players_data){
    console.log(teams_data);
    console.log(players_data);
    for(var i=0; i<teams_data.length; i++){
      console.log(teams_data[i])
      team_players = players_data.filter(function(d){
        return d.team === teams_data[i].team;
      })

      teamMarkers(teams_data[i], team_players)
      // team_players = players_data.filter(function(d){
      //   return d.team === teams_data[i].team;
      // })
      // console.log(team_players)
    }
    // createRadarChart(teams_data)

  });

});
