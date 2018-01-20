var React = require('react');

var Item = React.createClass({
	activate: function () {
		this.props.activate(this.props.index);
	},
	clear: function() {
		this.props.clear();
	},
	render: function() {
		var classes = (this.props.active ? 'active' : '') + (this.props.value == -1 ? ' none' : '');
		return (
			<li className={classes} onMouseOver={this.activate} onMouseLeave={this.clear}>{this.props.byteString}</li>
		);
	}
});

var Set = React.createClass({
	activate: function () {
		this.props.activateSet(this.props.index);
	},
	clear: function() {
		this.props.clearSet();
	},
	render: function() {
		var items = this.props.set.map(function(b, i) {
			var byteString = "";

			if (b != -1 ) {
				byteString = b.toString(16);

				if(byteString.length == 1) {
					byteString = "0" + byteString;
				}
			}

			var active = this.props.activeItem == i && this.props.active;
			return (<Item index={i} value={b} byteString={byteString} active={active} activate={this.props.activateItem} clear={this.props.clearItem}/>);
		}.bind(this));

		return (
			<ul className={"setHex" + (this.props.active ? ' active' : '')} onMouseOver={this.activate} onMouseLeave={this.clear}>
				{items}
			</ul>
		);
	}
});

var AsciiSet = React.createClass({
	activate: function () {
		this.props.activateSet(this.props.index);
	},
	render: function() {
		var items = this.props.set.map(createAsciiCharacterElement.bind(this, this.props.setIndex));

		return (
			<ul className={"setAscii" + (this.props.active ? ' active' : '')} onMouseOver={this.activate} onMouseLeave={this.props.clearSet}>
				{items}
			</ul>
		);
	}
});

var AsciiCharacter = React.createClass({
	activate: function () {
		this.props.activateItem(this.props.itemIndex);
		this.props.activateSet(this.props.setIndex);
	},
	render: function() {
		return (<li index={this.props.currentCell} className={this.props.classes} onMouseOver={this.activate} onMouseLeave={this.props.clearSet}>{this.props.character}</li>); 

	}
});

function createAsciiCharacterElement (setIndex, byteValue, itemIndex, theSet) {
	var characterToDisplay = "·";
	if (byteValue > 31 && byteValue < 127) {
		characterToDisplay = String.fromCharCode(byteValue);
	}

	if (byteValue == -1) {
		characterToDisplay = "";
	}

	var activeCell  = this.props.activeSet * (theSet.length) + this.props.activeItem;
	var currentCell = setIndex*(theSet.length) + itemIndex;
	var classes = ( activeCell == currentCell ) ? 'active' : '';

	var props = {
		setIndex: setIndex,
		itemIndex: itemIndex,
		currentCell: currentCell,
		classes: classes,
		character: characterToDisplay,
		activateSet:  this.props.activateSet,
		clearSet:     this.props.clearSet,
		activateItem: this.props.activateItem
	};

	return (<AsciiCharacter {...props}/>);				
}

// 
// # For Highlighting - Each row has both an active set and an active item
// The active set is one of the 4 sets of 4 bytes and the active itsem is which of those 4 bytes was selected.
// 
var Row = React.createClass({
	getInitialState: function() {
		return ({
			activeSet: -1,
			activeItem: -1
		});
	},
	setActiveSet: function (activeSet) {
		if(this.props.sets[activeSet][this.state.activeItem] == -1) return;
		this.setState({activeSet: activeSet});
	},
	clearActiveSet: function () {
		this.setState({activeSet: -1});
	},
	setActiveItem: function (activeItem) {
		this.setState({activeItem: activeItem});
	},
	clearActiveItem: function () {
		this.setState({activeItem: -1});
	},
	activate: function () {
		this.setActiveSet(this.props.index);
	},
	render: function() {
		var sets = this.props.sets.map(function(set, i) {
			var active = this.state.activeSet == i ? true : false;

			var props = {
				set: set,
				index: i,
				active: active,
				activeItem:   this.state.activeItem,

				activateSet:  this.setActiveSet,
				clearSet:     this.clearActiveSet,
				activateItem: this.setActiveItem,
				clearItem:    this.clearActiveItem
			};

			return (<Set {...props}/>);
		}.bind(this));


		var asciiSets = this.props.sets.map(function(set, i) {
			var active = this.state.activeSet == i ? true : false;

			var props = {
				set: set,
				setIndex: i,
				index: i,
				active: active,
				activeItem:   this.state.activeItem,
				activeSet: this.state.activeSet,
				activateSet:  this.setActiveSet,
				clearSet:     this.clearActiveSet,
				activateItem: this.setActiveItem,
				clearItem:    this.clearActiveItem
			};

			return (<AsciiSet {...props}/>);
		}.bind(this));

		return (
			<div className="row">
				<div className="heading">{this.props.heading}:</div>
					{sets}
				<div className="ascii">
					{asciiSets}
				</div>
			</div>
		);
	}
});

var Hex = React.createClass({
	render: function() {
		var pad = "000000";

		var rows = this.props.rows.map(function(row, i) {
			var heading = ''+i*this.props.bytesper;
				heading = pad.substring(0, pad.length - heading.length) + heading;
				return <Row sets={row} heading={heading}/>;
		}.bind(this));

		return (
			<div className="hexviewer">
				<div className="hex">
					{rows}
				</div>
			</div>
		);
	}
});

var HexViewer = React.createClass({
	render: function() {
		var rowChunk = this.props.rowLength, setChunk = this.props.setLength;
		var rows = [], row = [], set = [], sets = [];
		
		var buffer = [];
		var bytes = this.props.buffer.length;

		if(Buffer.isBuffer(this.props.buffer)) {
			for (var ii = 0; ii < bytes; ii++) {
				buffer.push(this.props.buffer[ii]);
			}
		} else {
			buffer = this.props.buffer;
		}

		for (var i = 0; i<bytes; i+=rowChunk) {
			sets = [];
			temparray = buffer.slice(i,i+rowChunk);

			for(var z = temparray.length; z < rowChunk; z++) {
				temparray.push(-1);
			}
			row = [];
			for (x=0,k=temparray.length; x<k; x+=setChunk) {
				set = temparray.slice(x,x+setChunk);

				for(z = set.length; z < setChunk; z++) {
					set.push(-1);
				}
				row.push(set);

			}
			rows.push(row);
		}

		return (
			<Hex rows={rows} bytesper={rowChunk} />
		);
	}
});

module.exports = HexViewer;



