const datafield = document.getElementById('data');

const gpointsE = document.getElementById('gpoints');

gpointsE.addEventListener('change', (event) => {
  maxdata = gpointsE.value;
});
var socket = io();
var isstart = false;
var alldata = [];
var alldatacsv = "data:text/csv;charset=utf-8,"
var maxdata = gpointsE.value;

var ElevationO = 0;
var TempO = 0;

function stop(){
  isstart = false;
}

function start(){
  isstart = true;
}

// Stolen from stack overflow - why recreate the wheel? 
function exportToCsv(filename, rows) {
  var processRow = function (row) {
      var finalVal = '';
      for (var j = 0; j < row.length; j++) {
          var innerValue = row[j] === null ? '' : row[j].toString();
          if (row[j] instanceof Date) {
              innerValue = row[j].toLocaleString();
          };
          var result = innerValue.replace(/"/g, '""');
          if (result.search(/("|,|\n)/g) >= 0)
              result = '"' + result + '"';
          if (j > 0)
              finalVal += ',';
          finalVal += result;
      }
      return finalVal + '\n';
  };

  var csvFile = '';
  for (var i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
  } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  }
}
//{"BombGas":61, "Smoke":36, "CO":102, "Tempature":75.02, "Humidity":13.00, "Pressure":83666, "Altitude":1586.61}
function downloadtocsv(){
  csvdata = [["BombGas","Smoke","CO","Tempature","Humidity","Pressure","Altitude","Altitude-Adjusted","Tempature-Adjusted"]] 
  for (let i = 0; i < alldata.length; i++) {
    json = alldata[i];
    csvdata.push([json["BombGas"],json["Smoke"],json["CO"],json["Tempature"],json["Humidity"],json["Pressure"],json["Altitude"],json["Altitude"] - (-ElevationO),json["Tempature"] - (-TempO)])
  } 
  console.log(csvdata)
  exportToCsv("data.csv",csvdata)
}

function calculateOffsets(){
  const TempVal = document.getElementById('TempO').value;
  const ElevationVal = document.getElementById('ElevationO').value;
  const TempOff = document.getElementById('tempoff');
  const ElevationOff = document.getElementById('elevationoff');

  var Temp = 0;
  var Elevation = 0;

  const data = alldata;

  data.forEach(json => {
    Temp = parseInt(Temp) + parseInt(json["Tempature"])
    Elevation = parseInt(Elevation) + parseInt(json["Altitude"])
  });

  var TempA = Temp/data.length;
  var ElevationA = Elevation/data.length

  TempO = TempVal - TempA;
  ElevationO = ElevationVal - ElevationA;

  TempOff.innerHTML = TempO;
  ElevationOff.innerHTML = ElevationO;
}

const tempchartelement = document.getElementById('tempchart');
const airchartelement = document.getElementById('airchart');
const presschartelement = document.getElementById('presschart');
const pointsElement = document.getElementById('points');

tempchart = new Chart(tempchartelement, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Tempature',
        data: [],
        borderColor: "red",
        backgroundColor: "red",
      },
      {
        label: 'Humidity',
        data: [],
        borderColor: "blue",
        backgroundColor: "blue",
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Temp Chart'
      }
    }
  },
});

airchart = new Chart(airchartelement, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Bomb Gas',
        data: [],
        borderColor: "red",
        backgroundColor: "red",
      },
      {
        label: 'CO',
        data: [],
        borderColor: "blue",
        backgroundColor: "blue",
      },
      {
        label: 'Smoke',
        data: [],
        borderColor: "green",
        backgroundColor: "green",
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Air Chart'
      }
    }
  },
});

presschart = new Chart(presschartelement, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Pressure',
        data: [],
        borderColor: "black",
        backgroundColor: "black",
      },
      {
        label: 'Altitude',
        data: [],
        borderColor: "gold",
        backgroundColor: "gold",
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pressure Chart'
      }
    }
  },
});

socket.on("connect", () => {
  datafield.innerHTML = "Connected";
});

socket.on("disconnect", () => {
  datafield.innerHTML = "Disconnected...";
});

socket.on("input", (data) => {
  //datafield.innerHTML = data; // -- For dubugging info
  json = JSON.parse(data)
  alldata.push(json);
  pointsElement.innerHTML = alldata.length;
  if(isstart){

    //temp chart data
    tempchart.data.datasets[0].data.push(json["Tempature"] - (-TempO));
    tempchart.data.datasets[1].data.push(json["Humidity"]);
    if(tempchart.data.datasets[0].data.length > maxdata){
      tempchart.data.datasets[0].data.splice(0, tempchart.data.datasets[0].data.length - maxdata)
    }
    if(tempchart.data.datasets[1].data.length > maxdata){
      tempchart.data.datasets[1].data.splice(0, tempchart.data.datasets[1].data.length - maxdata)
    }

    tempchart.data.labels.push(json["timestamp-pretty"]);
    if(tempchart.data.labels.length > maxdata){
      tempchart.data.labels.splice(0, tempchart.data.labels.length - maxdata)
    }
    tempchart.update(); 

    //Air Chart
    airchart.data.labels.push(json["timestamp-pretty"]);
    if(airchart.data.labels.length > maxdata){
      airchart.data.labels.splice(0, airchart.data.labels.length - maxdata)
    }
    airchart.data.datasets[0].data.push(json["BombGas"]);
    if(airchart.data.datasets[0].data.length > maxdata){
      airchart.data.datasets[0].data.splice(0, airchart.data.datasets[0].data.length - maxdata)
    }
    airchart.data.datasets[1].data.push(json["Smoke"]);
    if(airchart.data.datasets[1].data.length > maxdata){
      airchart.data.datasets[1].data.splice(0, airchart.data.datasets[1].data.length - maxdata)
    }
    airchart.data.datasets[2].data.push(json["CO"]);
    if(airchart.data.datasets[2].data.length > maxdata){
      airchart.data.datasets[2].data.splice(0, airchart.data.datasets[2].data.length - maxdata)
    }
    airchart.update();

    //presurte chart
    presschart.data.labels.push(json["timestamp-pretty"]);
    if(presschart.data.labels.length > maxdata){
      presschart.data.labels.splice(0, presschart.data.labels.length - maxdata)
    }
    presschart.data.datasets[0].data.push(json["Pressure"]);
    if(presschart.data.datasets[0].data.length > maxdata){
      presschart.data.datasets[0].data.splice(0, presschart.data.datasets[0].data.length - maxdata)
    }
    presschart.data.datasets[1].data.push(json["Altitude"] - (-ElevationO));
    if(presschart.data.datasets[1].data.length > maxdata){
      presschart.data.datasets[1].data.splice(0, presschart.data.datasets[1].data.length - maxdata)
    }
    presschart.update()
    
  }
});

