import "./styles/DigestCard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { simpleCrypto, BACKEND_URL } from "../HTTP";
import XButton from "../Pages/images/XButton.svg";

const DigestCard = (data) => {
	let navigate = useNavigate();
	const digest = data.digest;
	const index = data.index;
	const [isEnabled, setIsEnabled] = useState(digest.is_enabled);
	const [isHovered, setIsHovered] = useState(false);

	function capitalizeFirstLetter(s) {
		return s.charAt(0).toUpperCase() + s.slice(1);
	}

	const handleCardClick = () => {
		console.log("clicked!");
		let path = `/digest/${digest.uuid}`;
		navigate(path, { state: { digest: digest } });
	};

	const handleCardToggle = async (e) => {
		e.stopPropagation();
		const encryptedObject = localStorage.getItem("JWT");
		const encryptedUUIDObject = localStorage.getItem("UUID");
		const JWT = simpleCrypto.decrypt(encryptedObject);
		const UUID = simpleCrypto.decrypt(encryptedUUIDObject);

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
						is_enabled: !isEnabled,
					}),
				}
			);

			const digestData = await digestRes.json();

			if (!digestRes.ok) {
				console.error(digestRes.status);
			} else {
				setIsEnabled(!isEnabled);
				digest.is_enabled = digestData.is_enabled;
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	return (
		<div
			className={`digest-card ${isEnabled ? "" : "disabled"}`}
			style={{
				backgroundColor: index % 5 === 0 ? "#FCF9E1" : "#F9F9F6",
				outlineColor: digest.color,
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
							onClick={(e) => handleCardToggle(e)}
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}
						>
							{isHovered ? <img src={XButton} alt="XButton" /> : null}
						</div>
					</div>
				</div>
				<hr />
				<div className="digest-row">
					<label>Frequency: </label>
					<p>Daily</p>
				</div>
				<hr />
				<div className="digest-row">
					<label>Personality: </label>
					<p>{capitalizeFirstLetter(digest.personality)}</p>
				</div>
				<hr />
				<div className="digest-row">
					<label>Interests: </label>
					<p>{capitalizeFirstLetter(digest.interests.join(", "))}</p>
				</div>
				<hr />
				<div className="digest-row">
					<label>Sources: </label>
					<p>{capitalizeFirstLetter(digest.sources.join(", "))}</p>
				</div>
				<hr />
			</div>
		</div>
	);
};

export default DigestCard;
