var appjs = require('appjs');
var Forecast = require('forecast.io');
var conf = require("./conf.json");

var options = {
  APIKey: conf.api_key
}

forecast = new Forecast(options);

appjs.serveFilesFrom(__dirname + '/content');

var window = appjs.createWindow({
  alpha: false,
  fullscreen: true,
  showChrome: false
});

window.on('create', function(){
  window.frame.show().center();
});

window.on('ready', function(){
  window.process = process;
  window.module = module;
  if(conf.env == "development") {
    window.forecast = require('./sample-data.json');
  } else {
    get_forecast(function(data) {
      window.forecast = data;
    });

    setInterval(function() {
      get_forecast(function(data) {
        window.forecast = data;
      });
    }, (1000*60*2));
  }

  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 27) {
      window.close();
    }
    if (e.keyIdentifier === 'F12' || e.keyCode === 74 && e.metaKey && e.altKey) {
      window.frame.openDevTools();
    }
  });
  
});

function get_forecast(callback) {
  forecast.get(conf.lat, conf.long, {units: "si"}, function (err, res, data) {
    if (err) throw err;
    callback(data);
  });
}

window.on('close', function(){
  process.exit(0);
});