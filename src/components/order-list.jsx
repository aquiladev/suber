import React from 'react';
import "whatwg-fetch"

class OrderList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			contracts: []
		};
	}

	componentDidMount() {
		var contracts = this.fetchContracts();
	}

	fetchContracts() {
		var self = this;
		fetch("http://13.93.50.81:8000/contracts/TripOrder", {
			method: 'GET'
		}).then((response) => {
			if (response.status != 200) {
				console.error("Error during fetching invoices");
				return;
			}
			response.text()
				.then((responseText) => {
					var content = JSON.parse(responseText);
					var contracts = content.filter(function (item) { return item.length == 40 });
					self.loadContracts(contracts);
				});
		})
	}

	loadContracts(contracts) {
		console.log(contracts)
		var self = this;
		contracts
			.forEach(function (item) {
				fetch(`http://13.93.50.81:8000/contracts/TripOrder/${item}/state`, {
					method: 'GET'
				}).then((response) => {
					if (response.status != 200) {
						console.error("Error during fetching invoices");
						return;
					}
					response.text()
						.then((responseText) => {
							console.log(responseText);
							var content = JSON.parse(responseText);

							var list = self.state.contracts;
							list.push({ address: item, content: content });
							self.setState({
								contracts: list
							});
						});
				})
			});
	}

	render() {
		var self = this;
		console.log(this.state.contracts)
		var list = this.state.contracts.map(function (item, index) {
			return (
				<tr key={index}>
					<td>{item.address}</td>
					<td>{item.content._from}</td>
					<td>{item.content._to}</td>
					<td>{item.content._price}</td>
					<td>
						<button className="ui primary button" onClick={self.props.clickAccept}>
							Accept
						</button>
					</td>
				</tr>
			);
		});
		return (
			<div>
				<table className="ui celled striped table">
					<thead>
						<tr>
							<th colSpan="5">
								Orders
							</th>
						</tr>
					</thead>
					<tbody>{list}</tbody>
				</table>
			</div>);
	}
}
export default OrderList;