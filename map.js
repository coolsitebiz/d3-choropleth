
// education data
const educationData = d3.map();

// load data
d3.queue()
    .defer(d3.json, "./data/counties.json")
    .defer(d3.json, "./data/for_user_education.json")
    .await(ready);

// callback
function ready(error, data) {

    console.log(data.objects.counties.geometries);
    if(error) throw error;

    const counties = topojson.feature(data, {
        type: "GeometryCollection",
        geometries: data.objects.counties.geometries
    });

    const projection = d3.geoAlbersUsa()
        .fitExtent([[20,20], [1024, 768]], counties);

    const geoPath = d3.geoPath()
        .projection(projection);

    d3.select("#canvas").selectAll("path")
        .data(counties)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .style("fill", "red")
}
