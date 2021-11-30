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

  state_name = {
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

  var arr = [];
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

  min_c = d3.min(arr);
  max_c = d3.max(arr);

  var arr_d = [];
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
      viewData();
    },
  });

  viewData();
}

function viewData() {
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
