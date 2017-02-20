import React from 'react';
import ReactDOM from 'react-dom';
import SimpleMap from './simple-map';

class OrderForm extends React.Component {
	calcPrice(distance) {
		if (distance <= 0) {
			return 0;
		}
		var total = distance / 1000;
		var price = 30 + total * 2;
		return price.toFixed(0);
	}

	render() {
		var fromLocation = this.props.route.legs ? this.props.route.legs[0].start_address : '-';
		var toLocation = this.props.route.legs ? this.props.route.legs[0].end_address : '-';
		var distance = this.props.route.legs ? this.props.route.legs[0].distance.text : '-';
		var distValue = this.props.route.legs ? this.props.route.legs[0].distance.value : 0;
		var price = this.calcPrice(distValue);
		var btnOrderClass = `ui primary button ${this.props.allowOrder ? "" : "disabled"}`
		return (
			<div className="ui container">
				<SimpleMap
					markers={this.props.markers}
					onMapClick={this.props.handleMapClick}
					onMarkerRightclick={this.props.handleMarkerRightclick} />
				<div className="ui segments">
					<div className="ui segment">
						<div className="ui mini horizontal statistic">
							<div className="label">From</div>
							<div className="value">{fromLocation}</div>
						</div>
					</div>
					<div className="ui segment">
						<div className="ui mini horizontal statistic">
							<div className="label">To</div>
							<div className="value">{toLocation}</div>
						</div>
					</div>
					<div className="ui segment">
						<div className="ui mini horizontal statistic">
							<div className="label">Distance</div>
							<div className="value">{distance}</div>
						</div>
					</div>
					<div className="ui segment">
						<div className="ui mini horizontal statistic">
							<div className="label">Price</div>
							<div className="value">{price}</div>
						</div>
					</div>
				</div>
				<div className="ui vertical segment">
					<button className={btnOrderClass} onClick={this.props.clickOrder}>
						Order
					</button>
				</div>
			</div>
		);
	}
}
export default OrderForm;