import React, { Component } from 'react';

class driver extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	// her = event => {
	//     var name, id;
	//     var value = this;

	//     fetch('http://localhost:8001/driver', {
	//         method: 'post'
	//     }).then(function (response) {
	//         return response.json();

	//     })
	//     // alert("hello");
	// }

	render() {
		return (
			<div>
				<form method="POST" action="http://localhost:8001/driver">
					<div className="wrapper">
						<h1 style={{ fontSize: 50 }}>Bus Details</h1>
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
								<label htmlFor="aadhar" style={{ fontSize: 30, marginLeft: 80 }}>
									City
								</label>
								<input type="text" name="origin" style={{ fontSize: 17 }} value="Coimbatore" disabled />
							</div>
							<br />
							<br />
							<button type="submit" style={{ fontSize: 15 }} onClick={this.handleSubmit}>
								Submit
							</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default driver;
