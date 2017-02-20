import React from 'react';
import ReactDOM from 'react-dom';
import Blockapps from 'blockapps-js';
import Order from './components/order';
import OrderList from './components/order-list';
import OrderForm from './components/order-form';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: "user",
			markers: [],
			route: {},
			order: {},
			allowOrder: false
		};

		this.handleMapClick = this.handleMapClick.bind(this);
		this.handleMarkerRightclick = this.handleMarkerRightclick.bind(this);
		this.clickOrder = this.clickOrder.bind(this);
		this.clickTab = this.clickTab.bind(this);
		this.setOrder = this.setOrder.bind(this);
	}

	handleMapClick(event) {
		if (this.state.markers.length == 2) {
			return;
		}
		let { markers } = this.state;
		markers
			.push({
				position: event.latLng,
				defaultAnimation: 2,
				key: Date.now(),
			});

		this.setState({ markers: markers });
		this.prepareRoad();
	}

	prepareRoad() {
		if (this.state.markers.length != 2) {
			this.setState({ route: {}, allowOrder: false });
			return;
		}

		var directionsService = new google.maps.DirectionsService;

		var self = this;
		directionsService.route({
			origin: this.state.markers[0].position,
			destination: this.state.markers[1].position,
			waypoints: [],
			optimizeWaypoints: true,
			travelMode: 'DRIVING'
		}, function (response, status) {
			if (status === 'OK') {
				// directionsDisplay.setDirections(response);
				var route = response.routes[0];
				var distValue = route.legs ? route.legs[0].distance.value : 0;
				self.setState({
					route: route,
					allowOrder: true,
					order: {
						from: route.legs ? route.legs[0].start_location.toString() : {},
						to: route.legs ? route.legs[0].end_location.toString() : {},
						price: self.calcPrice(distValue)
					}
				});

			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	}

	calcPrice(distance) {
		if (distance <= 0) {
			return 0;
		}
		var total = distance / 1000;
		var price = 30 + total * 2;
		return price.toFixed(0);
	}

	handleMarkerRightclick(index, event) {
		// let { markers } = this.state;
		// markers = markers.splice(index, 1);
		// this.setState({ markers: markers });
	}

	clickTab(value) {
		this.setState({
			page: value
		});
	}

	clickOrder() {
		this.createContract();
	}

	createContract(name) {
		var self = this;
		var source = "" +
			"contract TripOrder {" +
			"	address _user;" +
			"	address _driver;" +
			"	string _from;" +
			"	string _to;" +
			"	string _price;" +
			"	bool _isCompleted;" +
			"	function TripOrder() {" +
			"		_user = msg.sender;" +
			"		_isCompleted = false;" +
			"	}" +
			"	function publish(string from, string to, string price) {" +
			"		_from = from;" +
			"		_to = to;" +
			"		_price = price;" +
			"	}" +
			"	function take(address driver) {" +
			"		_driver = driver;" +
			"	}" +
			"	function complete() {" +
			"		if (msg.sender == _user) {" +
			"			_isCompleted = true;" +
			"		}" +
			"	}" +
			"}";

		console.log(source)
		fetch("http://13.93.50.81:8000/users/tripleentry/63628092e6f380306653785888a15fc0b1efb5e7/contract", {
			method: 'POST',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				src: source,
				password: "TripleEntry+"
			})
		}).then((response) => {
			if (response.status != 200) {
				console.error("Error during fetching invoices");
				return;
			}
			response.text()
				.then((responseText) => {
					console.log(responseText);
					self.publishContract(responseText);
					return responseText;
				});
		})
	}

	publishContract(address) {
		var url = `http://13.93.50.81:8000/users/tripleentry/63628092e6f380306653785888a15fc0b1efb5e7/contract/TripOrder/${address}/call`;
		fetch(url, {
			method: 'POST',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				password: "TripleEntry+",
				method: "publish",
				args:
				{
					from: this.state.order.from.replace(".", " ").replace(".", " "),
					to: this.state.order.to.replace(".", " ").replace(".", " "),
					price: "" + this.state.order.price
				},
				value: ""
			})
		}).then((response) => {
			if (response.status != 200) {
				console.error("Error during fetching invoices");
				return;
			}
			response.text()
				.then((responseText) => {
					console.log(responseText);
					// var content = JSON.parse(responseText);

					// var list = self.state.contracts;
					// list.push(content);
					// self.setState({
					// 	contracts: list
					// });
				});
		})
	}

	setOrder(order) {
		console.log(order)
		this.setState({
			order: order
		})
	}

	clickAccept() {
		console.log("accepted")
	}

	render() {
		var pages = ["user", "driver"];
		var menuItems = [];
		var self = this;
		pages.map(function (item, index) {
			var itemClass = `header item ${self.state.page == item ? "active" : ""}`
			menuItems.push(<div className={itemClass} key={index} onClick={() => self.clickTab(item) }>{item}</div>);
		});

		var content = {};
		if (this.state.page == "user") {
			// if (this.state.order && this.state.order.price) {
			// 	content = <Order />
			// } else {
			content = <OrderForm markers={this.state.markers}
				route={this.state.route}
				handleMapClick={this.handleMapClick}
				handleMarkerRightclick={this.handleMarkerRightclick}
				clickOrder={this.clickOrder}
				allowOrder={this.state.allowOrder}
				setOrder={this.setOrder}/>
			// }
		} else {
			content = <OrderList clickAccept={this.clickAccept} />
		}

		return (
			<div>
				<div className="ui inverted menu">{menuItems}</div>
				{content}
			</div>
		);
	}
}
export default App;

ReactDOM.render(<App />, document.getElementById("main"));