let title1 = "FULLY_VACCINATED_PERSONS",
  title2 = "FULLY_VACCINATED_PERCENT",
  title3 = "TOTAL_DOSES_ADMINISTERED"; //for 3 detailed data
let state_detail = "Arkansas";
let state_ABBR = "AR";
let partial_data = []; //for vaccine data
let precise_data = []; // for cases/death for state
let margin_detail = { top: 20, right: 20, bottom: 30, left: 30 },
  width_detail = 360 - margin_detail.left - margin_detail.right,
  height_detail = 300 - margin_detail.top - margin_detail.bottom;

let svg1, svg2, svg3;
let sensitive_word = "Fully Vaccinated"; // for detail pane 1
// keep these around for full data
let us,
  states,
  cases,
  vax_full,
  arr = [],
  arr_d = [];

function onFormChange() {
  title1 = $("#myformforpane1").val();
  title2 = $("#myformforpane2").val();
  title3 = $("#myformforpane3").val();
  sensitive_word = $("#mypane1").val();
  if (sensitive_word.includes("%")) {
    document.getElementById("v1title").innerHTML =
      "Percentage of " +
      sensitive_word.substring(0, sensitive_word.length - 3) +
      " Population";
  } else {
    document.getElementById("v1title").innerHTML =
      "Raw Number of " + sensitive_word + " Population";
  }

  document.getElementById("v3title").innerHTML =
    "Total Doses " + $("#mypane3").val();
  document.getElementById("title_detail").innerHTML =
    "Detailed Information For " + state_detail;
  redraw_detail();
}

let state_name = {
  HI: "Hawaii",
  AK: "Alaska",
  FL: "Florida",
  SC: "South Carolina",
  GA: "Georgia",
  AL: "Alabama",
  NC: "North Carolina",
  TN: "Tennessee",
  RI: "Rhode Island",
  CT: "Connecticut",
  MA: "Massachusetts",
  ME: "Maine",
  NH: "New Hampshire",
  VT: "Vermont",
  NY: "New York State",
  NJ: "New Jersey",
  PA: "Pennsylvania",
  DE: "Delaware",
  MD: "Maryland",
  WV: "West Virginia",
  KY: "Kentucky",
  OH: "Ohio",
  MI: "Michigan",
  WY: "Wyoming",
  MT: "Montana",
  ID: "Idaho",
  WA: "Washington",
  DC: "District of Columbia",
  TX: "Texas",
  CA: "California",
  AZ: "Arizona",
  NV: "Nevada",
  UT: "Utah",
  CO: "Colorado",
  NM: "New Mexico",
  OR: "Oregon",
  ND: "North Dakota",
  SD: "South Dakota",
  NE: "Nebraska",
  IA: "Iowa",
  MS: "Mississippi",
  IN: "Indiana",
  IL: "Illinois",
  MN: "Minnesota",
  WI: "Wisconsin",
  MO: "Missouri",
  AR: "Arkansas",
  OK: "Oklahoma",
  LA: "Louisiana",
  KS: "Kansas",
  LS: "Lesotho",
  VA: "Virginia",
};

let width = 960,
  height = 500;

let projection = d3
  .geoAlbersUsa()
  .translate([width / 2 - 100, height / 2]) // translate to center of screen
  .scale([1000]);
let path = d3.geoPath().projection(projection);

let svg = d3.select(".chart").attr("width", width).attr("height", height);

// call the function that draws
init();

async function init() {
  // load files async; store the values so we can use them later
  states = await d3.json("states.json");
  // centroid = await d3.json("us-state-centroids.json");
  cases = await d3.csv("covid_confirmed_usafacts_time_processed.csv");
  // cases_T = await d3.csv("covid_confirmed_usafacts_time_processed_T.csv");
  deaths = await d3.csv("covid_deaths_usafacts_processed.csv");
  // deaths_T = await d3.csv("covid_deaths_usafacts_processed_T.csv");
  vax_full = await d3.csv("./covid_vax.csv");

  for (i = 0; i < cases.length; i++) {
    for (var key in cases[i]) {
      if (cases[i].hasOwnProperty(key)) {
        if (key != "Date") {
          // console.log(key);
          arr.push(cases[i][key]);
        }
      }
    }
  }

  for (i = 0; i < deaths.length; i++) {
    for (var key in deaths[i]) {
      if (deaths[i].hasOwnProperty(key)) {
        if (key != "Date") {
          // console.log(key);
          arr_d.push(deaths[i][key]);
        }
      }
    }
  }

  min_c = d3.min(arr);
  max_c = d3.max(arr);

  min_d = d3.min(arr_d);
  max_d = d3.max(arr_d);

  var index = 0;
  values_c = cases[index];
  values_d = deaths[index];

  $("#date").slider({
    range: false,
    min: 0,
    max: cases.length - 1,
    step: 1,
    // values: 0,
    slide: function (event, ui) {
      // console.log(ui);
      var currentDate = new Date(cases[ui.value]["Date"]);
      var formatTime = d3.timeFormat("%b %d, %Y");
      var currentDate_1 = formatTime(new Date(cases[ui.value]["Date"]));
      index = ui.value;
      // console.log(currentDate);
      $("#now").text(currentDate.toDateString());
      $("#date_index").val(ui.value);
      $("#datetime").val(currentDate_1);
      // console.log(ui.value);
      values_c = cases[index];
      values_d = deaths[index];
      viewMap();
    },
  });

  redraw_detail();
  viewMap();
}

async function redraw_detail() {
  precise_data = [];
  partial_data = [];
  vax_full.forEach((element) => {
    if (element.GEOGRAPHY_NAME === state_detail)
      partial_data.push([
        element.DATE,
        element[title1],
        element[title2],
        element[title3],
      ]);
    //partial_data.push(element);
  });

  partial_data.sort((a, b) => {
    return Date.parse(a[0]) - Date.parse(b[0]);
  });
  d3.select("#c1Ele").remove();
  d3.select("#c2Ele").remove();
  d3.select("#c3Ele").remove();
  svg1 = d3
    .select("#chart1")
    .attr("width", width_detail + margin_detail.left + margin_detail.right)
    .attr("height", height_detail + margin_detail.top + margin_detail.bottom)
    .append("g")
    .attr("id", "c1Ele")
    .attr(
      "transform",
      "translate(" + margin_detail.left + "," + margin_detail.top + ")"
    );
  svg2 = d3
    .select("#chart2")
    .attr("width", width_detail + margin_detail.left + margin_detail.right)
    .attr("height", height_detail + margin_detail.top + margin_detail.bottom)
    .append("g")
    .attr("id", "c2Ele")
    .attr(
      "transform",
      "translate(" + margin_detail.left + "," + margin_detail.top + ")"
    );
  svg3 = d3
    .select("#chart3")
    .attr("width", width_detail + margin_detail.left + margin_detail.right)
    .attr("height", height_detail + margin_detail.top + margin_detail.bottom)
    .append("g")
    .attr("id", "c3Ele")
    .attr(
      "transform",
      "translate(" + margin_detail.left + "," + margin_detail.top + ")"
    );

  var x = d3.scaleTime().range([0, width_detail]);
  var y1 = d3.scaleLinear().range([height_detail, 0]);
  var y2 = d3.scaleLinear().range([height_detail, 0]);
  var y3 = d3.scaleLinear().range([height_detail, 0]);

  var parseTime = d3.timeParse("%m/%d/%Y");
  partial_data.forEach(function (d) {
    d.date = parseTime(d[0]);
    d.val1 = +d[1];
    d.val2 = +d[2];
    d.val3 = +d[3];
  });

  x.domain(
    d3.extent(partial_data, function (d) {
      return d.date;
    })
  );
  y1.domain([
    0,
    d3.max(partial_data, function (d) {
      return d.val1;
    }),
  ]);
  y2.domain([
    0,
    d3.max(partial_data, function (d) {
      return d.val2;
    }),
  ]);
  y3.domain([
    0,
    d3.max(partial_data, function (d) {
      return d.val3;
    }),
  ]);

  // define the line
  var valueline1 = d3
    .line()
    .x(function (d) {
      return x(d.date);
    })
    .y(function (d) {
      return y1(d.val1);
    });
  var valueline2 = d3
    .line()
    .x(function (d) {
      return x(d.date);
    })
    .y(function (d) {
      return y2(d.val2);
    });
  var valueline3 = d3
    .line()
    .x(function (d) {
      return x(d.date);
    })
    .y(function (d) {
      return y3(d.val3);
    });

  svg1
    .append("path")
    .data([partial_data])
    .attr("class", "line")
    .attr("fill", "none")
    .attr("d", valueline1);
  svg2
    .append("path")
    .data([partial_data])
    .attr("class", "line")
    .attr("fill", "none")
    .attr("d", valueline2);
  svg3
    .append("path")
    .data([partial_data])
    .attr("class", "line")
    .attr("fill", "none")
    .attr("d", valueline3);

  // Add the X Axis
  svg1
    .append("g")
    .attr("transform", "translate(0," + height_detail + ")")
    .call(
      d3.axisBottom(x).ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat("%b"))
    );
  svg2
    .append("g")
    .attr("transform", "translate(0," + height_detail + ")")
    .call(
      d3.axisBottom(x).ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat("%b"))
    );
  svg3
    .append("g")
    .attr("transform", "translate(0," + height_detail + ")")
    .call(
      d3.axisBottom(x).ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat("%b"))
    );

  if (sensitive_word.includes("%")) {
    svg1
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin_detail.left)
      .attr("x", 0 - height_detail / 2)
      .attr("dy", "0.75em")
      .attr("font-size", "12px")
      .style("text-anchor", "middle")
      .text("Percentage (%)");
    svg1.append("g").call(d3.axisLeft(y1).tickFormat((d) => parseInt(d * 100)));
  } else {
    svg1
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin_detail.left)
      .attr("x", 0 - height_detail / 2)
      .attr("dy", "0.75em")
      .attr("font-size", "12px")
      .style("text-anchor", "middle")
      .text("Count (100K)");
    svg1.append("g").call(d3.axisLeft(y1).tickFormat((d) => d / 100000));
  }

  svg3
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin_detail.left)
    .attr("x", 0 - height_detail / 2)
    .attr("dy", "0.75em")
    .attr("font-size", "12px")
    .style("text-anchor", "middle")
    .text("Count (100K)");
  // Add the Y Axis

  svg3.append("g").call(d3.axisLeft(y3).tickFormat((d) => d / 100000));
}

function viewMap() {
  type = $("#myselectform").val();
  // console.log(type);
  let svg_g = svg
    .selectAll(".state")
    .data(topojson.feature(states, states.objects.usStates).features);
  if (type == "Case") {
    var lowColor_c = "#f9f9f9";
    var highColor_c = "#bc2a66";
    var arrScale_C = d3
      .scaleSqrt()
      .domain([min_c, max_c])
      .range([lowColor_c, highColor_c]);
    svg_g

      .enter()

      .append("path")
      .attr("class", "states")
      .attr("id", function (d) {
        return d.properties.STATE_ABBR;
      })
      .style("fill", function (d) {
        return arrScale_C(values_c[d.properties.STATE_ABBR]);
      })
      .attr("d", path)
      .on("mouseover", function (d, i) {
        d3.select(this)
          .append("svg:title")
          .text(function (d) {
            return (
              d.properties.STATE_ABBR +
              "\nCases:" +
              values_c[d.properties.STATE_ABBR]
            );
          });
      })
      .on("mouseout", function (d, i) {
        d3.select(this);
      })
      .on("click", function (d, i) {
        state_detail = state_name[this.id];
        onFormChange();
      });
  } else if (type == "Death") {
    var lowColor_D = "#f9f9f9";
    var highColor_D = "#3a0ca3";
    var arrScale_D = d3
      .scaleSqrt()
      .domain([min_d, max_d])
      .range([lowColor_D, highColor_D]);
    svg
      .selectAll(".state")
      .data(topojson.feature(states, states.objects.usStates).features)
      .enter()

      .append("path")
      .attr("class", "states")
      .attr("id", function (d) {
        return d.properties.STATE_ABBR;
      })
      .style("fill", function (d) {
        return arrScale_D(values_d[d.properties.STATE_ABBR]);
      })
      .attr("d", path)
      .on("mouseover", function (d, i) {
        d3.select(this)
          .append("svg:title")
          .text(function (d) {
            return (
              d.properties.STATE_ABBR +
              "\nDeath: " +
              values_d[d.properties.STATE_ABBR]
            );
          });
      })
      .on("mouseout", function (d, i) {
        d3.select(this);
      })
      .on("click", function (d, i) {
        state_detail = state_name[this.id];
        onFormChange();
      });
  }
}
