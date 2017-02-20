contract TripOrder {
	address _user;
	address _driver;
	byte[2][] _from;
	byte[2][] _to;
	uint _price;
	bool _isCompleted;

	function Trip() {
		_user = msg.sender;
		_isCompleted = false;
	}

	function publish(byte[2][] from, byte[2][] to, uint price) {
		_from = from;
		_to = to;
		_price = price;
	}

	function take(address driver) {
		_driver = driver;
	}

	function complete() {
		if (msg.sender == _user) {
			_isCompleted = true;
		}
	}
}