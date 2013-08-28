var request = require('request'),
    Zephyros = require('./../src/zephyros'),
    fs = require('fs');

var z = new Zephyros(),
    appdb = fs.createWriteStream('./app.db', {flags: 'a'});

z.bind('m', ['Cmd', 'Ctrl'])
.windowFocused()
.maximize();

var main_screen = {};
z.api().mainScreen().frameWithoutDockOrMenu().then(function(screen){ main_screen = screen; });

z.listen('focus_changed').appFromWindow().appTitle().then(function(app){
  appdb.write(app.title + ',' + (new Date()).valueOf() + '\n');
});

z.bind('right', ['Cmd', 'Ctrl', 'Alt']).windowFocused().getWindowFrame().setWindowFrame(function(window){
  window.frame.x = window.frame.w = main_screen.frame.w / 2;
  window.frame.h = main_screen.frame.h;
  window.frame.y = main_screen.frame.y
  return window;
});

z.bind('left', ['Cmd', 'Ctrl', 'Alt']).windowFocused().getWindowFrame().setWindowFrame(function(window){
  window.frame.x = main_screen.frame.x;
  window.frame.w = main_screen.frame.w / 2;
  window.frame.h = main_screen.frame.h;
  window.frame.y = main_screen.frame.y
  return window;
});

z.bind('up', ['Cmd', 'Ctrl', 'Alt']).windowFocused().getWindowFrame().setWindowFrame(function(window){
  window.frame.x = main_screen.frame.x;
  window.frame.y = main_screen.frame.y
  window.frame.w = main_screen.frame.w;
  window.frame.h = main_screen.frame.h / 2;
  return window;
});

z.bind('down', ['Cmd', 'Ctrl', 'Alt']).windowFocused().getWindowFrame().setWindowFrame(function(window){
  window.frame.x = main_screen.frame.x;
  window.frame.y = window.frame.h = main_screen.frame.h / 2;
  window.frame.w = main_screen.frame.w;
  return window;
});

z.bind('h', ['Cmd', 'Ctrl'])
.windowFocused()
.getWindowFrame()
.setWindowFrame(function(window){
  var grid = toGridCoordinates( window.frame );
  grid.x -= 1;
  return { id: window.id , frame: toFramePixels( grid ) };
});

z.bind('l', ['Cmd', 'Ctrl'])
.windowFocused()
.getWindowFrame()
.setWindowFrame(function(window){
  var grid = toGridCoordinates( window.frame );
  grid.x += 1;
  return { id: window.id , frame: toFramePixels( grid ) };
});

z.bind('j', ['Cmd', 'Ctrl'])
.windowFocused()
.getWindowFrame()
.setWindowFrame(function(window){
  var grid = toGridCoordinates( window.frame );
  grid.y += 1;
  return { id: window.id , frame: toFramePixels( grid ) };
});

z.bind('k', ['Cmd', 'Ctrl'])
.windowFocused()
.getWindowFrame()
.setWindowFrame(function(window){
  var grid = toGridCoordinates( window.frame );
  grid.y -= 1;
  return { id: window.id , frame: toFramePixels( grid ) };
});

z.bind('=', ['Cmd', 'Ctrl'])
.windowFocused()
.getWindowFrame()
.setWindowFrame(function(window){
  var grid = toGridCoordinates( window.frame );
  grid.w += 1;
  return { id: window.id , frame: toFramePixels( grid ) };
});

z.bind('-', ['Cmd', 'Ctrl'])
.windowFocused()
.getWindowFrame()
.setWindowFrame(function(window){
  var grid = toGridCoordinates( window.frame );
  grid.w -= 1;
  return { id: window.id , frame: toFramePixels( grid ) };
});

z.bind(']', ['Cmd', 'Ctrl'])
.windowFocused()
.getWindowFrame()
.setWindowFrame(function(window){
  var grid = toGridCoordinates( window.frame );
  grid.h += 1;
  return { id: window.id , frame: toFramePixels( grid ) };
});

z.bind('[', ['Cmd', 'Ctrl'])
.windowFocused()
.getWindowFrame()
.setWindowFrame(function(window){
  var grid = toGridCoordinates( window.frame );
  grid.h -= 1;
  return { id: window.id , frame: toFramePixels( grid ) };
});

function toGridCoordinates( frame ){
  var column_size = 240;
  var row_size = 225;
  return {
    x: Math.round(frame.x / column_size),
    y: Math.round(frame.y / row_size),
    w: Math.round(frame.w / column_size),
    h: Math.round(frame.h / row_size)
  };
}

function toFramePixels( grid ) {
  var column_size = 240;
  var row_size = 225;
  return {
    x: grid.x * column_size,
    y: grid.y * row_size,
    w: grid.w * column_size,
    h: grid.h * row_size
  };
}

var cities = ['London', 'Manchester', 'Bath', 'Leeds', 'Liverpool'];
z.bind('c', ['Cmd', 'Alt', 'Ctrl']).chooseFrom({
  list: cities,
  title: 'Cities',
  lines_tall: 5,
  chars_wide: 30
}).then(function(selected){
  request('http://api.openweathermap.org/data/2.5/weather?q=' + cities[selected] + ',uk', function(error, response, body){
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      z.api().alert(body.weather[0].description + ' in ' + cities[selected]);
    }
  });
});
