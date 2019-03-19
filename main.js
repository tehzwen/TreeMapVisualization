
var sectorName = "Energy";
var valueName = "Growth"

var overAllHeight = 1200;
var overAllWidth = 1800;

var textColor = 'black';
var themeColor = '#68edbc';
var boxFontSize = 0;

function main() {

    var myDiv = d3.select('#mydiv')
    myDiv.insert('h1')
        .style('text-align','center')
        .style('color','white')
        .style('font-family', 'Courier New, Courier, monospace')
        .text("Growth Rate by Sector")

    var sectorOptions = [
        "Energy",
        "Utilities",
        "Consumer Discretionary",
        "Industrials",
        "Health Care",
        "Information Technology",
        "Real Estate",
        "Financials",
        "Consumer Staples",
        "Utilities",
        "Materials",
        "Communication Services"
    ];

    var valueOptions = [
        "Growth",
        "PEG",
        "P/E",
        "Price",
        "Dividend"
    ]


    sectorSelect = myDiv
        .insert("div")
        .style('margin-left','5vh')
        .insert("select")
        .attr('class', 'category-thing')
        .style('font-family', 'Courier New, Courier, monospace')
        .style('margin-right', '5vh')
        .style('background-color', themeColor)
        .style('color', textColor)
        .style('width', '10vw')
        .style('height', '1.5vw')

    sectorSelect.selectAll("option")
        .data(sectorOptions)
        .enter()
        .append("option")
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) {
            return d;
        });

    valueSelect = myDiv
        .select("div")
        .insert("select")
        .style('font-family', 'Courier New, Courier, monospace')
        .style('background-color', themeColor)
        .style('color', textColor)
        .style('width', '10vw')
        .style('height', '1.5vw')


    valueSelect.selectAll("option")
        .data(valueOptions)
        .enter()
        .append("option")
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) {
            return d;
        });


    getData(sectorName, valueName);

    valueSelect.on("change", function (d) {
        valueName = d3.select(this).property("value");
        getData(sectorName, valueName);
    });

    sectorSelect.on("change", function (d) {
        sectorName = d3.select(this).property("value");
        getData(sectorName, valueName);
    });
}


function getData(sector, value) {

    d3.select("svg").remove();
    d3.select("body")
        .append("svg")
        .style("width", overAllWidth)
        .style("height", overAllHeight)
        .style('margin-left','5vh')
        .append("g");

    d3.csv("/data/allCCC.csv", function (data) {

        if (data["Sector"] === sector) {
            return data;
        }

    }).then((sectorData) => {
        var actualData = { "name": "", "children": [] };

        for (let i = 0; i < sectorData.length; i++) {


            if (sectorData[i][value] > 0 && sectorData[i][value] !== "n/a") {
                console.log(sectorData[i][value]);
                actualData.children.push({
                    "name": sectorData[i]["Name"],
                    "value": sectorData[i][value]
                });
            }
        }

        displayTreeMap(actualData);


    });
}

function getAverage(actualData) {
    var total = 0.0;

    for (let i = 0; i < actualData.children.length; i++) {
        if (actualData.children[i].value !== "n/a") {
            total += parseFloat(actualData.children[i].value);
        }

    }

    var avg = total / actualData.children.length;
    console.log(avg);
    return avg;
}

function displayTreeMap(actualData) {
    //console.log(actualData);
    var avg = getAverage(actualData);

    var treemapLayout = d3.treemap()
        .size([overAllWidth, overAllHeight])
        .tile(d3.treemapSquarify)
        .paddingOuter(10);

    var root = d3.hierarchy(actualData)

    root.sum(function (d) {
        return d.value;
    });

    treemapLayout(root);

    var blocks = d3.select('svg g')
        .selectAll('rect')
        .data(root.descendants())
        .append('rect')
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })


    blocks.enter()


    var nodes = d3.select('svg g')
        .selectAll('g')
        .data(root.descendants())
        .enter()
        .append('g')
        
        .attr('transform', function (d) {
            return 'translate(' + [d.x0, d.y0] + ')'
        })


    nodes
        .append('rect')
        
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })

    nodes
        .append('text')
        .style('font-family','Courier New, Courier, monospace')
        .style('color', textColor)
        .text(function (d) {
            return d.data.name;
        })
        .attr('dx', 4)
        .attr('dy', 14)


    nodes
        .append('text')
        .style('font-weight','bold')
        .style('font-family','Courier New, Courier, monospace')
        .style('font-color', textColor)
        .text(function (d) {
            return d.data.value;
        })
        
        .attr('dx', 4)
        .attr('dy', 35)


    d3.selectAll('rect')
        .attr("id", "data-square")
        .attr('fill', themeColor)
        .attr('stroke', 'white')
        .attr('fill-opacity', function (d) {

            let opacityVal;

            opacityVal = d.data.value / (avg * 2);

            if (opacityVal) {
                return opacityVal;
            }
            else {
                return 0.01;
            }
        })



}







main();