
var sectorName = "Energy";
var valueSelect = "Growth"

var overAllHeight = 800;
var overAllWidth = 1200;

function main() {
    initialSetup();
}


function initialSetup() {
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



    var body = d3.select('body')
    var myDiv = d3.select('#mydiv')

    myDiv.insert('h1')
        .attr('class', 'header-text')
        .text("Growth Rate by Sector")

    sectorSelect = d3.select('#mydiv')
        .append("div")
        .append("select")

    sectorSelect.selectAll("option")
        .data(sectorOptions)
        .enter()
        .append("option")
        .attr("value", function (d) {
            console.log(d);
            return d;
        })
        .text(function (d) {
            return d;
        });

    d3.csv("/data/allCCC.csv", function (data) {
        //console.log(data);
        //console.log(data["Sector"]);

        if (data["Sector"] === sectorName) {
            return data;
        }

    }).then((sectorData) => {
        var actualData = { "name": "", "children": [] };

        for (let i = 0; i < sectorData.length; i++) {

            if (sectorData[i]["Growth"] > 10) {
                actualData.children.push({
                    "name": sectorData[i]["Name"],
                    "value": sectorData[i][valueSelect]
                });
            }
        }

        var treemapLayout = d3.treemap()
            .size([overAllWidth, overAllHeight])
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
            .attr('class', 'block-text')
            .text(function (d) {
                return d.data.name;
            })
            .attr('dx', 4)
            .attr('dy', 14)


        nodes
            .append('text')
            .text(function (d) {
                return d.data.value;
            })
            .attr('dx', 4)
            .attr('dy', 35)

        d3.selectAll('rect')
            .attr('fill', 'cadetblue')
            .attr('stroke', 'white')
            .attr('fill-opacity', function (d) {

                let opacityVal = 0.01 * d.data.value;

                if (opacityVal) {
                    return opacityVal;
                }
                else {
                    return 0.01;
                }
            })

    });


    sectorSelect
        .on("change", function (d) {
            sectorName = d3.select(this).property("value");
            alert(sectorName);

            d3.csv("/data/allCCC.csv", function (data) {
                if (data["Sector"] === sectorName) {
                    return data;
                }

            }).then((sectorData) => {
                var actualData = { "name": "", "children": [] };

                for (let i = 0; i < sectorData.length; i++) {

                    if (sectorData[i]["Growth"] > 10) {
                        actualData.children.push({
                            "name": sectorData[i]["Name"],
                            "value": sectorData[i][valueSelect]
                        });
                    }
                }

                blocks.exit().remove()

            })


        });


}






main();