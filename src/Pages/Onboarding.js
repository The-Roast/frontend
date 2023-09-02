import React, { useState } from "react";
import { Loading, PresetCard } from "../Components/Components";
import "./styles/Onboarding.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { encodeURL, simpleCrypto, BACKEND_URL } from "../HTTP";

function Onboarding() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { registerBody } = state;
	const [warningMessage, setWarningMessage] = useState("");
	const [isWarningMessage, setIsWarningMessage] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// TODO use backend endpoint to get presets
	const presets = [
		{
			name: "Bits and Bytes",
			interests: ["Technology", "Startups", "Digital Trends", "Innovation"],
			color: "#7436a2",
		},
		{
			name: "Wall Street Bets",
			interests: ["Finance", "Investing", "Stocks", "Markets"],
			color: "#478d56",
		},
		{
			name: "Outsider’s Insider",
			interests: [
				"U.S. Politics",
				"Global Politics",
				"Government",
				"Foreign Affairs",
			],
			color: "#c14b1f",
		},
		{
			name: "Arts & Culture",
			interests: ["Art", "Literature", "Music", "Theater"],
			color: "#9c27b0",
		},
		{
			name: "Sports",
			interests: ["Football", "Basketball", "Soccer", "Baseball"],
			color: "#e91e63",
		},
		{
			name: "True Crime",
			interests: [
				"Investigations",
				"Criminal Psychology",
				"Cold Cases",
				"Forensics",
			],
			color: "#607d8b",
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

	const handleSubmit = async (e) => {
		e.preventDefault();

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
				navigate("/sign-in");
			}
		} catch (error) {
			setIsLoading(false);
			console.error("Error:", error);
		}
	};

	return isLoading ? (
		<Loading />
	) : (
		<div className="onboarding">
			<div className="onboarding-container">
				<div className="header">
					<h1>Onboarding</h1>
				</div>
				<div className="header">
					<h1>Standard</h1>
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
				<div className="header">
					<h1>Experimental</h1>
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
				{isWarningMessage ? (
					<div className="warning-message">
						<p>{warningMessage}</p>
					</div>
				) : null}

				<div className="button-wrapper" style={{ paddingTop: "20px" }}>
					<button onClick={(e) => handleSubmit(e)}>Submit</button>
				</div>
			</div>
		</div>
	);
}

export default Onboarding;
