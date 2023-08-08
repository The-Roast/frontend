import "./styles/Signin.css";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { encodeURL, simpleCrypto, BACKEND_URL } from "../HTTP";

function Signin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const [warningMessage, setWarningMessage] = useState("");
	const [isWarningMessage, setIsWarningMessage] = useState(false);

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const loginBody = {
			username: email,
			password: password,
		};

		// Send the form data to the server for further processing
		try {
			const loginRes = await fetch(`${BACKEND_URL}/auth/login/access-token`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: encodeURL(loginBody),
			});
			const loginData = await loginRes.json();

			if (!loginRes.ok) {
				console.error(loginRes.status);
				setWarningMessage(loginData.detail);
				setIsWarningMessage(true);
			} else {
				const userRes = await fetch(
					`${BACKEND_URL}/api/v1/user/public/current`,
					{
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: "Bearer " + loginData.access_token,
						},
					}
				);

				const userData = await userRes.json();

				if (!userRes.ok) {
					console.error(userRes.status);
				} else {
					const encryptedUUIDObject = simpleCrypto.encrypt(userData.uuid);
					const encryptedToken = simpleCrypto.encrypt(loginData);

					localStorage.setItem("JWT", encryptedToken);
					localStorage.setItem("UUID", encryptedUUIDObject);

					navigate("/main");
				}
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const emailInput = useCallback((inputElement) => {
		if (inputElement) {
			inputElement.focus();
		}
	}, []);

	return (
		<div className="sign-in">
			<div className="form-container">
				<form className="signin-form" onSubmit={handleSubmit}>
					<div
						style={{ paddingBottom: "50px" }}
						className="back-button-wrapper"
					>
						<button onClick={() => navigate(-1)}>Back</button>
					</div>
					<div className="input-container">
						<p>Email:</p>
						<input
							type="text"
							name="email"
							value={email}
							onChange={handleEmailChange}
							ref={emailInput}
							required
						/>
					</div>
					<div className="input-container">
						<p>Password:</p>
						<input
							type="password"
							name="password"
							value={password}
							onChange={handlePasswordChange}
							required
						/>
					</div>

					{isWarningMessage ? (
						<div className="warning-message">
							<p>{warningMessage}</p>
						</div>
					) : null}
					<div className="button-wrapper">
						<input type="submit" value="Sign in" />
					</div>
				</form>
			</div>
		</div>
	);
}

export default Signin;
