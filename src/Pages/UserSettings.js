import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../Components/Loading";
import SettingsGrid from "../Components/SettingsGrid";
import Menu from "../Components/Menu";
import Navbar from "../Components/Navbar";
import "./styles/UserSettings.css";
import { simpleCrypto, BACKEND_URL } from "../HTTP";

function DigestSettings() {
	const navigate = useNavigate();
	const [unsavedChanges, setUnsavedChanges] = useState(false);
	const { state } = useLocation();
	const { user } = state;

	const [firstName, setFirstName] = useState(user.first_name);
	const [lastName, setLastName] = useState(user.last_name);
	const [password, setPassword] = useState(user.password);
	const [email, setEmail] = useState(user.email);

	const [isLoading, setIsLoading] = useState(false);

	const handleFirstNameChange = (event) => {
		setFirstName(event.target.value);
		setUnsavedChanges(true);
	};

	const handleLastNameChange = (event) => {
		setLastName(event.target.value);
		setUnsavedChanges(true);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
		setUnsavedChanges(true);
	};

	const handleSave = async () => {
		setUnsavedChanges(false);
		user.first_name = firstName;
		user.last_name = lastName;
		user.email = email;
		user.password = password;

		const encryptedObject = localStorage.getItem("JWT");
		const encryptedUUIDObject = localStorage.getItem("UUID");
		const JWT = simpleCrypto.decrypt(encryptedObject);
		const UUID = simpleCrypto.decrypt(encryptedUUIDObject);

		const updateUserBody = {
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			password: user.password,
			uuid: UUID,
		};
		try {
			setIsLoading(true);
			const updateUserRes = await fetch(
				`${BACKEND_URL}/api/v1/user/public/current/`,
				{
					method: "PUT",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: JWT.token_type + " " + JWT.access_token,
					},
					body: JSON.stringify(updateUserBody),
				}
			);
			const updateUserData = await updateUserRes.json();
			if (!updateUserRes.ok) {
				console.error(updateUserData.status);
			} else {
				setIsLoading(false);
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const data = [
		{
			preference: "First Name",
			value: firstName,
			onChange: handleFirstNameChange,
		},
		{
			preference: "Last Name",
			value: lastName,
			onChange: handleLastNameChange,
		},
		{ preference: "Email", value: email, onChange: null },
		{ preference: "Password", value: password, onChange: handlePasswordChange },
	];

	return isLoading ? (
		<Loading />
	) : (
		<div className="user-settings">
			<Menu />
			<div className="user-settings-container">
				<div className="header">
					<h1>Profile</h1>
				</div>

				<Navbar />
				<div className="user-settings-wrapper">
					<SettingsGrid data={data} />

					<div className="button-container">
						<div className="button-wrapper">
							<input
								type="submit"
								value="Save Profile"
								style={{
									backgroundColor: unsavedChanges
										? "var(--almost-white)"
										: "var(--light-grey)",
									color: unsavedChanges ? "black" : "#b3b3b3",
									borderColor: unsavedChanges ? "black" : "var(--grayed-out)",
									cursor: unsavedChanges ? "pointer" : "disabled",
								}}
								onClick={() => handleSave()}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DigestSettings;
