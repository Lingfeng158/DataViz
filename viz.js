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
  centroid = await d3.json("us-state-centroids.json");
  cases = await d3.csv("covid_confirmed_usafacts_time_processed.csv");

  console.log(cases[0]);
  // draw the states
  //   svg.append("path")
  //     .attr("class", "states")
  //     .datum(topojson.feature(states, states.objects.usStates))
  //     .attr("d", path).style("fill", function(d) {return "rgb(120,120,180)";});

  svg
    .selectAll(".state")
    .data(topojson.feature(states, states.objects.usStates).features)
    .enter()
    .append("path")
    .attr("class", "states")
    .attr("d", path)
    .style("fill", function (d) {
      return "rgb(120,120,180)";
    });

  // draw the symbols on top
  svg
    .selectAll(".symbol")
    .data(
      centroid.features.sort(function (a, b) {
        return b.properties.population - a.properties.population;
      })
    )
    .enter()
    .append("path")
    .attr("class", "symbol")
    .attr("fill", "green")
    .attr(
      "d",
      path.pointRadius(function (d) {
        return 10;
      })
    )
    .on("mouseover", function (d, i) {
      d3.select(this)
        .attr("fill", "red")
        .append("svg:title")
        .text(
          function (d) {
            return (
              d3.select(this).data()[0].properties.name +
              "\nPopulation " +
              d3.select(this).data()[0].properties.population
            );
          }

          // .text((d) => d.properties.name + '\nPopulation : ${d.properties.population}'
        );
    })
    .on("mouseout", function (d, i) {
      d3.select(this).attr("fill", "green");
    });
}

$(function () {
  $("#date").slider({
    range: false,
    min: 0,
    max: 1000,
    values: 0,
    slide: function (event, ui) {
      console.log(ui);
      $("#datetime").val(ui.value);
      vol_range = ui.value;
      //filterData("vol", ui.values);
    },
  });
  $("#datetime").val($("#date").slider("value"));
});
