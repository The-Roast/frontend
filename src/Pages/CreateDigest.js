import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { encodeURL, simpleCrypto, BACKEND_URL } from "../HTTP";
import { SettingsGrid, Loading } from "../Components/Components";
import "./styles/DigestSettings.css";

function CreateDigest() {
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [color, setColor] = useState("");
	const [sources, setSources] = useState([]);
	const [interests, setInterests] = useState([]);
	const [personality, setPersonality] = useState("");

	const handleNameChange = (event) => {
		setName(event.target.value);
	};

	const handleColorChange = (color) => {
		setColor(color);
	};

	const handlePersonalityChange = (event) => {
		setPersonality(event.target.value);
	};

	const handleInterestsChange = (event) => {
		setInterests(event.target.value.split(", "));
	};

	const handleSourcesChange = (event) => {
		setSources(event.target.value.split(", "));
	};

	const handleCreate = async () => {
		const encryptedToken = localStorage.getItem("JWT");
		const encryptedUUID = localStorage.getItem("UUID");
		const JWT = simpleCrypto.decrypt(encryptedToken);
		const UUID = simpleCrypto.decrypt(encryptedUUID);
		const createDigestBody = {
			user_uuid: UUID,
			name: name,
			interests: interests,
			sources: sources,
			personality: personality,
			color: color,
		};

		console.log(createDigestBody);

		try {
			const createDigestRes = await fetch(`${BACKEND_URL}/api/v1/digest`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: JWT.token_type + " " + JWT.access_token,
				},
				body: JSON.stringify(createDigestBody),
			});

			if (!createDigestRes.ok) {
				console.error(createDigestRes.status);
			} else {
				navigate("/digest");
			}
		} catch (error) {
			console.error("Error: ", error);
		}
		navigate("/digest");
	};

	const data = [
		{ preference: "Name", value: name, onChange: handleNameChange },
		{
			preference: "Personality",
			value: personality,
			onChange: handlePersonalityChange,
		},
		{ preference: "Color", value: color, onChange: handleColorChange },
		{
			preference: "Interests",
			value: interests.join(", "),
			onChange: handleInterestsChange,
		},
		{
			preference: "Sources",
			value: sources.join(", "),
			onChange: handleSourcesChange,
		},
	];

	return (
		<div className="digest-settings">
			<div className="digest-settings-container">
				<div className="header">
					<h1>Settings</h1>
				</div>

				<SettingsGrid data={data} />

				<div className="button-container">
					<div className="back-button-wrapper">
						<button onClick={() => navigate(-1)}>Back</button>
					</div>
					<div className="button-wrapper">
						<input
							type="submit"
							value="Create digest"
							onClick={() => handleCreate()}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CreateDigest;
