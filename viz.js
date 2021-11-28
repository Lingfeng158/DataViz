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

async function ready() {
  // load files async; store the values so we can use them later
  states = await d3.json("states.json");
  centroid = await d3.json("us-state-centroids.json");
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
  $("#vol").slider({
    range: false,
    min: 0,
    max: 1000,
    values: 0,
    slide: function (event, ui) {
      console.log(ui);
      $("#volamount").val(ui.value);
      vol_range = ui.value;
      //filterData("vol", ui.values);
    },
  });
  $("#volamount").val(
    $("#vol").slider("value") + " - " + $("#vol").slider("value")
  );
});

function recolor(color) {
  // grab the symbol objects and modify their color
  // notice we don't need "enter" or "append" the objects are already there
  svg.selectAll(".symbol").attr("fill", color);
}

function resetMap() {
  svg
    .selectAll(".symbol")
    .attr("fill", "green")
    .attr(
      "d",
      path.pointRadius(function (d) {
        return 10;
      })
    )
    .on("mouseover", function (d) {
      d3.select(this).attr("fill", "red");
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("fill", "green");
    });
}

function PopToColor() {
  resetMap();
  let population = svg
    .selectAll(".symbol")
    .data()
    .map(function (d) {
      return d.properties.population;
    });
  var populationScale = d3
    .scaleSqrt()
    .domain([d3.min(population), d3.max(population)])
    .range(["green", "blue"]);
  svg
    .selectAll(".symbol")
    .transition()
    .attr("fill", function (d) {
      return populationScale(d.properties.population);
    });
  //Not turning to green
  svg.selectAll(".symbol").on("mouseover", function (d) {
    return false;
  });
}

function PopToSize() {
  resetMap();
  let population = svg
    .selectAll(".symbol")
    .data()
    .map(function (d) {
      return d.properties.population;
    });
  var populationSizeScale = d3
    .scaleSqrt()
    .domain([d3.min(population), d3.max(population)])
    .range([6, 9]);
  svg
    .selectAll(".symbol")
    .transition()
    .attr(
      "d",
      path.pointRadius(function (d) {
        return populationSizeScale(d.properties.population);
      })
    );
  //Not turning to green
  svg.selectAll(".symbol").on("mouseover", function (d) {
    return false;
  });
}

function PopToCaSize() {
  resetMap();
  let population = svg
    .selectAll(".symbol")
    .data()
    .map(function (d) {
      return d.properties.population;
    });
  var populationScale = d3
    .scaleSqrt()
    .domain([d3.min(population), d3.max(population)])
    .range(["green", "blue"]);
  var populationSizeScale = d3
    .scaleSqrt()
    .domain([d3.min(population), d3.max(population)])
    .range([6, 9]);
  svg
    .selectAll(".symbol")
    .transition()
    .attr("fill", function (d) {
      return populationScale(d.properties.population);
    })

    .attr(
      "d",
      path.pointRadius(function (d) {
        return populationSizeScale(d.properties.population);
      })
    );
  //Not turning to green
  svg.selectAll(".symbol").on("mouseover", function (d) {
    return false;
  });
}
