import logo from "./logo.svg";
import "./App.css";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import UserView from "./Pages/Main";
import DigestSettings from "./Pages/DigestSettings";
import Newsletter from "./Pages/Newsletter";
import CreateDigest from "./Pages/CreateDigest";
import Example1 from "./Pages/example1";
import Example2 from "./Pages/example2";
import Example3 from "./Pages/example3";
import Example4 from "./Pages/example4";

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useState } from "react";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/sign-up" element={<Signup />} />
				<Route path="/sign-in" element={<Signin />} />
				<Route exact path="/main" element={<UserView />} />
				<Route path="/main/digest/:uuid" element={<DigestSettings />} />
				<Route path="/create-digest" element={<CreateDigest />} />
				<Route path="/example1" element={<Example1 />} />
				<Route path="/example2" element={<Example2 />} />
				<Route path="/example3" element={<Example3 />} />
				<Route path="/example4" element={<Example4 />} />
				<Route path="/newsletter/:uuid" element={<Newsletter />} />
			</Routes>
		</Router>
	);
}

export default App;
