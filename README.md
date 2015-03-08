React Hex Viewer
================

![Screenshot](/images/ss.png)

```
var React = require('react')
var HexViewer = require('react-hexviewer');

// Data is a buffer or byte array

React.render(<HexViewer buffer={data} rowLength={16} setLength={4} />, document.body);
```

The component has three properties.

* buffer - buffer or byte array
* rowLength - number of bytes per row
* setLength - number of bytes between a visible split
