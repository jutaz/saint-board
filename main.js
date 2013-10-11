var appjs = require('appjs');

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
  window.require = require;

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
