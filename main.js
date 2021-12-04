let title1 = "FULLY_VACCINATED_PERSONS",
  title2 = "Cases",
  title3 = "TOTAL_DOSES_ADMINISTERED"; //for 3 detailed data
let state_detail = "Arkansas";
let state_ABBR = "AR";
let partial_data = []; //for vaccine data
let precise_data = []; // for cases/death for state
let margin_detail = { top: 20, right: 20, bottom: 30, left: 30 },
  width_detail = 360 - margin_detail.left - margin_detail.right,
  height_detail = 300 - margin_detail.top - margin_detail.bottom;

let margin_ctrl = { top: 5, right: 15, bottom: 30, left: 15 },
  width_ctrl = 370 - margin_ctrl.left - margin_ctrl.right,
  height_ctrl = 60 - margin_ctrl.top - margin_ctrl.bottom;

let detail_time_start = null,
  detail_time_end = null;

let svg1, svg2, svg3, svgLegend;
let axisLeg;
let sensitive_word = "Fully Vaccinated"; // for detail pane 1
// keep these around for full data
let us,
  states,
  cases,
  deaths,
  vax_full,
  arr = [],
  arr_d = [],
  arr_dp = [],
  arrp = [];

let x_ctrl;

const tickWidth = 60;
let parseTime = d3.timeParse("%m/%d/%Y");
function onFormChange() {
  // Temporal plots initialization
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

  document.getElementById("v2title").innerHTML =
    state_detail + " Covid " + title2;
  document.getElementById("v3title").innerHTML =
    "Total Doses " + $("#mypane3").val();
  document.getElementById("title_detail").innerHTML =
    "Detailed Information For " + state_detail;
  redraw_detail();
}

 //State names
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

// State population
let state_population = {
  HI: 1415872,
  AK: 731545,
  FL: 21477737,
  SC: 5148714,
  GA: 10617423,
  AL: 4903185,
  NC: 10488084,
  TN: 6829174,
  RI: 1059361,
  CT: 3565287,
  MA: 6892503,
  ME: 1344212,
  NH: 1359711,
  VT: 623989,
  NY: 19453561,
  NJ: 8882190,
  PA: 12801989,
  DE: 973764,
  MD: 6045680,
  WV: 1792147,
  KY: 4467673,
  OH: 11689100,
  MI: 9986857,
  WY: 578759,
  MT: 1068778,
  ID: 1787065,
  WA: 7614893,
  DC: 705749,
  TX: 28995881,
  CA: 39512223,
  AZ: 7278717,
  NV: 3080156,
  UT: 3205958,
  CO: 5758736,
  NM: 2096829,
  OR: 4217737,
  ND: 762062,
  SD: 884659,
  NE: 1934408,
  IA: 3155070,
  MS: 2976149,
  IN: 6732219,
  IL: 12671821,
  MN: 5639632,
  WI: 5822434,
  MO: 6137428,
  AR: 3017804,
  OK: 3956971,
  LA: 4648794,
  KS: 2913314,
  LS: 2108328,
  VA: 8535519,
};

let width = 960,
  height = 500;

let projection = d3
  .geoAlbersUsa()
  .translate([width / 2 - 100, height / 2]) // translate to center of screen
  .scale([1000]);
let path = d3.geoPath().projection(projection);

let svg = d3.select(".chart").attr("width", width).attr("height", height);

// call the initialization function at first
init();

async function init() {
  // Initialization function: initial Spatial and Temporal visualization

  // load files async: state information, preprocessed cases, death and vaccination information; store the values so we can use them later
  states = await d3.json("states.json");
  cases = await d3.csv("covid_confirmed_usafacts_time_processed.csv");
  deaths = await d3.csv("covid_deaths_usafacts_processed.csv");
  vax_full = await d3.csv("./covid_vax.csv");

  //Get the min and max of cases/death for each states
  for (i = 0; i < cases.length; i++) {
    for (var key in cases[i]) {
      if (cases[i].hasOwnProperty(key)) {
        if (key != "Date") {
          // console.log(key);
          arr.push(parseInt(cases[i][key]));
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

  min_c = Math.min(...arr);
  max_c = Math.max(...arr);

  min_d = Math.min(...arr_d);
  max_d = Math.max(...arr_d);

  //Get the min and max of cases/death per 1,000 people for each states
  for (i = 0; i < cases.length; i++) {
    for (var key in cases[i]) {
      if (cases[i].hasOwnProperty(key)) {
        if (key != "Date") {
          // console.log(key);
          arrp.push((cases[i][key] / state_population[key]) * 1000);
        }
      }
    }
  }

  for (i = 0; i < deaths.length; i++) {
    for (var key in deaths[i]) {
      if (deaths[i].hasOwnProperty(key)) {
        if (key != "Date") {
          // console.log(key);
          arr_dp.push((deaths[i][key] / state_population[key]) * 1000);
        }
      }
    }
  }

  min_cp = d3.min(arrp);
  max_cp = d3.max(arrp);

  min_dp = d3.min(arr_dp);
  max_dp = d3.max(arr_dp);

  // Get the cases/death data for the current selected Date
  var index = 0;
  values_c = cases[index];
  values_d = deaths[index];


  // The sliders for selecting Date
  $("#date").slider({
    range: false,
    min: 0,
    max: cases.length - 1,
    step: 1,
    // values: 0,
    slide: function (event, ui) {
      // console.log(ui);
      // Get the current Date and Change the Date format
      var currentDate = new Date(cases[ui.value]["Date"]);
      var formatTime = d3.timeFormat("%b %d, %Y");
      var currentDate_1 = formatTime(new Date(cases[ui.value]["Date"]));
      index = ui.value;
      // console.log(currentDate);
      $("#now").text(currentDate.toDateString());
      $("#date_index").val(ui.value);
      $("#datetime").val(currentDate_1);
      // console.log(ui.value);
      // Get the cases/death data for the selected Date
      values_c = cases[index];
      values_d = deaths[index];
      // Show the Spatial vis
      viewMap();
    },
  });

  let date_range = [];
  vax_full.forEach((element) => {
    if (element.GEOGRAPHY_NAME === state_detail) {
      date_range.push([element.DATE]);
    }
  });
  date_range.forEach(function (d) {
    d.date = parseTime(d[0]);
  });

  x_ctrl = d3.scaleTime().range([0, width_ctrl]);
  x_ctrl.domain(
    d3.extent(date_range, function (d) {
      return d.date;
    })
  );

  var svg_ctrl = d3
    .select("#ctrlsvg")
    .attr("width", width_ctrl + margin_ctrl.left + margin_ctrl.right)
    .attr("height", height_ctrl + margin_ctrl.top + margin_ctrl.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + margin_ctrl.left + "," + margin_ctrl.top + ")"
    );

  svg_ctrl
    .append("g")
    .attr("class", "axis axis--grid")
    .attr("transform", "translate(0," + height_ctrl + ")")
    .call(
      d3
        .axisBottom(x_ctrl)
        .ticks(6)
        .tickSize(-height_ctrl)
        .tickFormat(function () {
          return null;
        })
    );

  svg_ctrl
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height_ctrl + ")")
    .call(
      d3.axisBottom(x_ctrl).ticks(6).tickFormat(d3.timeFormat("%b"))
      // .tickPadding(0)
    )
    .attr("text-anchor", null)
    .selectAll("text")
    .attr("x", 0);

  let brush = d3
    .brushX()
    .extent([
      [0, 0],
      [width_ctrl, height_ctrl],
    ])
    .on("end", brushended);
  // brush.extent([new Date(2021, 1, 10), new Date(2021, 11, 14) - 1]);

  svg_ctrl
    .append("g")
    .attr("class", "brush")
    .call(brush)
    .on("dblclick", dblclicked);

  function dblclicked() {
    const selection = d3.brushSelection(this) ? null : x_ctrl.range();
    d3.select(this).call(brush.move, selection);
  }

  function brushended({ selection }) {
    if (selection) {
      detail_time_start = x_ctrl.invert(selection[0]);
      detail_time_end = x_ctrl.invert(selection[1]);
      $("#mypane4").val(
        d3.timeFormat("%b %d")(detail_time_start) +
          " - " +
          d3.timeFormat("%b %d")(detail_time_end)
      );
    } else {
      detail_time_start = null;
      detail_time_end = null;
      $("#mypane4").val("Full Range");
    }
    redraw_detail();
  }

  redraw_detail();
  viewMap();
}

async function redraw_detail() {
  //date, cum_case, delta_case, cum_death, delta_death
  precise_data = [];
  let min_length = Math.min(cases.length, cases.length);

  //console.log(Math.max(0, -100));

  partial_data = [];
  if (detail_time_end && detail_time_start) {
    for (let i = 1; i < min_length; i++) {
      if (
        parseTime(cases[i]["Date"]) >= detail_time_start &&
        parseTime(cases[i]["Date"]) <= detail_time_end
      ) {
        precise_data.push([
          cases[i]["Date"],
          parseInt(cases[i][state_ABBR]),
          parseFloat(
            (cases[i][state_ABBR] / state_population[state_ABBR]) * 1000
          ),
          Math.max(0, cases[i][state_ABBR] - cases[i - 1][state_ABBR]),
          parseInt(deaths[i][state_ABBR]),
          parseFloat(
            (deaths[i][state_ABBR] / state_population[state_ABBR]) * 1000
          ),
          Math.max(0, deaths[i][state_ABBR] - deaths[i - 1][state_ABBR]),
        ]);
      }
    }

    vax_full.forEach((element) => {
      if (
        element.GEOGRAPHY_NAME === state_detail &&
        parseTime(element.DATE) >= detail_time_start &&
        parseTime(element.DATE) <= detail_time_end
      ) {
        partial_data.push([
          element.DATE,
          element[title1],
          element[title2],
          element[title3],
        ]);
      }

      //partial_data.push(element);
    });
  } else {
    for (let i = 1; i < min_length; i++) {
      precise_data.push([
        cases[i]["Date"],
        parseInt(cases[i][state_ABBR]),
        parseFloat(
          (cases[i][state_ABBR] / state_population[state_ABBR]) * 1000
        ),
        Math.max(0, cases[i][state_ABBR] - cases[i - 1][state_ABBR]),
        parseInt(deaths[i][state_ABBR]),
        parseFloat(
          (deaths[i][state_ABBR] / state_population[state_ABBR]) * 1000
        ),
        Math.max(0, deaths[i][state_ABBR] - deaths[i - 1][state_ABBR]),
      ]);
    }

    vax_full.forEach((element) => {
      if (element.GEOGRAPHY_NAME === state_detail) {
        partial_data.push([
          element.DATE,
          element[title1],
          element[title2],
          element[title3],
        ]);
      }

      //partial_data.push(element);
    });
  }

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
  var x2 = d3.scaleTime().range([0, width_detail]);
  var y2 = d3.scaleLinear().range([height_detail, 0]);
  var y3 = d3.scaleLinear().range([height_detail, 0]);

  partial_data.forEach(function (d) {
    d.date = parseTime(d[0]);
    d.val1 = +d[1];
    d.val2 = +d[2];
    d.val3 = +d[3];
  });

  precise_data.forEach((d) => {
    d.date = parseTime(d[0]);
    d.cases = +d[1];
    d.casesP = +d[2];
    d.case_delta = +d[3];
    d.deaths = +d[4];
    d.deathsP = +d[5];
    d.death_delta = +d[6];
    // console.log(d.date, d.cases);
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
  x2.domain(
    d3.extent(precise_data, function (d) {
      return d.date;
    })
  );
  y2.domain([
    0,
    d3.max(precise_data, function (d) {
      switch (title2) {
        case "Cases":
          return d.cases;
          break;
        case "Cases Per 1K":
          return d.casesP;
          break;
        case "Case Change":
          return d.case_delta;
          break;
        case "Deaths":
          return d.deaths;
          break;
        case "Deaths Per 1K":
          return d.deathsP;
          break;
        case "Death Change":
          return d.death_delta;
      }
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
      return x2(d.date);
    })
    .y(function (d) {
      switch (title2) {
        case "Cases":
          return y2(d.cases);
          break;
        case "Cases Per 1K":
          return y2(d.casesP);
          break;
        case "Case Change":
          return y2(d.case_delta);
          break;
        case "Deaths":
          return y2(d.deaths);
          break;
        case "Deaths Per 1K":
          return y2(d.deathsP);
          break;
        case "Death Change":
          return y2(d.death_delta);
      }
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
    .data([precise_data])
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
      d3
        .axisBottom(x)
        .ticks((1.2 * width_detail) / tickWidth)
        .tickFormat(d3.timeFormat("%b%y"))
    );
  svg2
    .append("g")
    .attr("transform", "translate(0," + height_detail + ")")
    .call(
      d3
        .axisBottom(x2)
        .ticks(width_detail / tickWidth)
        .tickFormat(d3.timeFormat("%b%y"))
    );
  svg3
    .append("g")
    .attr("transform", "translate(0," + height_detail + ")")
    .call(
      d3
        .axisBottom(x)
        .ticks((1.2 * width_detail) / tickWidth)
        .tickFormat(d3.timeFormat("%b%y"))
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
  if (title2 === "Cases") {
    svg2
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin_detail.left)
      .attr("x", 0 - height_detail / 2)
      .attr("dy", "0.75em")
      .attr("font-size", "12px")
      .style("text-anchor", "middle")
      .text("Count (10K)");
    svg2.append("g").call(d3.axisLeft(y2).tickFormat((d) => d / 10000));
  } else if (title2.includes("Per")) {
    svg2
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin_detail.left)
      .attr("x", 0 - height_detail / 2)
      .attr("dy", "0.75em")
      .attr("font-size", "12px")
      .style("text-anchor", "middle")
      .text("Count");
    svg2.append("g").call(d3.axisLeft(y2));
  } else {
    svg2
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin_detail.left)
      .attr("x", 0 - height_detail / 2)
      .attr("dy", "0.75em")
      .attr("font-size", "12px")
      .style("text-anchor", "middle")
      .text("Count (1K)");
    svg2.append("g").call(d3.axisLeft(y2).tickFormat((d) => d / 1000));
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
  // Visualize the Spatial information
  // the color legend code is largely borrowed from Andrew Reid's post at https://stackoverflow.com/questions/49739119/legend-with-smooth-gradient-and-corresponding-labels
  type = $("#myselectform").val();
  // console.log(type);

  // Michelle Chandra’s interactive US Map http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922
  let svg_g = svg
    .selectAll(".state")
    .data(topojson.feature(states, states.objects.usStates).features);

  if (type == "Case") {
    // If selected "Case"
    //low and high color
    var lowColor_c = "#f9f9f9";
    var highColor_c = "#bc2a66";
    var arr_Scale_C = d3
      .scaleLinear()
      .domain([min_c, max_c])
      .range([lowColor_c, highColor_c]);

    // Show the Spatial visualization
    svg_g
      .enter()
      .append("path")
      .attr("class", "states")
      .attr("id", function (d) {
        return d.properties.STATE_ABBR;
      })
      .style("fill", function (d) {
        return arr_Scale_C(values_c[d.properties.STATE_ABBR]);
      })
      .attr("d", path)
      .on("mouseover", function (d, i) {
        // show the information when clicking
        d3.select(this)
          .append("svg:title")
          .text(function (d) {
            return (
              d.properties.STATE_ABBR +
              "\nCases per 1K: " +
              (
                (values_c[d.properties.STATE_ABBR] /
                  state_population[d.properties.STATE_ABBR]) *
                1000
              ).toFixed(2) +
              "\nCases:" +
              values_c[d.properties.STATE_ABBR]
            );
          });
      })
      .on("mouseout", function (d, i) {
        d3.select(this);
      })
      .on("click", function (d, i) {
        // Change the Temporal plots when clicking
        state_detail = state_name[this.id];
        state_ABBR = this.id;
        onFormChange();
      });

    // Update the legend
    d3.select("#legend").select("svg").remove();
    svgLegend = d3.select("#legend").append("svg").attr("width", 400);

    // linearGradient to defs, each has a unique id
    defs = svgLegend.append("defs");
    linearGradient = defs
      .append("linearGradient")
      .attr("id", "linear-gradient");

    linearGradient
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    // Color stops
    linearGradient
      .selectAll("stop")
      .data([
        { offset: "0%", color: lowColor_c },
        { offset: "100%", color: highColor_c },
      ])
      .enter()
      .append("stop")
      .attr("offset", function (d) {
        return d.offset;
      })
      .attr("stop-color", function (d) {
        return d.color;
      });

    // Ticks
    xLeg = d3.scaleLinear().domain([min_c, max_c]).range([15, 288]);

    axisLeg = d3
      .axisBottom(xLeg)
      .tickValues(arr_Scale_C.domain())
      .tickFormat((d) => (d / 1000000).toFixed(1) + "M");

    // Draw the legend and title
    svgLegend
      .append("text")
      .attr("class", "legendTitle")
      .attr("x", 0)
      .attr("y", 20)
      .style("text-anchor", "left")
      .text("Cases");

    svgLegend
      .append("rect")
      .attr("x", 10)
      .attr("y", 30)
      .attr("width", 400)
      .attr("height", 15)
      .style("fill", "url(#linear-gradient)");

    svgLegend
      .attr("class", "axis")
      .append("g")
      .attr("transform", "translate(0, 45)")
      .call(axisLeg);
  } else if (type == "Cases per 1K") {
    // If selected "Cases per 1k"
    //low and high color
    var lowColor_c = "#f9f9f9";
    var highColor_c = "#bc2a66";
    var arr_Scale_C = d3
      .scaleLinear()
      .domain([min_cp, max_cp])
      .range([lowColor_c, highColor_c]);

    svg_g
      .enter()
      .append("path")
      .attr("class", "states")
      .attr("id", function (d) {
        return d.properties.STATE_ABBR;
      })
      .style("fill", function (d) {
        return arr_Scale_C(
          (values_c[d.properties.STATE_ABBR] /
            state_population[d.properties.STATE_ABBR]) *
            1000
        );
      })
      .attr("d", path)
      .on("mouseover", function (d, i) {
        // show the information when clicking
        d3.select(this)
          .append("svg:title")
          .text(function (d) {
            return (
              d.properties.STATE_ABBR +
              "\nCases per 1K: " +
              (
                (values_c[d.properties.STATE_ABBR] /
                  state_population[d.properties.STATE_ABBR]) *
                1000
              ).toFixed(2) +
              "\nCases:" +
              values_c[d.properties.STATE_ABBR]
            );
          });
      })
      .on("mouseout", function (d, i) {
        d3.select(this);
      })
      .on("click", function (d, i) {
        // Change the Temporal plots when clicking
        state_detail = state_name[this.id];
        state_ABBR = this.id;
        onFormChange();
      });

    // Update the legend
    svgLegend.select("defs").remove();
    svgLegend.select("text").remove();
    svgLegend.select("rect").remove();
    svgLegend.select("g").remove();

    // linearGradient to defs, each has a unique id
    defs = svgLegend.append("defs");
    linearGradient = defs
      .append("linearGradient")
      .attr("id", "linear-gradient");

    linearGradient
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    // Color stops
    linearGradient
      .selectAll("stop")
      .data([
        { offset: "0%", color: lowColor_c },
        { offset: "100%", color: highColor_c },
      ])
      .enter()
      .append("stop")
      .attr("offset", function (d) {
        return d.offset;
      })
      .attr("stop-color", function (d) {
        return d.color;
      });

    // Ticks
    xLeg = d3.scaleLinear().domain([min_cp, max_cp]).range([10, 290]);

    axisLeg = d3.axisBottom(xLeg).tickValues(arr_Scale_C.domain());

    // Draw the legend and title
    svgLegend
      .append("text")
      .attr("class", "legendTitle")
      .attr("x", 0)
      .attr("y", 20)
      .style("text-anchor", "left")
      .text("Cases");

    svgLegend
      .append("rect")
      .attr("x", 10)
      .attr("y", 30)
      .attr("width", 400)
      .attr("height", 15)
      .style("fill", "url(#linear-gradient)");

    svgLegend
      .attr("class", "axis")
      .append("g")
      .attr("transform", "translate(0, 45)")
      .call(axisLeg);
  } else if (type == "Death") {
    // If selected "Death"
    //low and high color
    var lowColor_D = "#f9f9f9";
    var highColor_D = "#3a0ca3";
    var arr_Scale_D = d3
      .scaleLinear()
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
        return arr_Scale_D(values_d[d.properties.STATE_ABBR]);
      })
      .attr("d", path)
      .on("mouseover", function (d, i) {
        // show the information when clicking
        d3.select(this)
          .append("svg:title")
          .text(function (d) {
            return (
              d.properties.STATE_ABBR +
              "\nDeath per 1K: " +
              (
                (values_d[d.properties.STATE_ABBR] /
                  state_population[d.properties.STATE_ABBR]) *
                1000
              ).toFixed(2) +
              "\nDeath: " +
              values_d[d.properties.STATE_ABBR]
            );
          });
      })
      .on("mouseout", function (d, i) {
        d3.select(this);
      })
      .on("click", function (d, i) {
        // Change the Temporal plots when clicking
        state_detail = state_name[this.id];
        onFormChange();
      });

    // Update the legend
    svgLegend.select("defs").remove();
    svgLegend.select("text").remove();
    svgLegend.select("rect").remove();
    svgLegend.select("g").remove();

    // linearGradient to defs, each has a unique id
    defs = svgLegend.append("defs");
    linearGradient = defs
      .append("linearGradient")
      .attr("id", "linear-gradient");

    linearGradient
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    // Color stops
    linearGradient
      .selectAll("stop")
      .data([
        { offset: "0%", color: lowColor_D },
        { offset: "100%", color: highColor_D },
      ])
      .enter()
      .append("stop")
      .attr("offset", function (d) {
        return d.offset;
      })
      .attr("stop-color", function (d) {
        return d.color;
      });

    // Ticks
    xLeg = d3.scaleLinear().domain([min_d, max_d]).range([10, 285]);

    axisLeg = d3
      .axisBottom(xLeg)
      .tickValues(arr_Scale_D.domain())
      .tickFormat((d) => (d / 1000).toFixed(1) + "K");

    // Draw the legend and title
    svgLegend
      .append("text")
      .attr("class", "legendTitle")
      .attr("x", 0)
      .attr("y", 20)
      .style("text-anchor", "left")
      .text("Death");

    svgLegend
      .append("rect")
      .attr("x", 10)
      .attr("y", 30)
      .attr("width", 400)
      .attr("height", 15)
      .style("fill", "url(#linear-gradient)");

    svgLegend
      .attr("class", "axis")
      .append("g")
      .attr("transform", "translate(0, 45)")
      .call(axisLeg);
  } else if (type == "Death per 1K") {
    // If selected "Death per 1K"
    //low and high color
    var lowColor_D = "#f9f9f9";
    var highColor_D = "#3a0ca3";
    var arr_Scale_D = d3
      .scaleLinear()
      .domain([min_dp, max_dp])
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
        return arr_Scale_D(
          (values_d[d.properties.STATE_ABBR] /
            state_population[d.properties.STATE_ABBR]) *
            1000
        );
      })
      .attr("d", path)
      .on("mouseover", function (d, i) {
        // show the information when clicking
        d3.select(this)
          .append("svg:title")
          .text(function (d) {
            return (
              d.properties.STATE_ABBR +
              "\nDeath per 1K: " +
              (
                (values_d[d.properties.STATE_ABBR] /
                  state_population[d.properties.STATE_ABBR]) *
                1000
              ).toFixed(2) +
              "\nDeath: " +
              values_d[d.properties.STATE_ABBR]
            );
          });
      })
      .on("mouseout", function (d, i) {
        d3.select(this);
      })
      .on("click", function (d, i) {
        // Change the Temporal plots when clicking
        state_detail = state_name[this.id];
        onFormChange();
      });

    // Update the legend
    svgLegend.select("defs").remove();
    svgLegend.select("text").remove();
    svgLegend.select("rect").remove();
    svgLegend.select("g").remove();

    // linearGradient to defs, each has a unique id
    defs = svgLegend.append("defs");
    linearGradient = defs
      .append("linearGradient")
      .attr("id", "linear-gradient");

    linearGradient
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    // Color stops
    linearGradient
      .selectAll("stop")
      .data([
        { offset: "0%", color: lowColor_D },
        { offset: "100%", color: highColor_D },
      ])
      .enter()
      .append("stop")
      .attr("offset", function (d) {
        return d.offset;
      })
      .attr("stop-color", function (d) {
        return d.color;
      });

    // Ticks
    xLeg = d3.scaleLinear().domain([min_dp, max_dp]).range([10, 290]);

    axisLeg = d3.axisBottom(xLeg).tickValues(arr_Scale_D.domain());

    // Draw the legend and title
    svgLegend
      .append("text")
      .attr("class", "legendTitle")
      .attr("x", 0)
      .attr("y", 20)
      .style("text-anchor", "left")
      .text("Death");

    svgLegend
      .append("rect")
      .attr("x", 10)
      .attr("y", 30)
      .attr("width", 400)
      .attr("height", 15)
      .style("fill", "url(#linear-gradient)");

    svgLegend
      .attr("class", "axis")
      .append("g")
      .attr("transform", "translate(0, 45)")
      .call(axisLeg);
  }
}
