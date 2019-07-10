
// education data
const educationData = d3.map();

// load data
d3.queue()
    .defer(d3.json, "./data/for_user_education.json")
    .defer(d3.json, "./data/counties.json")
    .await(ready);

// callback
// function ready(error, data) {

// }
