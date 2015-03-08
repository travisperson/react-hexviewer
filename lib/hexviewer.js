var React = require('react');

var Item = React.createClass({
	getClasses: function () {
		return (this.props.active ? 'active' : '') + (this.props.byte == "--" ? ' none' :'');
	},
	activate: function () {
		this.props.activate(this.props.index);
	},
	clear: function() {
		this.props.clear();
	},
	render: function() {
		return (
			<li className={this.getClasses()} onMouseOver={this.activate} onMouseLeave={this.clear}>{this.props.byte}</li>
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
		var items = this.props.set.map(function(byte, i) {
			var byteString = "";
			if (byte == -1 ) {
				byteString = "--";
			} else {
				byteString = byte.toString(16);
				if(byteString.length == 1) {
					byteString = "0" + byteString;
				}
			}
			byteString = byteString.toUpperCase();
			return (<Item index={i} byte={byteString} active={this.props.activeItem == i && this.props.active ? true : false} activate={this.props.activateItem} clear={this.props.clearItem}/>);
		}.bind(this));

		return (
			<ul className={"set" + (this.props.active ? ' active' : '')} onMouseOver={this.activate} onMouseLeave={this.clear}>
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
		if(this.props.sets[activeSet][0] == -1) return;
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
			return (<Set set={set} index={i} active={this.state.activeSet == i ? true : false} activeItem={this.state.activeItem} activateSet={this.setActiveSet} clearSet={this.clearActiveSet} activateItem={this.setActiveItem} clearItem={this.clearActiveItem}/>);
		}.bind(this));
		var heading = this.props.heading;
		var ascii = this.props.sets.map(function(set, setIndex) {
			return set.map(function(byte, itemIndex, theSet) {
				var char = '';
				if (byte == -1) {
					char = ' ';
				} else {
					if (byte > 31 && byte < 127) {
						char = String.fromCharCode(byte);
					} else {
						char = "·";
					}
				}

				return (<li className={(this.state.activeSet * (theSet.length) + this.state.activeItem == setIndex*(theSet.length) + itemIndex) ? 'active' : ''}>{char}</li>);
				}.bind(this));
			}.bind(this));
		return (
			<div className="row">
				<div className="heading">{heading}:</div>
					{sets}
				<div className="ascii">
					<ul className="set ascii">
					{ascii}
					</ul>
				</div>
			</div>
		);
	}
});

var Hex = React.createClass({
	render: function() {
		var str = "" + 1;
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

		var bytes = this.props.buffer.length;


		for (var i=0; i<bytes; i+=rowChunk) {
			sets = [];
			temparray = this.props.buffer.slice(i,i+rowChunk);

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

//React.render(<HexViewer buffer={data} rowLength={16} setLength={4} />, document.body);


