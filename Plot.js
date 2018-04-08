// Canvas Info
var CanvasInfo = {
    width: 900,
    height: 400,
    id: "#graph",
    type: "svg",
    defaultName: "Demo Graph"
};

// Axis Info
var AxisInfo = {
    left: 20,
    right: 20,
    top:20,
    bottom:20  
};

// RGB
var rgb = ["red", "green", "blue"];

/**
 * Setup a canvas
 *
 * @param marginInfo the margins for the graph
 * @param graphTitle the title of the graph
 * @param width the width of the graph
 * @param height the height of the graph
 *
 * @return A canvas object
 */

function SetupCanvas(marginInfo, graphTitle, width, height)
{
    var canvas = d3.select(CanvasInfo.id)
                   .append(CanvasInfo.type);

    canvas.attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + marginInfo.left + "," + marginInfo.top + ")");

    var title = (graphTitle !== undefined)? graphTitle: CanvasInfo.defaultName;
    canvas.text(title)
          .select(CanvasInfo.id);

    return canvas;
}

/**
 * Setup a line plot
 *
 * @param marginInfo the margins for the graph
 * @param data the data for the graph
 * @param yTags the tags for the y axes
 * @param graphTitle the title of the graph
 * @param secondaryYAxis the secondary y axis
 */
function SetupLinePlot(marginInfo, data, yTags, graphTitle, secondaryYAxis)
{
    var canvasWidth = CanvasInfo.width - marginInfo.left - marginInfo.right;
    var canvasHeight = CanvasInfo.height - marginInfo.top - marginInfo.bottom;
    var canvas = SetupCanvas(marginInfo, graphTitle, canvasWidth, canvasHeight);

    // Graph dims
    var width = canvasWidth - AxisInfo.left;
    var height = canvasHeight - AxisInfo.bottom;
    // if (secondaryYAxis !== undefined)
    // {
    //     width = width - AxisInfo.right;
    // }

    // Get formatted time
    // var getTimeLambda = d3.timeParse("%d-%b-%y");
    // data.forEach(function(point)
    // {
    //    point.x = getTimeLambda(point.x);
    // });

    var xAxis = d3.scaleLinear().range([AxisInfo.left, width]);
    var yAxis = d3.scaleLinear().range([height, AxisInfo.bottom]);

    xAxis.domain(d3.extent(data, function(point) { return point.x; }));
    yAxis.domain([0, d3.max(data, function(point)
    {
        var yMax = 0;
        var yData = point.y;
        for (var tag in yData)
        {
            yMax = yData[tag] > yMax? yData[tag]: yMax;
        }

        return yMax;
    })]);

    // Add all line plots
    var colorIndex = 0;
    for (var tagIndex in yTags)
    {
        var getValueLambda = d3.line()
                               .x(function(point){ return xAxis(point.x); })
                               .y(function(point){ return yAxis(point.y[yTags[tagIndex]]); });
        
        canvas.append("path")
              .data([data])
              .attr("class", "line")
              .style("stroke", rgb[colorIndex % rgb.length])
              .style("fill", "none")
              .attr("d", getValueLambda);

        ++colorIndex;
    }

    canvas.append("g")
          .attr("transform", "translate(0, " + height + ")")
          .call(d3.axisBottom(xAxis));

    canvas.append("g")
          .attr("transform", "translate(" + marginInfo.left + ", 0)")
          .call(d3.axisLeft(yAxis));

    // // Add a secondary y axis if needed
    // if (secondaryYAxis !== undefined)
    // {
    //     var yAxisRight = d3.scaleLinear.range([height, 0]);
    //     yAxisRight.domain([0, d3.max(data, function(point)
    //     {
    //         return point.y[secondaryYAxis];
    //     })]);

    //     canvas.append("g")
    //           .attr("transform", "translate(" + width + ", 0)")
    //           .call(d3.axisRight(yAxisRight));
    // }
}