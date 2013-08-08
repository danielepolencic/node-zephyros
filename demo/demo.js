require('when/monitor/console');

var Zephyros = require('./../src/zephyros');

var z = new Zephyros({
  port: 1235,
  host: 'localhost'
});

z.bind('t', ['Cmd', 'Shift']).thenClipboardContents().then(function(clip){
  console.log("clip: ", clip);
});

z.bind('r', ['Cmd', 'Shift']).thenFocusedWindow().then(function(window){
  console.log("window: ", window);
});

z.bind('e', ['Cmd', 'Shift'])
.thenFocusedWindow()
.thenGetWindowFrame()
.then(function(frame){
  console.log("frame: ", frame);
  return frame;
})
.thenSetWindowFrame(function(window){
  return { id: window.id, frame : { x: 0, y: 22, w: 300, h: 300 } };
});
