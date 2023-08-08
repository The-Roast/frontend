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
	const [warningMessage, setWarningMessage] = useState("");
	const [isWarningMessage, setIsWarningMessage] = useState(false);
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

		// Send the form data to the server for further processing
		try {
			const registerRes = await fetch(`${BACKEND_URL}/auth/register`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(registerBody),
			});

			const registerData = await registerRes.json();

			if (!registerRes.ok) {
				console.error(registerRes.status);
				setWarningMessage(registerData.detail);
				setIsWarningMessage(true);
			} else {
				const loginBody = {
					email,
					password,
				};

				const loginRes = await fetch(`${BACKEND_URL}/auth/login/access-token`, {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: encodeURL(loginBody),
				});
				const loginData = await loginRes.json();
				if (!loginRes.ok) {
					console.error(loginRes.status);
					setWarningMessage(loginData.detail);
					setIsWarningMessage(true);
				} else {
					const encryptedToken = simpleCrypto.encrypt(loginData);
					const encryptedUUIDObject = simpleCrypto.encrypt(registerData.uuid);
					localStorage.setItem("JWT", encryptedToken);
					localStorage.setItem("UUID", encryptedUUIDObject);
					navigate("/main");
				}
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div className="signup">
			<div className="form-container">
				<form className="signup-form" onSubmit={handleSubmit}>
					<div
						style={{ paddingBottom: "50px" }}
						className="back-button-wrapper"
					>
						<button onClick={() => navigate(-1)}>Back</button>
					</div>
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
					{isWarningMessage ? (
						<div className="warning-message">
							<p>{warningMessage}</p>
						</div>
					) : null}
					<div className="button-wrapper">
						<input type="submit" value="Sign up" />
					</div>
				</form>
			</div>
		</div>
	);
}

export default Signup;
