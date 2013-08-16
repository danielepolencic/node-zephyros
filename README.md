# Zephyros [![Build Status](https://travis-ci.org/danielepolencic/zephyros.png)](https://travis-ci.org/danielepolencic/zephryos)
Node.js adapter for [Zephyros](https://github.com/sdegutis/zephyros).

## Usage
Include `zephiros` in your script and you're ready to go!

```node
var Zephyros = require('zephyros');

var z = new Zephyros();

z.bind('t', ['Cmd', 'Shift']).getClipboardContents().then(function(clipboard){
  console.log("clipboard: ", clipboard);
});
```

## API
About promises.

### Starting a chain
There are three types of methods that can initiate a new chain:

**bind**  
`bind( key<String>, modifier<Array> )`  
Listen to a particular key combination and fire the chain every time such
shortcut is triggered.

```node
z.bind('t', ['Cmd', 'Shift']).then(function(){
  console.log('Hey, you pressed t+⌘⌃');
});
```

**listen**  
`listen( event<String> )`  
Listen to a particular event and fire the chain every time this event occurs.

```node
z.listen('window_created').then(function(){
  console.log('Hey, you created a new window!');
});
```

**api**  
`api()`  
Manually trigger a displsable chain of actions.

```node
z.api().then(function(){
  console.log('Fired only once.');
});
```

When a new chain is initialised, ypu can use the API to interact with Windows,
Apps, Screens and Ohter stuff.

### Window
**getFocusedWindow**  
`getFocusedWindow() ⇒ object`  
Return an object with the id of the focused window.

```node
z.bind('t', ['Cmd', 'Shift']).getFocusedWindow().then(function(window){
  console.log(window.id);
});
```

**getWindowFrame**  
`getWindowFrame( window ) ⇒ object`  
Return a window object with the `id` of the window and the `frame` field that
contains the origin (top left) and size of the window.

```node
z.bind('t', ['Cmd', 'Shift'])
.getFocusedWindow()
.getWindowFrame()
.then(function(window){
  console.log(window.frame); // {x: 0, y: 0, w: 200, h: 200}
});
```

**setWindowFrame**  
`setWindowFrame( window )`  
Set the window frame for the window identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.getFocusedWindow()
.getWindowFrame()
.SetWindowFrame(function(window){
  window.frame.w /= 2;
  return window;
});
```

**getVisibleWindows**  
`getVisibleWindows() ⇒ array`  
Return an array containing an object for every visible window.

```node
z.bind('t', ['Cmd', 'Shift']).getVisibleWindows().then(function(windows){
  window.forEach(console.log);
});
```

**getAllWindows**  
`getAllWindows() ⇒ array`  
Return an array containing an object for all the windows.

```node
z.bind('t', ['Cmd', 'Shift']).getAllWindows().then(function(windows){
  window.forEach(console.log);
});
```

**getWindowTitle**  
`getWindowTitle( window ) ⇒ object`  
Return a window object with the `id` of the window and the `title`.

```node
z.bind('t', ['Cmd', 'Shift'])
.getFocusedWindow()
.getWindowTitle()
.then(function(window){
  console.log(window.title);
});
```

**getWindowOrigin**  
`getWindowOrigin( window ) ⇒ object`  
Return a window object with the `id` of the window and the `origin` (top
left corner) of the window.

```node
z.bind('t', ['Cmd', 'Shift'])
.getFocusedWindow()
.getWindowOrigin()
.then(function(window){
  console.log(window.frame); // {x: 0, y: 0}
});
```

**setWindowOrigin**  
`setWindowOrigin( window )`  
Set the `origin` (top left corner) for a certain window `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.getFocusedWindow()
.getWindowOrigin()
.setWindowOrigin(function(window){
  window.frame.x += 100;
  return window;
});
```

**getWindowSize**  
`getWindowSize( window ) ⇒ object`  
Return a window object with the `id` of the window and the `size`.

```node
z.bind('t', ['Cmd', 'Shift'])
.getFocusedWindow()
.getWindowSize()
.then(function(window){
  console.log(window.frame); // {w: 100, h: 100}
});
```

**setWindowSize**  
`setWindowSize( window )`  
Set the window the `size` fot a certain window `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.getFocusedWindow()
.getWindowSize()
.then(function(window){
  window.frame.w += 200;
  return window;
});
```

**windowMaximize**  
`windowMaximize( window )`  
Maximize the window identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.getFocusedWindow()
.windowMaximize();
```

**windowMinimize**  
`windowMinimize( window )`  
Minimize the window identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.getFocusedWindow()
.windowMinimize();
```

**windowUnminimize**  
`windowUnminimize( window )`  
Unminimize the window identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.getFocusedWindow()
.windowUnminimize();
```

**getAppFromWindow**  
`getAppFromWindow( window ) ⇒ object`  
Get the app object from the window identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.getFocusedWindow()
.getAppFromWindow()
.then(function(app){
  console.log(app); //{ id: 1 }
});
```

**getScreenFromWindow**  
`getScreenFromWindow( window ) ⇒ object`  
Get the screen object from the window identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.getFocusedWindow()
.getScreenFromWindow()
.then(function(screen){
  console.log(screen); //{ id: 2 }
});
```

**focusWindow{up, down, right, left}**  
`focusWindow{up, down, right, left}( window )`  
Focus the window identified by `id` to the {right, left, up, down}.

```node
z.bind('t', ['Cmd', 'Shift'])
.getFocusedWindow()
.focusWindowUp();
```

## Tests
Tests are written in [Mocha](http://visionmedia.github.io/mocha/). Simply run
the test with:

    ~$ mocha
