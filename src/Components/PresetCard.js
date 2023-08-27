import "./styles/PresetCard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { simpleCrypto, BACKEND_URL } from "../HTTP";

const PresetCard = (data) => {
	let navigate = useNavigate();
	const digest = data.digest;
	const personalities = data.personalities;
	const index = data.index;
	const [isEnabled, setIsEnabled] = useState(true);
	const [isHovered, setIsHovered] = useState(false);

	function capitalizeFirstLetter(s) {
		return s.charAt(0).toUpperCase() + s.slice(1);
	}

	const handleCardClick = () => {
		console.log("clicked!");
		// let path = `/digest/${digest.uuid}`;
		// navigate(path, { state: { digest: digest } });
	};

	const handleCardDisable = async (e) => {
		e.stopPropagation();
		const encryptedObject = localStorage.getItem("JWT");
		const encryptedUUIDObject = localStorage.getItem("UUID");
		const JWT = simpleCrypto.decrypt(encryptedObject);
		const UUID = simpleCrypto.decrypt(encryptedUUIDObject);

		await setIsEnabled(!isEnabled);

		try {
			const digestRes = await fetch(
				`${BACKEND_URL}/api/v1/digest/${digest.uuid}`,
				{
					method: "PUT",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: JWT.token_type + " " + JWT.access_token,
					},
					body: JSON.stringify({
						user_uuid: UUID,
						is_enabled: isEnabled,
					}),
				}
			);

			const digestData = await digestRes.json();

			if (!digestRes.ok) {
				console.error(digestRes.status);
			} else {
				digest.is_enabled = digestData.is_enabled;
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	return (
		<div
			className={`preset-digest-card ${isEnabled ? "" : "disabled"}`}
			style={{
				backgroundColor: index % 4 === 0 ? "#FCF9E1" : "#F9F9F6",
				outlineColor: digest.color,
				minHeight: "auto",
			}}
			onClick={() => isEnabled && handleCardClick()}
		>
			<div className="digest-container">
				<div className="digest-header">
					<h1 className="digest-name">{digest.name}</h1>
					<div className="outer">
						<div
							className={`digest-circle${isHovered ? " hovered" : ""}`}
							style={{
								backgroundColor: digest.color,
							}}
							onClick={(e) => handleCardDisable(e)}
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}
						>
							{isHovered && (
								<svg className="x-svg" viewBox="0 0 100 100">
									<line x1="0" y1="0" x2="100" y2="100" />
									<line x1="100" y1="0" x2="0" y2="100" />
								</svg>
							)}
						</div>
					</div>
				</div>
				<div className="preset-digest-row">
					<p>Interests: </p>
					<p>{capitalizeFirstLetter(digest.interests.join(", "))}</p>
				</div>
				<div className="preset-digest-row">
					<p for="personality">Personality:</p>
					<select id="personality" name="personality">
						{personalities.map((personality, index) => (
							<option value={personality}>{personality}</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
};

export default PresetCard;
