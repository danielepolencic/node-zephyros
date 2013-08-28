# Zephyros [![Build Status](https://travis-ci.org/danielepolencic/zephyros.png)](https://travis-ci.org/danielepolencic/zephryos)
Node.js adapter for [Zephyros](https://github.com/sdegutis/zephyros).

## Usage
Include `zephiros` in your script and you're ready to go!

```node
var Zephyros = require('zephyros');

var z = new Zephyros();

z.bind('t', ['Cmd', 'Shift']).clipboardContents().then(function(clipboard){
  console.log("clipboard: ", clipboard);
});
```

## API

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
A comprehensive list of events is available [here](https://github.com/sdegutis/zephyros/blob/master/Docs/Protocol.md)

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
**windowFocused**  
Return a window object with the id of the focused window.

```node
z.bind('t', ['Cmd', 'Shift']).windowFocused().then(function(window){
  console.log(window.id);
});
```

**windowsVisible**  
Return an array containing a window object for each visible window.

```node
z.bind('t', ['Cmd', 'Shift']).windowsVisible().then(function(windows){
  window.forEach(console.log);
});
```

**windows**  
Return an array containing a window object for all the windows.

```node
z.bind('t', ['Cmd', 'Shift']).windows().then(function(windows){
  window.forEach(console.log);
});
```

**windowTitle**  
Return a window object with the `id` of the window and the `title`.

```node
z.bind('t', ['Cmd', 'Shift'])
.windowFocused()
.windowTitle()
.then(function(window){
  console.log(window.title);
});
```

**getWindowFrame**  
Return a window object with the `id` of the window and the `frame`.

```node
z.bind('t', ['Cmd', 'Shift'])
.windowFocused()
.getWindowFrame()
.then(function(window){
  console.log(window.frame); // {x: 0, y: 0, w: 200, h: 200}
});
```

**setWindowFrame**  
Set the window frame for the window identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.windowFocused()
.getWindowFrame()
.setWindowFrame(function(window){
  window.frame.w /= 2;
  return window;
});
```

**maximize**  
Maximize the window identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.windowFocused()
.maximize();
```

**minimize**  
Minimize the window identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.windowFocused()
.minimize();
```

**unminimize**  
Unminimize the window identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.windowFocused()
.unminimize();
```

**windowFocus{up, down, right, left}**  
Focus the window identified by `id` to the {right, left, up, down}.

```node
z.bind('t', ['Cmd', 'Shift'])
.windowFocused()
.windowFocusUp();
```

**windowsTo{north, south, east, west}**  
Return an array of window objects for windows located on the {north, south,
east, west}.

```node
z.bind('t', ['Cmd', 'Shift'])
.windowsToNorth()
.then(function(windows){
  windows.forEach(console.log);
});
```

### Screen
**screenFromWindow**  
Get the screen object from the window identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.windowFocused()
.screenFromWindow()
.then(function(screen){
  console.log(screen); //{ id: 2 }
});
```

**mainScreen**  
Get the main screen object.

```node
z.bind('t', ['Cmd', 'Shift'])
.mainScreen()
.then(function(screen){
  console.log(screen); //{ id: 1 }
});
```

**frameIncludingDockAndMenu**  
Get the frame including the dock and the menu for a screen identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.mainScreen()
.frameIncludingDockAndMenu()
.then(function(screen){
  console.log(screen.frame); //{ x: 0, y: 0, w: 100, h: 100 }
});
```

**frameWithoutDockOrMenu**  
Get the frame without the dock or menu for a screen identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.mainScreen()
.frameWithoutDockOrMenu()
.then(function(screen){
  console.log(screen.frame); //{ x: 0, y: 0, w: 80, h: 80 }
});
```

**screens**  
Return an array containing a screen object for all the screens available.

```node
z.bind('t', ['Cmd', 'Shift'])
.screens()
.then(function(screens){
  screens.forEach(console.log);
});
```

### App
**appFromWindow**  
Get the app object from the window identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.windowFocused()
.appFromWindow()
.then(function(app){
  console.log(app); //{ id: 1 }
});
```

**apps**  
Return an array containing an app object for all the apps available.

```node
z.bind('t', ['Cmd', 'Shift'])
.apps()
.then(function(screens){
  screens.forEach(console.log);
});
```

**appTitle**  
Return the app object with the `id` of the app and the `title`.

```node
z.bind('t', ['Cmd', 'Shift'])
.windowFocused()
.appFromWindow()
.appTitle()
.then(function(app){
  console.log(app); // {id: 1, title: 'Zephyros'}
});
```

**appIsHidden**  
Return the app object with the `id` of the app and the boolean `isHidden` set to
false if the app is not hidden.

```node
z.bind('t', ['Cmd', 'Shift'])
.windowFocused()
.appFromWindow()
.appIsHidden()
.then(function(app){
  console.log(app); // {id: 1, isHidden: false}
});
```

**appShow**  
Show the app identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.windowFocused()
.appFromWindow()
.appHide()
.appShow()
```

**appHide**  
Hide the app identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.windowFocused()
.appFromWindow()
.appHide()
.appShow()
```

**appKill**  
Kill the app identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.windowFocused()
.appFromWindow()
.appKill()
```

**appKill9**  
Kill9 the app identified by `id`.

```node
z.bind('t', ['Cmd', 'Shift'])
.windowFocused()
.appFromWindow()
.appKill9()
```

### Util
**clipboardContents**  
Return a string with the content of the clipboard

```node
z.bind('t', ['Cmd', 'Shift'])
.clipboardContents()
.then(function(clipboard){
  console.log(clipboard); // Zephyros
});
```

**updateSettings**  
Trigger an update for Zephyros settings.

```node
z.bind('t', ['Cmd', 'Shift']).updateSettings();
```

**reloadConfig**  
Force a reload of the config file.

```node
z.bind('t', ['Cmd', 'Shift']).reloadConfig();
```

**alert**  
Prompt an alter.

```node
z.bind('t', ['Cmd', 'Shift']).alert({message: 'Hello'});
z.bind('t', ['Cmd', 'Shift']).alert('Hello'); // as above
z.bind('t', ['Cmd', 'Shift']).alert(function(){
  return { message: 'Hello World', duration: 3 };
}); // as above
```

**log**  
Log a string.

```node
z.bind('t', ['Cmd', 'Shift']).log({message: 'Log'});
z.bind('t', ['Cmd', 'Shift']).log('Hello'); // as above
z.bind('t', ['Cmd', 'Shift']).alert(function(){
  return 'Log';
}); // as above
```

**chooseFrom**  
Choose a list of items from a dinamically populated popup.

```node
z.bind('t', ['Cmd', 'Shift']).chooseFrom({
  list: ['Banana', 'Pineapple', 'Orange'],
  title: 'Fruits',
  lines_tall: 10,
  chars_wide: 30
}).then(function(selected){
  console.log(selected); // index of the array
});
```

## Tests
Tests are written in [Mocha](http://visionmedia.github.io/mocha/). Simply run
the test with:

    ~$ mocha
