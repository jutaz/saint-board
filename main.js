var appjs = require('appjs');
var Forecast = require('forecast.io');

var options = {
  APIKey: "a8a522b736ed358c658383117a24c254"
}
forecast = new Forecast(options);

// serve static files from a directory
appjs.serveFilesFrom(__dirname + '/content');

// handle requests from the browser
appjs.router.post('/', function(request, response, next){
  response.send('Hey! How are you ' + request.post('firstname'));
})

var window = appjs.createWindow({
  alpha: false,
  fullscreen: true,
  showChrome: false
});

window.on('create', function(){
  console.log("Window Created");
  window.frame.show().center();
});

window.on('ready', function(){
  window.process = process;
  window.module = module;

  get_forecast(function(data) {
    window.forecast = data;
  });

  setInterval(function() {
    get_forecast(function(data) {
      window.forecast = data;
    });
  }, (1000*60*2));

  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 27) {
      window.close();
    }
    if (e.keyIdentifier === 'F12' || e.keyCode === 74 && e.metaKey && e.altKey) {
      window.frame.openDevTools();
    }
  });
  
});

window.on('close', function(){
  console.log("Window Closed");
});


function get_forecast(callback) {
  forecast.get("54.867359", "23.972169", {units: "si"}, function (err, res, data) {
    if (err) throw err;
    callback(data);
  });
}