import React, { useState, useEffect } from "react";
// import { useWhisper } from "@chengsokdara/use-whisper";
import "./styles/Newsletter.css";
// import XI_API_KEY from "../Config";
import { useLocation } from "react-router-dom";
import exampleCover from "./images/example-cover.png";

function Conversation() {
	const { state } = useLocation();
	const { newsletter } = state;
	const [content, setContent] = useState([]);

	useEffect(() => {
		const introSection = {
			title: newsletter.title,
			body: newsletter.introduction,
		};
		const conclusionSection = {
			title: "Conclusion",
			body: newsletter.conclusion,
		};
		let newContent = [];
		newContent.push(introSection);
		newsletter.body.map(({ title, body }) => newContent.push({ title, body }));
		newContent.push(conclusionSection);

		setContent(newContent);
	}, []);

	const handleGenerateTTS = () => {
		// TODO: Generate TTS
		// fetchAudio(...)
	};

	const fetchAudio = async (text) => {
		console.log("Fetching audio!");
		const url =
			"https://api.elevenlabs.io/v1/text-to-speech/cjlys0iHziXap7q8d4rh?optimize_streaming_latency=0";
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"xi-api-key": "8b9914b4a9e536a1f236e02385f55df9",
				accept: "audio/mpeg",
			},
			body: JSON.stringify({
				text: text,
				model_id: "eleven_monolingual_v1",
				voice_settings: {
					stability: 0.75,
					similarity_boost: 0,
				},
			}),
			responseType: "blob",
		});
		if (response.status === 200) {
			console.log(response);
			const blob = await response.blob();
			console.log(blob);
			const audioUrl = URL.createObjectURL(blob);
			console.log(audioUrl);
			const ttsAudio = document.getElementById("existing-audio");
			ttsAudio.src = audioUrl;
		} else {
			console.log("Error: Unable to stream audio.");
		}
	};

	return (
		<div className="newsletter">
			<div className="left-view">
				{/* <div className="tts-wrapper">
					<button
						className="generate-button"
						onClick={() => handleGenerateTTS()}
					>
						Generate TTS
					</button>
					<audio id="existing-audio" controls></audio>
				</div> */}
				<div
					className="newsletter-page"
					style={{
						backgroundImage: `url(${exampleCover})`,
						backgroundSize: "cover",
					}}
				></div>
				{content.map(({ title, body }) => (
					<div className="newsletter-page">
						<h1>{title}</h1>
						<div dangerouslySetInnerHTML={{ __html: body }} />
					</div>
				))}
			</div>
			<div className="right-view">
				<div className="notepad">
					<div className="chat-messages"></div>
					<input
						type="text"
						className="message-input"
						placeholder="Type your message..."
						// onKeyDown={handleUserMessage}
					/>
				</div>
			</div>
		</div>
	);
}

export default Conversation;
