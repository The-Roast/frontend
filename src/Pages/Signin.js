import "./styles/Signin.css";
import { Loading } from "../Components/Components";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { encodeURL, simpleCrypto, BACKEND_URL } from "../HTTP";

function Signin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const [warningMessage, setWarningMessage] = useState("");
	const [isWarningMessage, setIsWarningMessage] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

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
			setIsLoading(true);
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
					setIsLoading(false);
					console.error(userRes.status);
				} else {
					setIsLoading(false);
					const encryptedUUIDObject = simpleCrypto.encrypt(userData.uuid);
					const encryptedToken = simpleCrypto.encrypt(loginData);

					localStorage.setItem("JWT", encryptedToken);
					localStorage.setItem("UUID", encryptedUUIDObject);

					navigate("/newsletter");
				}
			}
		} catch (error) {
			setIsLoading(false);
			console.error("Error:", error);
		}
	};

	const emailInput = useCallback((inputElement) => {
		if (inputElement) {
			inputElement.focus();
		}
	}, []);

	return isLoading ? (
		<Loading />
	) : (
		<div className="sign-in">
			<div className="form-container">
				<div className=" signin-form">
					<div className="back-button-wrapper">
						<button onClick={() => navigate(-1)}>Back</button>
					</div>
					<form onSubmit={handleSubmit}>
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
						<div className="button-wrapper" style={{ paddingTop: "20px" }}>
							<input type="submit" value="Sign in" />
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Signin;
