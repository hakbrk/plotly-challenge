
function buildMetadata(sample) {

  var url = "/metadata/"+sample;

  d3.json(url).then(function(response) {
    let list = d3.select("#sample-metadata");
  
    list.html("");
    Object.entries(response).forEach(([key, value]) => {
              let cell = list.append("p");
              cell.text(`${key}: ${value}`);
          });

          ///Gauge code modified from code found at https://codepen.io/plotly/pen/rxeZME
          var level = response.WFREQ*20;

          // Trig to calc meter point
          var degrees = 180 - level,
             radius = .5;
          var radians = degrees * Math.PI / 180;
          var x = radius * Math.cos(radians);
          var y = radius * Math.sin(radians);
          
          // Path: may have to change to create a better triangle
          var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
             pathX = String(x),
             space = ' ',
             pathY = String(y),
             pathEnd = ' Z';
          var path = mainPath.concat(pathX,space,pathY,pathEnd);
          
          var data = [{ type: 'scatter',
             x: [0], y:[0],
            marker: {size: 28, color:'850000'},
            showlegend: false,
            name: 'Washes',
            text: level/20,
            hoverinfo: 'text+name'},
            { values: [90/9, 90/9, 90/9, 90/9, 90/9, 90/9, 90/9, 90/9, 90/9, 90],
            rotation: 90,
            text: ['8-9','7-8','6-7','5-6', '4-5', '3-4', '2-3',
                '1-2', '0-1', ''],
            textinfo: 'text',
            textposition:'inside',	  
            marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                       'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                       'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)', 'rgba(243, 222, 113, .5)',
                       'rgba(245, 141, 59, .5)','rgba(245, 81, 67, .5)','rgba(255, 255, 255, 0)']},
            labels: ['8-9','7-8','6-7','5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            hoverinfo: 'label',
            hole: .5,
            type: 'pie',
            showlegend: false
          }];
          
          var layout = {
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                  color: '850000'
                }
              }],
            title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
            height: 600,
            width: 600,
            xaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]},
            yaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]}
          };
          
          Plotly.newPlot('gauge', data, layout) 
    
  });
};


    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);



function buildCharts(sample) {
  let url = "/samples/"+sample;
  d3.json(url).then(function(data) {
    let ids = data.otu_ids;
    let values = data.sample_values;
    let labels = data.otu_labels;
    console.log(ids);
    console.log(values);
    console.log(labels);

    let trace1 = {
      labels: ids.slice(0,10),
      values: values.slice(0,10),
      type: 'pie',
      hovertemplate: labels.slice(0,10)
    };

    let trace2 = {
      x: ids,
      y: values,
      mode: 'markers',
      text: labels,
      marker: {
        size: values,
        color: ids,
        colorscale:"Portland",
      }
    };
    
    let datapie = [trace1];
    let databubble = [trace2];
    
    let layout = {
      title: "Top 10 Bacteria Present",
    };
    let layout2 = {
      xaxis: {
        title: {
          text: 'OTU ID',
        }
      },
      yaxis: {
        title: {
          text: 'Sample Values',
        }
      }
    };
    
    Plotly.newPlot("pie", datapie, layout);
    Plotly.newPlot("bubble", databubble, layout2);
  });

};


  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    // console.log(sampleNames)
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
