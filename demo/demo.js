require('when/monitor/console');

var Zephyros = require('./../src/zephyros');

var z = new Zephyros({
  port: 1235,
  host: 'localhost'
});

z.bind('t', ['Cmd', 'Shift']).thenGetClipboardContents().then(function(clip){
  console.log("clip: ", clip);
});

z.bind('r', ['Cmd', 'Shift']).thenGetFocusedWindow().then(function(window){
  console.log("window: ", window);
});

z.bind('right', ['Cmd', 'Alt', 'Ctrl'])
.thenGetFocusedWindow()
.thenGetWindowFrame()
.thenSetWindowFrame(function(window){
  var grid = toGridCoordinates( window.frame );
  grid.w += 1;
  return { id: window.id , frame: toFramePixels( grid ) };
});

z.bind('left', ['Cmd', 'Alt', 'Ctrl'])
.thenGetFocusedWindow()
.thenGetWindowFrame()
.thenSetWindowFrame(function(window){
  var grid = toGridCoordinates( window.frame );
  grid.w -= 1;
  return { id: window.id , frame: toFramePixels( grid ) };
});

z.bind('down', ['Cmd', 'Alt', 'Ctrl'])
.thenGetFocusedWindow()
.thenGetWindowFrame()
.thenSetWindowFrame(function(window){
  var grid = toGridCoordinates( window.frame );
  grid.h += 1;
  return { id: window.id , frame: toFramePixels( grid ) };
});

z.bind('up', ['Cmd', 'Alt', 'Ctrl'])
.thenGetFocusedWindow()
.thenGetWindowFrame()
.thenSetWindowFrame(function(window){
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
