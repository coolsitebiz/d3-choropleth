const h = 600;
const w = 1024;
const padding = 50;

const COUNTIES_FILE = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";
const EDUCATION_FILE = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";

const svg = d3.select("#chart")
                .append("svg")
                .attr("id", "map")
                .attr("width", w + padding)
                .attr("height", h + padding);

const tooltip = d3.select("body")
                .append("div")
                .attr("id", "tooltip")
                .attr("data-education", "");

const legend = d3.select("#map")
                .append("g")
                .attr("id", "legend");

// load data
d3.queue()
    .defer(d3.json, COUNTIES_FILE)
    .defer(d3.json, EDUCATION_FILE)
    .await(ready);

const path = d3.geoPath();

const legendScale = d3.scaleLinear()
                        .domain([50, 0])
                        .range([0, 200]);

const legendAxis = d3.axisRight(legendScale);



// ready callback
function ready(error, countyData, educationData) {

    if(error) {throw error};

    const counties = topojson.feature(countyData, countyData.objects.counties).features 
    const education = educationData;

    svg //map
        .selectAll(".county")
        .data(counties)
        .enter()
        .append("path")
        .attr("class", "county")
        .attr("d", path)
        .attr("data-fips",(d) => d.id)
        .attr("data-education", function(d) {
            let ed = education.filter(item => item.fips === d.id);
            if (ed[0]) {
                return ed[0].bachelorsOrHigher;
            } else {
                return 0;
            }})
        .style("fill", function(d) {
            let countyinfo = education.filter(item => item.fips === d.id);
            return setColor(countyinfo[0].bachelorsOrHigher);
            })
        .on("mouseover", function(d) {
            let countyinfo = education.filter(item => item.fips === d.id);

            d3.select(this).style("stroke", "hotpink")
            d3.select("#tooltip")
                .style("top", d3.event.pageY + 5 + "px")
                .style("left", d3.event.pageX + 5 + "px")
                .attr("data-education", countyinfo[0].bachelorsOrHigher)
                .style("opacity", .9)
                .html("<p>" + countyinfo[0].area_name + ", " + countyinfo[0].state + "<br />Attainment: " + countyinfo[0].bachelorsOrHigher + "&#37;</p>");
        })
        .on("mouseout", function(d) {
            d3.select(this).style("stroke", "none");
            d3.select("#tooltip")
                .style("top", "-100px")
                .style("left", "-100px")
                .style("opacity", 0);
        })

        legend
            .attr("transform", "translate(950, 300)")
            .call(legendAxis.ticks(6).tickFormat(d => d + "%")) 
            .selectAll(".legend-block")
            .data([0, 10, 20, 30, 40, 50])
            .enter()
            .append("rect")
            .attr("class", "legend-block")
            .attr("width", 20)
            .attr("height", 40)
            .attr("fill", d => setColor(d))
            .attr("y", d => legendScale(d) - 39)
            .attr("x", -15)
            

}

function setColor(num) {
    let hue = 260; 

    if (num >= 50) {
        return "hsl(" + hue + ",100%, 20%)";
    } else if (num >= 40) {
        return "hsl(" + hue + ",100%, 50%)";
    } else if (num >= 30) {
        return "hsl(" + hue + ",100%, 60%)"
    } else if (num >= 20) {
        return "hsl(" + hue + ",100%, 70%)"
    } else if (num >= 10) {
        return "hsl(" + hue + ",100%, 80%)"
    }else {
        return "hsl(" + hue + ",100%, 90%)"
    }
}


