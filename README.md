React Hex Viewer
================

![Screenshot](/images/ss.png)

**Example**
```javascript
var React = require('react')
var HexViewer = require('react-hexviewer');

// Data is a buffer or byte array

React.render(<HexViewer buffer={data} rowLength={16} setLength={4} />, document.body);
```

The component has three properties.

* buffer - buffer or byte array
* rowLength - number of bytes per row
* setLength - number of bytes between a visible split

**How to build**
To build open a new terminal at the root of this project and run:
```
gulp
```
This will watch any file changes and build a new bundle.

**How to run**
To run open a terminal at the root of this project and run:
```
npm install -g serve # only needs to be run once
serve
```
Now open browser at http://localhost:3000/examples/