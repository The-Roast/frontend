import React, { useState } from "react";
import PresetCard from "../Components/PresetCard";
import "./styles/Onboarding.css";
import { NavLink, useNavigate } from "react-router-dom";
import { encodeURL, simpleCrypto, BACKEND_URL } from "../HTTP";

function Onboarding() {
	const navigate = useNavigate();

	// TODO use backend endpoint to get presets
	const presets = [
		{
			name: "Wall Street Bets",
			interests: ["Finance", "Stocks", "Market", "Investing"],
			color: "#478d56",
		},
	];

	const personalities = [
		"A 19th century, Gilded Age Robber Baron",
		"Jared Dunn from Silicon Valley. Include insider Silicon Valley jokes and crude/offensive word play and puns.",
		"Scrooge McDuck, a Scotsman and the richest duck in the entire world.",
		"Gen-Z",
		"A drunken pirate",
		"A noble medieval knight",
		"Ernest Hemingway",
	];

	const handleSubmit = async (event) => {
		event.preventDefault();

		// Send the form data to the server for further processing
		try {
			// const registerRes = await fetch(`${BACKEND_URL}/auth/register`, {
			// 	method: "POST",
			// 	headers: {
			// 		Accept: "application/json",
			// 		"Content-Type": "application/json",
			// 	},
			// 	body: JSON.stringify(registerBody),
			// });

			// const registerData = await registerRes.json();

			// if (!registerRes.ok) {
			// 	console.error(registerRes.status);
			// 	setWarningMessage(registerData.detail);
			// 	setIsWarningMessage(true);
			// } else {
			// 	navigate("/newsletter");
			// }
			navigate("/newsletter");
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div className="onboarding">
			<div className="onboarding-container">
				<div className="header">
					<h1>Onboarding</h1>
				</div>
				<div className="newsletter-grid">
					{presets.map((data, index) => (
						<PresetCard
							digest={data}
							personalities={personalities}
							index={index}
							key={index}
						/>
					))}
				</div>
				<div className="newsletter-grid">
					{presets.map((data, index) => (
						<PresetCard
							digest={data}
							personalities={personalities}
							index={index}
							key={index}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default Onboarding;
