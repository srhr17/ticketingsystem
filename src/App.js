import React, { Component } from 'react';
import './ticketstyles.css';
import { render } from 'react-dom';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			vehicle_no: '',
			aadhar: '',
			origin: 'Palaghat',
			pin: 0
		};
	}
	aadharChange = (event) => {
		this.setState({ aadhar: event.target.value });
	};
	pinChange = (event) => {
		this.setState({ pin: event.target.value });
	};

	render() {
		return (
			<form method="POST" action="http://localhost:8001/entry">
				<div className="wrapper">
					<h1 style={{ fontSize: 50 }}>Issue/Delete Ticket</h1>
					<div className="form-wrapper">
						<div className="aadhar">
							<label htmlFor="aadhar" style={{ fontSize: 30, marginLeft: 50 }}>
								Scan Vehicle No
							</label>
							<input
								type="text"
								name="vehicle_no"
								style={{ fontSize: 17 }}
								onChange={this.aadharChange}
							/>
						</div>
						<div className="aadhar">
							<label htmlFor="aadhar" style={{ fontSize: 30, marginLeft: 50 }}>
								Enter PIN
							</label>
							<input type="password" name="pin" style={{ fontSize: 17 }} onChange={this.pinChange} />
						</div>
						<div className="aadhar">
							<label htmlFor="aadhar" style={{ fontSize: 30, marginLeft: 50 }}>
								Scan Aadhar
							</label>
							<input type="text" name="aadhar" style={{ fontSize: 17 }} onChange={this.aadharChange} />
						</div>
						<div className="aadhar">
							<label htmlFor="aadhar" style={{ fontSize: 30, marginLeft: 80 }}>
								Origin
							</label>
							<input
								type="text"
								name="origin"
								style={{ fontSize: 17 }}
								value={sessionStorage.getItem('cit')}
								disabled
							/>
						</div>
						<br />
						<br />
						<button type="submit" style={{ fontSize: 15 }} onClick={this.handleSubmit}>
							Submit
						</button>
					</div>
				</div>
			</form>
		);
	}
}
export default App;
