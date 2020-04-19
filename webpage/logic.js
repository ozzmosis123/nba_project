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

//create markers for teams and add them into the map
function teamMarkers(team_data, team_players, teams_wins,teams_data){
  console.log(team_data)
  icon_url = './logos/'+team_data.team_abbr+'_logo.png';
  console.log(icon_url);

  //change the popup positions of 
  if(team_data.team === "Clippers" || team_data.team === "Nets"){
    var teamIcon = L.icon({
      iconUrl: icon_url,
      iconSize:     [50, 50], // size of the icon
      iconAnchor:   [0, -5], // point of the icon which will correspond to marker's location
      popupAnchor:  [25, 25] // point from which the popup should open relative to the iconAnchor
    });
  }else{
  var teamIcon = L.icon({
      iconUrl: icon_url,
      iconSize:     [50, 50] // size of the icon
    });
  }

  marker =L.marker([team_data.lat, team_data.lon], {icon: teamIcon})
    .bindPopup("<h3>" + team_data.place + " " + team_data.team + "</h3")
    .addTo(myFeatureGroup)
  //add the teams data into marker event layer
  marker.team_info = team_data;
  marker.players_info = team_players;
  marker.win_info = teams_wins;
  marker.all_teams = teams_data;
  return marker;
}

//call each chart functions
function createCharts(event){
  plotRadarCahrt(event);
  createPieCharts(event);
  createBarChart(event);
  createScatterChart(event);
}

function createPieCharts(event){
  console.log(event)
  players_data = event.layer.players_info
  //assign the players data to each variable that will be added into the pie chart
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
    textinfo: 'none',
    domain: {row: 0, column: 0},
    name: 'points',
    hoverinfo: 'label+percent+value',
    hole: .4,
    type: 'pie'
  },{
    values: assists,
    labels: players,
    textinfo: 'none',
    domain: {row: 0, column: 1},
    name: 'assists',
    hoverinfo: 'label+percent+value',
    hole: .4,
    type: 'pie'
  },{
    values: blocks,
    labels: players,
    textinfo: 'none',
    domain: {row: 1, column: 0},
    name: 'blocks',
    hoverinfo: 'label+percent+value',
    hole: .4,
    type: 'pie'
  },{
    values: rebounds,
    labels: players,
    textinfo: 'none',
    domain: {row: 1, column: 1},
    name: 'rebounds',
    hoverinfo: 'label+percent+value',
    hole: .4,
    type: 'pie'
  },{
    values: steals,
    labels: players,
    textinfo: 'none',
    domain: {row: 2, column: 0},
    name: 'steals',
    hoverinfo: 'label+percent+value',
    hole: .4,
    type: 'pie'
  },{
    values: turnovers,
    labels: players,
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

//create a radar chart
function plotRadarCahrt(event){
  var team_data = event.layer.team_info;
  console.log(team_data)
  team_status = []
  Object.entries(team_data).forEach(([key, value]) => {
    if(key === "rk_AST" || key === "rk_BLK" || key === "rk_PTS" || key === "rk_STL" || key === "rk_TOV" || key === "rk_TRB"){
      team_status.push(Math.round((30-value)/29*100));
    }
  });
  //convert the ranking data from (1 - 30) to (0 - 100)
  team_status.push(Math.round((30-team_data.rk_AST)/29*100));

  data = [{
    type: 'scatterpolar',
    r: team_status,
    theta: ['Assist','BLock','Point', 'Steal', 'Turnover', 'Rebound', 'Assist'],
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
      }
    },
    legend:{
      font: {
        size: 15
      }
    },
    showlegend: true
  }
  
  Plotly.newPlot("plotRadar", data, layout)
}

//create the standings bar chart
function createBarChart(event){
  var teams_wins = event.layer.win_info;
  var current_team = event.layer.team_info.team
  var team_win = teams_wins.filter(d => d.team === current_team)
  console.log("t_w: ", team_win)
  var conference = team_win[0].conf
  console.log(conference)
  var sub_color = '';
  
  //check if the conference of selected team is east or west
  // and change the color of sub bars by conference value (east/west) 
  if(conference === 'east'){
    sub_color = '#1E90FF';
  }else{
    sub_color = '#FF6347';
  }
  
  function getData(data, Series) {
    var wins_info = []
    var i = 0;
    var ranking = 0;
    var y_value = 0;
    
    if(Series === "main"){
      data.forEach(function (d){
        var new_color = '#FFD700'
        // increase the ranking variable by checking if a team is in the same conference as the selected team 
        if(d.conf === conference){
          ranking += 1;
        }
        if(d.team === current_team){
          // to check if the seleted team is a playoff team
          if(ranking > 8){
            new_color = '#FF0000' //red color: not playoff team
          }else{
            new_color = '#008000' //green color: playoff team
          }
        }
         
        var win_data = {
          name: d.team,
          y: +d.win_p,
          color: new_color,
          index: i,
          x: 30 - i
        }
        wins_info.push(win_data);
        i += 1;
      })
      console.log(wins_info)
    }
    else{
      data.forEach(function (d){
        if(d.conf === conference){
          y_value = +d.win_p;
        }else{
          y_value = 0;
        }
        
        var win_data = {
          name: d.team,
          y: y_value,
          index: i,
          x: 30 - i
        }
        wins_info.push(win_data);
        i += 1;
      })
      console.log(wins_info)

    }
    return wins_info;
  }
  
  var chart = Highcharts.chart('barchart', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'NBA Standings'
    },
    
    plotOptions: {
      series: {
        grouping: false,
        borderWidth: 0
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      shared: true,
      headerFormat: '<span style="font-size: 15px">{point.point.name}</span><br/>',
      pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}<br/> win percentage: <b>{point.y}</b><br/>'
      },
    xAxis: {
      type: 'category',
      max: 29,
      labels: {
        useHTML: true,
        animate: true,
        formatter: function () {
          var value = this.value,
            output;
  
          teams_wins.forEach(function (d){
            if(d.team === value){
              //create the file name of logo image for the team
              output = d.abbr + '_logo.png'
            }
          })
          
          return '<span><img src="./logos/'+ output + '" style="width: 40px; height: 40px;"/><br></span>';
        }
      }
    },
    yAxis: [{
      title: {
        text: 'Win percentage'
      },
      showFirstLabel: false
    }],
    series: [
        {
      color: sub_color,
      pointPlacement: -0.2,
      linkedTo: 'main',
      data: getData(teams_wins, "sub").slice(),
      name: 'conference'
    }, 
    {
      name: 'Leage',
      id: 'main',
      dataSorting: {
        enabled: true,
        matchByName: true
      },
      
      data: getData(teams_wins, "main").slice()
    }],
    exporting: {
      allowHTML: true
    }
  });
}

function createScatterChart(event){
  var all_teams = event.layer.all_teams;
  console.log("all_teams",all_teams);
  // Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width - width / 3.9;

// Margin spacing for graph
var margin = 40;

// space for placing words
var labelArea = 150;

// padding for the text at the bottom and left axes
var tPadBot = 60;
var tPadLeft = 60;

// Create the actual canvas for the graph
var scatter = d3.select("#scatter")
scatter.html("")
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart");

var circRadius;
function crGet() {
  if (width <= 530) {
    circRadius = 9;
  }
  else {
    circRadius = 13;
  }
}
crGet();

// We create a group element to nest our bottom axes labels.
svg.append("g").attr("class", "xText");
// xText will allows us to select the group without excess code.
var xText = d3.select(".xText");

// We give xText a transform property that places it at the bottom of the chart.
// By nesting this attribute in a function, we can easily change the location of the label group
// whenever the width of the window changes.
function xTextRefresh() {
    xText.attr(
        "transform",
        "translate(" +
        ((width - labelArea) / 2 + labelArea) +
        ", " +
        (height - margin - tPadBot) +
        ")"
    );
}
xTextRefresh();

///////////
// X Axis
///////////

// FG%
xText
    .append("text")
    .attr("y", -26)
    .attr("data-name", "losses")
    .attr("data-axis", "x")
    .attr("class", "aText active x")
    .text("Losses");

//  FT%
xText
    .append("text")
    .attr("y", 0)
    .attr("data-name", "Three_P")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("3 Pointers Made")

// 3 Pt%
xText
    .append("text")
    .attr("y", 26)
    .attr("data-name", "PF")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Personal Fouls")

// Losses
xText
  .append("text")
  .attr("y", 52)
  .attr("data-name", "AST")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Assists")


///////////
// Y Axis
///////////

var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

svg.append("g").attr("class", "yText");

var yText = d3.select(".yText");

function yTextRefresh() {
    yText.attr(
        "transform",
        "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
    );
}
yTextRefresh();


// FGA
yText
    .append("text")
    .attr("y", -26)
    .attr("data-name", "wins")
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .text("Wins");


// Free Throw Attempts
yText
    .append("text")
    .attr("x", 0)
    .attr("data-name", "TOV")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Turnovers");


// 3 Points Attempted
yText
    .append("text")
    .attr("y", 26)
    .attr("data-name", "BLK")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Blocks");

// Wins
yText
    .append("text")
    .attr("y", 50)
    .attr("data-name", "FTP")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Free Throw (%)");

//call the visualize function and pass the all_teams data
visualize(all_teams)

// This is the start of the main function that visualizes everything
function visualize(theData) {
  var curX = "losses";
  var curY = "wins";

  var xMin;
  var xMax;
  var yMin;
  var yMax;

  
  // This function allows us to set up tooltip rules (see d3-tip.js).
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
  // x key
  var theX;
  // Grab the team name.
  var theTeam = "<div>" + d.team + "</div>";
  // Snatch the y value's key and value.
  var theY = "<div>" + curY + ": " + d[curY] + "</div>";
  // If the x key is field goal percentage
  if (curX === "losses") {
    // Grab the x key and a version of the value formatted to show percentage
    theX = "<div>" + curX + ": " + d[curX] + "</div>";
  }
  else {
  // Otherwise
  // Grab the x key and a version of the value formatted to include commas after every third digit.
  theX = "<div>" +
    curX +
    ": " +
    parseFloat(d[curX]).toLocaleString("en") +
    "</div>";
}
  // Display what we capture.
  return theTeam + theX + theY;
});

  // Call the toolTip function.
  svg.call(toolTip);

  
  function xMinMax() {
    // min will grab the smallest datum from the selected column.
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });
    // .max will grab the largest datum from the selected column.
    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }
  
  // b. change the min and max for y
  function yMinMax() {
    // min will grab the smallest datum from the selected column.
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });
    // .max will grab the largest datum from the selected column.
    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }

   // c. change the classes (and appearance) of label text when clicked.
   function labelChange(axis, clickedText) {
    // Switch the currently active to inactive.
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);
    // Switch the text just clicked to active.
    clickedText.classed("inactive", false).classed("active", true);
  }
  xMinMax();
  yMinMax();

  var xScale = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([margin + labelArea, width - margin]);
    
    var yScale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([height - margin - labelArea, margin]);
    
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    function tickCount() {
      if (width <= 500) {
          xAxis.ticks(5);
          yAxis.ticks(5);
      } else {
          xAxis.ticks(10);
          yAxis.ticks(10);
      }
  }
  tickCount();

  svg
      .append("g")
      .call(xAxis)
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
      .append("g")
      .call(yAxis)
      .attr("class", "yAxis")
      .attr("transform", "translate(" + (margin + labelArea) + ", 0)");
  
  // Now let's make a grouping for our dots and their labels.
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

    
    // Append the circles for each row of data
    theCircles
      .append("circle")
      .attr("cx", function(d) {
        // console.log(d[curX])
        // console.log(xScale(d[curX]))
        console.log("cx",d);
        return xScale(d[curX])
        
      })
      .attr("cy", function(d) {
        return yScale(d[curY])
      })
      .attr("r", circRadius)
      .attr("class", function(d) {
        return "winCircle" 
      })

       // Hover rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", "#FF0000");
    })
    .on("mouseout", function(d) {
      // Remove the tooltip
      toolTip.hide(d);
      // Remove highlight
      // d3.select(this).style("stroke", "#e3e3e3");
      d3.select(this).style("stroke", "#000000");
    });

    
    
    // Grab the WINS from our data and place them in the center of our dots.
    theCircles
      .append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
      .text(function(d) {
        console.log(d.team_abbr)
        return d.team_abbr;
    })
    // Now place the text using our scale.
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.
      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "winText")
    // Hover Rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d);
      // Highlight the state circle's border
      d3.select("." + d.team_abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.team_abbr).style("stroke", "#e3e3e3");
    });

    
    
    d3.selectAll(".aText").on("click", function () {
      // Make sure we save a selection of the clicked text,
      // so we can reference it without typing out the invoker each time.
      var self = d3.select(this);
      // We only want to run this on inactive labels.
      // It's a waste of the processor to execute the function
      // if the data is already displayed on the graph.
      if (self.classed("inactive")) {
          // Grab the name and axis saved in label.
          var axis = self.attr("data-axis");
          var name = self.attr("data-name");
          // When x is the saved axis, execute this:
          if (axis === "x") {
              // Make curX the same as the data name.
              curX = name;
              // Change the min and max of the x-axis
              xMinMax();
              // Update the domain of x.
              xScale.domain([xMin, xMax]);
              // Now use a transition when we update the xAxis.
              svg.select(".xAxis").transition().duration(300).call(xAxis);
              // With the axis changed, let's update the location of the state circles.
              // d3.selectAll("circle").each(function (d) {
              d3.selectAll(".winCircle").each(function (d) {
                  // Each state circle gets a transition for it's new attribute.
                  // This will lend the circle a motion tween
                  // from it's original spot to the new location.
                  // d3.select(this).transition().duration(300).attr("cx", d => xScale(d[curX]));
                  console.log("circle d: ", d)
                  d3.select(this).transition().duration(300).attr("cx", function(d){ 
                    console.log(this)
                    console.log(d);
                    return xScale(d[curX])});
                    
              });
              // We need change the location of the state texts, too.
              d3.selectAll(".winText").each(function () {
                  // We give each state text the same motion tween as the matching circle.
                  d3.select(this).transition().duration(300).attr("dx", d => xScale(d[curX]));
                    
                  
              });
              // Finally, change the classes of the last active label and the clicked label.
              labelChange(axis, self);
          } else {
              // When y is the saved axis, execute this:
              // Make curY the same as the data name.
              curY = name;
              // Change the min and max of the y-axis.
              yMinMax();
              // Update the domain of y.
              yScale.domain([yMin, yMax]);
              // Update Y Axis
              svg.select(".yAxis").transition().duration(300).call(yAxis);
              // With the axis changed, let's update the location of the state circles.
              d3.selectAll(".winCircle").each(function () {
                  // Each state circle gets a transition for it's new attribute.
                  // This will lend the circle a motion tween
                  // from it's original spot to the new location.
                  d3
                    .select(this).transition().duration(300).attr("cy", d => yScale(d[curY]));
                    
              });
              // We need change the location of the state texts, too.
              d3.selectAll(".winText").each(function () {
                  // We give each state text the same motion tween as the matching circle.
                  d3
                    .select(this).transition().duration(300).attr("dy", d => yScale(d[curY]) + circRadius / 2.5);
                    
              });
              // Finally, change the classes of the last active label and the clicked label.
              labelChange(axis, self);
          }
      }
  });

}


}

var myFeatureGroup = L.featureGroup().addTo(myMap).on("click", createCharts);
// Loop through the cities array and create one marker for each city, bind a popup containing its name and population add it to the map

teams_data_url = "http://127.0.0.1:5000/json/teams"
players_data_url = "http://127.0.0.1:5000/json/players"

d3.json(teams_data_url).then(function(teams_data) {
  d3.json(players_data_url).then(function(players_data){
    console.log(teams_data);
    console.log(players_data);
    teams_wins = [];
    var t = 0;
    teams_data.forEach(function (d){
      var wins = +d.wins
      var losses = +d.losses
      var winning_p = wins /(wins + losses)
      //check if the team is a eatern/western conference team
      //the first 15 teams are eastern conference teams
      //the rest of them are western conference teams
      if(t < 15){
        var conference = "east";
      }else{
        var conference = "west";
      }
      console.log(winning_p)
      var wins_info = {
        team: d.team,
        abbr: d.team_abbr,
        wins: d.wins,
        losses: d.losses,
        win_p: winning_p.toFixed(3),
        conf: conference
      };
      teams_wins.push(wins_info);
      t += 1;
    })
    //sort the teams win info by descending of wins
    teams_wins = teams_wins.slice().sort((a, b) => d3.descending(a.win_p, b.win_p))
    console.log(teams_wins)

    //filter players data for the selected team
    for(var i=0; i<teams_data.length; i++){
      console.log(teams_data[i])
      team_players = players_data.filter(function(d){
        return d.team === teams_data[i].team;
      })

      teamMarkers(teams_data[i], team_players, teams_wins, teams_data)
      
    }

  });

});
