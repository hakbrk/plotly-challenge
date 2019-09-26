function buildGauge(sample) {
    var url = "/metadata/"+sample;

    d3.json(url).then(function(response) {
        let list = d3.select("#gauge");
        list.html("");
        console.log("Will this show up?");
              });
};
