import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import App from './App';
import Driver from './driver.js';
import Location from './location.js';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
	<React.Fragment>
		<Router>
			<Switch>
				<Route exact path="/" component={App} />
				<Route exact path="/location" component={Location} />
				<Route exact path="/driver" component={Driver} />
				<Route component={App} />
			</Switch>
		</Router>
	</React.Fragment>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
