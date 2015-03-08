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

			var active = this.props.activeItem == i && this.props.active
			return (<Item index={i} value={b} byteString={byteString} active={active} activate={this.props.activateItem} clear={this.props.clearItem}/>);
		}.bind(this));

		return (
			<ul className={"setHex" + (this.props.active ? ' active' : '')} onMouseOver={this.activate} onMouseLeave={this.clear}>
				{items}
			</ul>
		);
	}
});

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
	render: function() {
		var sets = this.props.sets.map(function(set, i) {
			var active = this.state.activeSet == i ? true : false

			var props = {
				set: set,
				index: i,
				active: active,
				activeItem:   this.state.activeItem,

				activateSet:  this.setActiveSet,
				clearSet:     this.clearActiveSet,
				activateItem: this.setActiveItem,
				clearItem:    this.clearActiveItem
			}

			return (<Set {...props}/>);
		}.bind(this));

		var ascii = this.props.sets.map(function(set, setIndex) {
			return set.map(function(b, itemIndex, theSet) {
				var c = "·";
				if (b > 31 && b < 127) {
					c = String.fromCharCode(b);
				}

				if (b == -1) {
					c = ""
				}

				var activeCell  = this.state.activeSet * (theSet.length) + this.state.activeItem;
				var currentCell = setIndex*(theSet.length) + itemIndex;
				var classes = ( activeCell == currentCell ) ? 'active' : '';

				return (<li className={classes}>{c}</li>);
			}.bind(this));
		}.bind(this));

		return (
			<div className="row">
				<div className="heading">{this.props.heading}:</div>
					{sets}
				<div className="ascii">
					<ul className="setAscii">
					{ascii}
					</ul>
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
			for (var i = 0; i < bytes; i++) {
				buffer.push(this.props.buffer[i]);
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



