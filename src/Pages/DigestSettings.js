import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../Components/Loading";
import SettingsGrid from "../Components/SettingsGrid";
import "./styles/DigestSettings.css";
import { simpleCrypto, BACKEND_URL } from "../HTTP";
function DigestSettings() {
	const navigate = useNavigate();
	const [unsavedChanges, setUnsavedChanges] = useState(false);
	const { state } = useLocation();
	const { digest } = state;

	const [name, setName] = useState(digest.name);
	const [color, setColor] = useState(digest.color);
	const [sources, setSources] = useState(digest.sources);
	const [interests, setInterests] = useState(digest.interests);
	const [personality, setPersonality] = useState(digest.personality);
	const [isLoading, setIsLoading] = useState(false);

	const handleNameChange = (event) => {
		setName(event.target.value);
		setUnsavedChanges(true);
	};

	const handleColorChange = (color) => {
		setColor(color);
		setUnsavedChanges(true);
	};

	const handlePersonalityChange = (event) => {
		setPersonality(event.target.value);
		setUnsavedChanges(true);
	};

	const handleInterestsChange = (event) => {
		setInterests(event.target.value.split(", "));
		setUnsavedChanges(true);
	};

	const handleSourcesChange = (event) => {
		setSources(event.target.value.split(", "));
		setUnsavedChanges(true);
	};

	const handleSave = async () => {
		setUnsavedChanges(false);
		digest.name = name;
		digest.color = color;
		digest.sources = sources;
		digest.interests = interests;
		digest.personality = personality;

		const encryptedObject = localStorage.getItem("JWT");
		const encryptedUUIDObject = localStorage.getItem("UUID");
		const JWT = simpleCrypto.decrypt(encryptedObject);
		const UUID = simpleCrypto.decrypt(encryptedUUIDObject);
		const updateNewsletterBody = {
			user_uuid: UUID,
			name: digest.name,
			interests: digest.interests,
			sources: digest.sources,
			personality: digest.personality,
			color: digest.color,
			uuid: digest.uuid,
		};
		try {
			const updateNewsletterRes = await fetch(
				`${BACKEND_URL}/api/v1/digest/${digest.uuid}`,
				{
					method: "PUT",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: JWT.token_type + " " + JWT.access_token,
					},
					body: JSON.stringify(updateNewsletterBody),
				}
			);
			const updateNewsletterData = await updateNewsletterRes.json();
			if (!updateNewsletterRes.ok) {
				console.error(updateNewsletterData.status);
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	function timeout(delay) {
		return new Promise((res) => setTimeout(res, delay));
	}

	const handleGenerate = async () => {
		setIsLoading(true);
		const uuid = digest.uuid;
		const encryptedObject = localStorage.getItem("JWT");
		const JWT = simpleCrypto.decrypt(encryptedObject);

		// TODO: POST request to create newsletter
		// api/v1/newsletter/
		try {
			const newsletterRes = await fetch(`${BACKEND_URL}/api/v1/newsletter`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: JWT.token_type + " " + JWT.access_token,
				},
				body: JSON.stringify({ digest_uuid: uuid }),
			});

			const newsletterData = await newsletterRes.json();

			if (!newsletterRes.ok) {
				console.error(newsletterData.status);
			} else {
				setIsLoading(false);
				let path = `/newsletter/${newsletterData.uuid}/`;
				navigate(path, { state: { newsletter: newsletterData } });
			}
		} catch (error) {
			console.error("Error: ", error);
		}
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

	return isLoading ? (
		<Loading />
	) : (
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
							value="Save digest"
							style={{
								backgroundColor: unsavedChanges
									? "var(--almost-white)"
									: "var(--light-grey)",
								color: unsavedChanges ? "black" : "#b3b3b3",
								borderColor: unsavedChanges ? "black" : "var(--grayed-out)",
							}}
							onClick={() => handleSave()}
						/>
					</div>
					<div className="button-wrapper">
						<input
							type="submit"
							value="Generate digest"
							onClick={() => handleGenerate()}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DigestSettings;
