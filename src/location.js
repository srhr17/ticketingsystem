import React, { Component } from 'react';
class location extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	cityChange = (event) => {
		let value = this;
		var a = event.target.value;

		sessionStorage.setItem('cit', a);
	};
	// her = (event) => {
	// 	sessionStorage.setItem('city', document.getElementById('city'));
	// 	alert(document.getElementById('city'));
	// };
	render() {
		return (
			<div>
				<form style={{ marginLeft: '50%', marginTop: '20%' }}>
					<input type="text" id="city" name="city" onChange={this.cityChange} />
					<input type="submit" />
				</form>
				<h1 style={{ marginLeft: '50%' }}>{sessionStorage.getItem('cit')} </h1>
			</div>
		);
	}
}

export default location;
