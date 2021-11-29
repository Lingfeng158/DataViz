let vax_full; //for full data
let title1 = "FULLY_VACCINATED_PERSONS",
  title2 = "FULLY_VACCINATED_PERCENT",
  title3 = "TOTAL_DOSES_ADMINISTERED"; //for 3 detailed data
let state_name = "Arkansas";
let partial_data = [];
let margin_detail = { top: 20, right: 20, bottom: 30, left: 30 },
  width_detail = 360 - margin_detail.left - margin_detail.right,
  height_detail = 300 - margin_detail.top - margin_detail.bottom;

let svg1, svg2, svg3;

function onFormChange() {
  title1 = $("#myformforpane1").val();
  title2 = $("#myformforpane2").val();
  title3 = $("#myformforpane3").val();
  document.getElementById("v1title").innerHTML =
    "Raw Number of " + $("#mypane1").val() + " Population";
  document.getElementById("v2title").innerHTML =
    "Percentage of " + $("#mypane2").val() + " Population";
  document.getElementById("v3title").innerHTML =
    "Total Doses " + $("#mypane3").val();
  document.getElementById("title_detail").innerHTML =
    "Detailed Information For " + state_name;
  init_detail();
}

// call the function that draws
init_detail();

async function init_detail() {
  vax_full = await d3.csv("./covid_vax.csv");
  redraw_detail();
}

async function redraw_detail() {
  partial_data = [];
  vax_full.forEach((element) => {
    if (element.GEOGRAPHY_NAME === state_name)
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
      fc
        .axisLabelRotate(fc.axisBottom(x))
        .ticks(d3.timeMonth, 1)
        .tickFormat(d3.timeFormat("%b"))
    );
  svg2
    .append("g")
    .attr("transform", "translate(0," + height_detail + ")")
    .call(
      fc
        .axisLabelRotate(fc.axisBottom(x))
        .ticks(d3.timeMonth, 1)
        .tickFormat(d3.timeFormat("%b"))
    );
  svg3
    .append("g")
    .attr("transform", "translate(0," + height_detail + ")")
    .call(
      fc
        .axisLabelRotate(fc.axisBottom(x))
        .ticks(d3.timeMonth, 1)
        .tickFormat(d3.timeFormat("%b"))
    );

  svg1
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin_detail.left)
    .attr("x", 0 - height_detail / 2)
    .attr("dy", "0.75em")
    .attr("font-size", "12px")
    .style("text-anchor", "middle")
    .text("Count (100K)");
  svg2
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin_detail.left)
    .attr("x", 0 - height_detail / 2)
    .attr("dy", "0.75em")
    .attr("font-size", "12px")
    .style("text-anchor", "middle")
    .text("Percentage (%)");
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
  svg1.append("g").call(fc.axisLeft(y1).tickFormat((d) => d / 100000));
  svg2.append("g").call(fc.axisLeft(y2).tickFormat((d) => d * 100));
  svg3.append("g").call(fc.axisLeft(y3).tickFormat((d) => d / 100000));
}
