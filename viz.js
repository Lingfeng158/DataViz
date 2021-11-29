let width = 960,
  height = 500;

let projection = d3
  .geoAlbersUsa()
  .translate([width / 2 - 100, height / 2]) // translate to center of screen
  .scale([1000]);
let path = d3.geoPath().projection(projection);

let svg = d3.select(".chart").attr("width", width).attr("height", height);

// call the function that draws
ready();

// keep these around for later
let us, states, centroid;
let cases;

async function ready() {
  // load files async; store the values so we can use them later
  states = await d3.json("states.json");
  // centroid = await d3.json("us-state-centroids.json");
  cases = await d3.csv("covid_confirmed_usafacts_time_processed.csv");
  // cases_T = await d3.csv("covid_confirmed_usafacts_time_processed_T.csv");
  deaths = await d3.csv("covid_deaths_usafacts_processed.csv");
  // deaths_T = await d3.csv("covid_deaths_usafacts_processed_T.csv");

  state_name = 	["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
	"ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH",
	"MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT",
	"CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN",
	"WI", "MO", "AR", "OK", "KS", "LS", "VA"]

  console.log(cases[0]);

  // draw the states
  //   svg.append("path")
  //     .attr("class", "states")
  //     .datum(topojson.feature(states, states.objects.usStates))
  //     .attr("d", path).style("fill", function(d) {return "rgb(120,120,180)";});

// const parseDate = d3.timeParse("%m\/%d\/%Y");
// const formatDate = d3.timeFormat("%B %d, %Y");
// // const parseTime = d3.timeParse("%m %d, %Y");
// a = parseDate(cases[0]['Date']);
// console.log(cases[0]['Date']);
// console.log(a);
// console.log(formatDate(a));
// max_Date = parseDate(cases[cases.length-1]['Date']);
// min_Date = parseDate(cases[0]['Date']);
// for(i = 0; i< cases.length; i++){
//
// }

 var arr = [];
for(i = 0; i< cases.length; i++){
  for (var key in cases[i]) {
      if (cases[i].hasOwnProperty(key)) {
          if (key != "Date"){
              // console.log(key);
          arr.push(cases[i][key]);}
      }
}
}
// console.log(arr);
//
// console.log(values);
  min = d3.min(arr)
  max = d3.max(arr)
  console.log(d3.min(arr));
  console.log(d3.max(arr));

 var arr_d = [];
  for(i = 0; i< deaths.length; i++){
  for (var key in deaths[i]) {
      if (deaths[i].hasOwnProperty(key)) {
          if (key != "Date"){
              // console.log(key);
          arr_d.push(deaths[i][key]);}
      }
}
}
// console.log(arr);
//
// console.log(values);
  min_d = d3.min(arr_d)
  max_d = d3.max(arr_d)
  console.log(d3.min(arr_d));
  console.log(d3.max(arr_d));

// var time_scale = d3.scaleTime()
//     .domain([min_Date, max_Date])
//     .range([0, 100])
//     .clamp(true);

// $(function () {
//   $("#date").slider({
//     range: false,
//     min: min_Date.getTime(),
//     max: max_Date.getTime(),
//     step: 60 * 60 * 24 * 1000,
//     // values: 0,
//     slide: function (event, ui) {
//       console.log(ui);
//       var currentDate = new Date(ui.value);
//       console.log(currentDate);
//       $('#now').text(currentDate.toDateString());
//       $("#datetime").val(currentDate);
//       console.log(ui.value);
//       vol_range = ui.value;
//       //filterData("vol", ui.values);
//     },
//   });
//   // $("#datetime").val($("#date").slider("value"));
// });

var index = 0;
$(function () {
  $("#date").slider({
    range: false,
    min: 0,
    max: cases.length - 1,
    step: 1,
    // values: 0,
    slide: function (event, ui) {
      // console.log(ui);
      var currentDate = new Date(cases[ui.value]["Date"]);
      index = ui.value;
      // console.log(currentDate);
      $('#now').text(currentDate.toDateString());
      $("#date_index").val(ui.value);
      $("#datetime").val(currentDate);
      // console.log(ui.value);
      viewData(min, max, min_d, max_d, cases[index], deaths[index]);
    },
  });
  // $("#datetime").val($("#now").slider("value"));
});


// var arr = [];
// for (var key in cases[index]) {
//     if (cases[index].hasOwnProperty(key)) {
//
//         if (key != "Date"){
//             console.log(key);
//         arr.push(cases[index][key]);}
//     }
// }
// console.log(arr);
//
// console.log(index);
//   var lowColor = '#f9f9f9'
//   var highColor = '#bc2a66'
//
// var arrScale = d3.scaleSqrt()
// 					.domain([d3.min(arr), d3.max(arr)])
// 					.range([lowColor, highColor]);
//
//   console.log(d3.min(arr));
//   console.log(d3.max(arr));
//
//   svg.selectAll(".state")
//     .data(topojson.feature(states, states.objects.usStates).features)
//     .enter()
//     // .data2(topojson.feature(states, states.objects.usStates).features)
//     // .enter()
//     .append("path")
//     .attr("class", "states")
//     .attr("d", path).style("fill", function(d) {
// 	// Get data value
// 	var value = cases[index][d.properties.STATE_ABBR];
//     console.log(value);
//     // if(d.properties.STATE_ABBR == 'AL'){
//     //     return '#f9f9f9';
//     // }
// 	return arrScale(value);
//
// })
//   ;


  // let cases_date = cases[index].map(function (d) { return d });
// console.log(svg.selectAll(".state").data());
// var populationScale = d3.scaleSqrt()
// 					.domain([d3.min(population), d3.max(population)])
// 					.range(["green", "blue"]);
// svg.selectAll(".state").transition()
//         .attr("fill", function (d) { return populationScale(d.properties.population) });

//   svg.selectAll(".state").style("fill", function(d) {
//
// 	// Get data value
// 	var value = cases[index][d.id];
//     console.log(vale);
//
// 	return "rgb(213,222,217)";
// });


    // .style("fill", function (d) {
    //   return "rgb(120,120,180)";
    // });

  // draw the symbols on top
  // svg
  //   .selectAll(".symbol")
  //   .data(
  //     centroid.features.sort(function (a, b) {
  //       return b.properties.population - a.properties.population;
  //     })
  //   )
  //   .enter()
  //   .append("path")
  //   .attr("class", "symbol")
  //   .attr("fill", "green")
  //   .attr(
  //     "d",
  //     path.pointRadius(function (d) {
  //       return 10;
  //     })
  //   )
  //   .on("mouseover", function (d, i) {
  //     d3.select(this)
  //       .attr("fill", "red")
  //       .append("svg:title")
  //       .text(
  //         function (d) {
  //           return (
  //             d3.select(this).data()[0].properties.name +
  //             "\nPopulation " +
  //             d3.select(this).data()[0].properties.population
  //           );
  //         }
  //
  //         // .text((d) => d.properties.name + '\nPopulation : ${d.properties.population}'
  //       );
  //   })
  //   .on("mouseout", function (d, i) {
  //     d3.select(this).attr("fill", "green");
  //   });
viewData(min, max, min_d, max_d, cases[index], deaths[index]);
}

function viewData(min_c, max_c, min_d, max_d, values_c, values_d) {
type=$("#myselectform").val();
    // console.log(type);

  if (type == 'Case'){
      var lowColor_c = '#f9f9f9';
  var highColor_c = '#bc2a66';
  var arrScale_C = d3.scaleSqrt()
					.domain([min_c, max_c])
					.range([lowColor_c, highColor_c]);
  svg.selectAll(".state")
    .data(topojson.feature(states, states.objects.usStates).features)
    .enter()
    // .data2(topojson.feature(states, states.objects.usStates).features)
    // .enter()
    .append("path")
    .attr("class", "states")
    .attr("d", path).style("fill", function(d) {
	// Get data value
    //   console.log(d);
    //   console.log(values);
	// var value = values_c[d.properties.STATE_ABBR];
    // console.log(value);
    // if(d.properties.STATE_ABBR == 'AL'){
    //     return '#f9f9f9';
    // }
	return arrScale_C(values_c[d.properties.STATE_ABBR]);

});
  }
  else if (type == 'Death'){

      var lowColor_D = '#f9f9f9';
  var highColor_D = '#3a0ca3';
  var arrScale_D = d3.scaleSqrt()
					.domain([min_d, max_d])
					.range([lowColor_D, highColor_D]);
  svg.selectAll(".state")
    .data(topojson.feature(states, states.objects.usStates).features)
    .enter()
    // .data2(topojson.feature(states, states.objects.usStates).features)
    // .enter()
    .append("path")
    .attr("class", "states")
    .attr("d", path).style("fill", function(d) {
	// Get data value
    //   console.log(d);
    //   console.log(values);
	// var value = values_[d.properties.STATE_ABBR];
    // console.log(value);
    // if(d.properties.STATE_ABBR == 'AL'){
    //     return '#f9f9f9';
    // }
	return arrScale_D(values_d[d.properties.STATE_ABBR]);

});
  }

// var arrScale = d3.scaleSqrt()
// 					.domain([min, max])
// 					.range([lowColor, highColor]);

//   svg.selectAll(".state")
//     .data(topojson.feature(states, states.objects.usStates).features)
//     .enter()
//     // .data2(topojson.feature(states, states.objects.usStates).features)
//     // .enter()
//     .append("path")
//     .attr("class", "states")
//     .attr("d", path).style("fill", function(d) {
// 	// Get data value
//     //   console.log(d);
//     //   console.log(values);
// 	var value = values[d.properties.STATE_ABBR];
//     console.log(value);
//     // if(d.properties.STATE_ABBR == 'AL'){
//     //     return '#f9f9f9';
//     // }
// 	return arrScale(value);
//
// });
}