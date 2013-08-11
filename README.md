# Zephyros [![Build Status](https://travis-ci.org/danielepolencic/zephyros.png)](https://travis-ci.org/danielepolencic/zephryos)
Node.js adapter for [Zephyros](https://github.com/sdegutis/zephyros).

## Usage
Include `zephiros` in your script and you're ready to go!

    var Zephyros = require('zephyros');

    var z = new Zephyros({
      port: 1235,
      host: 'localhost'
    });

    z.bind('t', ['Cmd', 'Shift']).thenClipboardContents().then(function(clipboard){
      console.log("clipboard: ", clipboard);
    });

## API
*Please note that this is a partial implementation of all the APIs available.*

- **bind( key<String>, Modifiers<Array> )**
- **thenClipboardContents( callback<function> )**, the clipboard is passed as an
  argument to the callback
- **thenFocusedWindow( callback<function> )**, the window object with the id of the
  window is passed as an argument to the callback
- **thenGetWindowFrame( callback<function> )**, the window object with the id and the frame of the window are passed as an argument to the callback
- **thenSetWindowFrame( callback<function> )**, expect the callback to return
  a window object with id and frame properties.

## Tests
Tests are written in [Mocha](http://visionmedia.github.io/mocha/). Simply run
the test with:

    ~$ mocha
