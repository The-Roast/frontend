import React, { useState } from "react";
import "./styles/Signup.css";
import { NavLink, useNavigate } from "react-router-dom";
import { encodeURL, simpleCrypto, BACKEND_URL } from "../HTTP";

function Signup() {
	const [first_name, setfirst_name] = useState("");
	const [last_name, setlast_name] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm_password, setConfirmPassword] = useState("");
	const passwordWarningMessage = "Passwords don't match!";
	const [isMismatchedPassword, setIsMismatchedPassword] = useState(false);
	const navigate = useNavigate();

	const handleFirstNameChange = (e) => {
		setfirst_name(e.target.value);
	};

	const handleLastNameChange = (e) => {
		setlast_name(e.target.value);
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setIsMismatchedPassword(false);
		setPassword(e.target.value);
	};

	const handleConfirmPasswordChange = (e) => {
		setIsMismatchedPassword(false);
		setConfirmPassword(e.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (password !== confirm_password) {
			setIsMismatchedPassword(true);
			return;
		}
		const registerBody = {
			first_name: first_name,
			last_name: last_name,
			email: email,
			password: password,
		};
		navigate("/onboarding", { state: { registerBody: registerBody } });
	};

	return (
		<div className="signup">
			<div className="form-container">
				<div className="signup-form">
					<div
						style={{ paddingBottom: "10px" }}
						className="back-button-wrapper"
					>
						<button onClick={() => navigate(-1)}>Back</button>
					</div>
					<form onSubmit={handleSubmit}>
						<div className="input-container">
							<p>First name: </p>
							<input
								type="text"
								name="first_name"
								value={first_name}
								onChange={handleFirstNameChange}
								required
							/>
						</div>
						<div className="input-container">
							<p>Last name: </p>
							<input
								type="text"
								name="last_name"
								value={last_name}
								onChange={handleLastNameChange}
								required
							/>
						</div>
						<div className="input-container">
							<p>Email: </p>
							<input
								type="text"
								name="email"
								value={email}
								onChange={handleEmailChange}
								required
							/>
						</div>
						<div className="input-container">
							<p>Password: </p>
							<input
								type="password"
								name="password"
								value={password}
								onChange={handlePasswordChange}
								required
							/>
						</div>
						<div className="input-container">
							<p>Confirm password: </p>
							<input
								type="password"
								name="confirm_password"
								value={confirm_password}
								onChange={handleConfirmPasswordChange}
								required
							/>
						</div>
						{isMismatchedPassword ? (
							<div className="warning-message">
								<p>{passwordWarningMessage}</p>
							</div>
						) : null}

						<div className="button-wrapper" style={{ paddingTop: "20px" }}>
							<input type="submit" value="Sign up" />
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Signup;
