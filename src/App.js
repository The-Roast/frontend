import "./App.css";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Onboarding from "./Pages/Onboarding";
import Signin from "./Pages/Signin";
import Digests from "./Pages/Digests";
import DigestSettings from "./Pages/DigestSettings";
import Newsletters from "./Pages/Newsletters";
import Newsletter from "./Pages/Newsletter";
import CreateDigest from "./Pages/CreateDigest";
import UserSettings from "./Pages/UserSettings";
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
				<Route path="/onboarding" element={<Onboarding />} />
				<Route exact path="/newsletter" element={<Newsletters />} />
				<Route path="/newsletter/:uuid" element={<Newsletter />} />
				<Route exact path="/digest" element={<Digests />} />
				<Route path="/digest/:uuid" element={<DigestSettings />} />
				<Route path="/create-digest" element={<CreateDigest />} />
				<Route path="/user-settings" element={<UserSettings />} />
				<Route path="/example1" element={<Example1 />} />
				<Route path="/example2" element={<Example2 />} />
				<Route path="/example3" element={<Example3 />} />
				<Route path="/example4" element={<Example4 />} />
			</Routes>
		</Router>
	);
}

export default App;
