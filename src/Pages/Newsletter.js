import React, { useState, useEffect } from "react";
// import { useWhisper } from "@chengsokdara/use-whisper";
import "./styles/Newsletter.css";
import { simpleCrypto, BACKEND_URL } from "../HTTP";
import { Menu } from "../Components/Components";
// import XI_API_KEY from "../Config";
import { useLocation } from "react-router-dom";
import exampleCover from "./images/example-cover.png";

function Conversation() {
	const { state, pathname } = useLocation();
	const newsletter_uuid = pathname.split("/").pop();

	const [content, setContent] = useState([]);
	const [columns, setColumns] = useState([]);
	const [chatHistory, setChatHistory] = useState([]);

	const getNewsletter = async () => {
		if (state === null) {
			try {
				const newsletterRes = await fetch(
					`${BACKEND_URL}/api/v1/newsletter/${newsletter_uuid}`,
					{
						method: "get",
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
					}
				);

				const newsletterData = await newsletterRes.json();
				if (!newsletterRes.ok) {
					console.error(newsletterRes.status);
				} else {
					const introSection = {
						title: newsletterData.title,
						body: newsletterData.introduction,
					};
					const conclusionSection = {
						title: "Conclusion",
						body: newsletterData.conclusion,
					};
					let newContent = [];
					newContent.push(introSection);
					newsletterData.body.map(({ title, body }) =>
						newContent.push({ title, body })
					);
					newContent.push(conclusionSection);
					setContent(newContent);
				}
			} catch (error) {
				console.error("Error: ", error);
			}
		} else {
			const { newsletter } = state;
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
			newsletter.body.map(({ title, body }) =>
				newContent.push({ title, body })
			);
			newContent.push(conclusionSection);
			setContent(newContent);
		}
	};

	useEffect(() => {
		getNewsletter();
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

	const getChatHistory = async () => {
		const encryptedToken = localStorage.getItem("JWT");
		const JWT = simpleCrypto.decrypt(encryptedToken);

		const chatHistoryRes = await fetch(
			`${BACKEND_URL}/api/v1/newsletter/${newsletter_uuid}/history`,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: JWT.token_type + " " + JWT.access_token,
				},
			}
		);

		if (!chatHistoryRes.ok) {
			console.error(chatHistoryRes.status);
		} else {
			const chatHistoryData = await chatHistoryRes.json();
			setChatHistory(chatHistoryData);
		}
	};

	const handleUserMessage = async (e, text) => {
		e.preventDefault();
		console.log("sup!");
		// const encryptedToken = localStorage.getItem("JWT");
		// const JWT = simpleCrypto.decrypt(encryptedToken);
		// const chatBody = { message: text };
		// const chatRes = await fetch(
		// 	`${BACKEND_URL}/api/v1/newsletter/${newsletter_uuid}/chat`,
		// 	{
		// 		method: "GET",
		// 		headers: {
		// 			Accept: "application/json",
		// 			"Content-Type": "application/json",
		// 			Authorization: JWT.token_type + " " + JWT.access_token,
		// 		},
		// 		body: JSON.stringify(chatBody),
		// 	}
		// );
		// if (!chatRes.ok) {
		// 	console.error(chatRes.status);
		// } else {
		// 	await getChatHistory();
		// }
	};

	return (
		<div>
			<Menu />
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
					{/* {content.map(({ title, body }) => (
					<div className="newsletter-page">
						<h1>{title}</h1>
						<div dangerouslySetInnerHTML={{ __html: body }} />
					</div>
				))} */}
					{/* <div id="container"> */}
					{content.map((item, index) => (
						<div key={index} className="col newsletter-page">
							<h2>{item.title}</h2>
							<div dangerouslySetInnerHTML={{ __html: item.body }} />
						</div>
					))}
					{/* </div> */}
				</div>
				<div className="right-view">
					<div className="notepad">
						<div className="chat-messages">
							{chatHistory.map((chatMessage) => {
								<div className={`${chatMessage.type} message`}>
									chatMessage.content
								</div>;
							})}
						</div>
						<input
							type="text"
							className="message-input"
							placeholder="Type your message..."
							onSubmit={handleUserMessage}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Conversation;
