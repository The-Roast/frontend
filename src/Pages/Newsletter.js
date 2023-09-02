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

	const [pages, setPages] = useState([]);
	const [pageSize, setPageSize] = useState(2600); // Initial page size
	const [title, setTitle] = useState("");
	const [chatHistory, setChatHistory] = useState([]);
	const chatbotResponses = [
		"I'm glad you're interested in the article! It covers the latest developments in technology and their societal impact.",
		"Great question! The article delves into sustainable living and how individuals can adopt eco-friendly practices.",
		"That's an excellent question! The article focuses on the benefits of mindfulness and meditation, providing actionable tips for beginners.",
		"Absolutely! The article showcases the world of gourmet cooking and even includes a mouthwatering recipe.",
		"Sure thing! The article discusses the importance of financial planning and provides strategies for achieving long-term financial goals.",
		"Interesting question! The article features an interview with a local artist, shedding light on their inspiration and creative process.",
		"I'm glad you're curious! The article offers a review of a captivating sci-fi novel that's been making waves recently.",
		"Of course! The article explores the health benefits of regular exercise and includes a simple yet effective home workout routine.",
		"That's a great question! The article interviews a renowned scientist who shares insights into upcoming advancements in space exploration.",
		"Certainly! The article provides a comprehensive analysis of current economic trends and their potential implications for global markets.",
	];

	const combineText = (data) => {
		const introduction = `<p>${data.introduction}</p>`;
		setTitle(data.title);
		const bodyTexts = data.body.map(
			(item) => `<h2>${item.title}</h2>${item.body}`
		);
		const conclusion = `<h2>Conclusion</h2><p>${data.conclusion}</p>`;

		const combinedText = introduction + bodyTexts.join(" ") + conclusion;
		return combinedText;
	};

	const divideTextIntoPages = (text, pageSize) => {
		const pages = [];
		const words = text.split(" ");
		let currentPage = "";
		let index = 0;
		words.forEach((word) => {
			let size = pageSize;
			if (index === 0) {
				size = 1800;
			}
			if ((currentPage + word).length <= size) {
				currentPage += (currentPage ? " " : "") + word;
			} else {
				pages.push(currentPage);
				index += 1;
				currentPage = word;
			}
		});

		if (currentPage) {
			pages.push(currentPage);
		}

		return pages;
	};

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
					const combinedText = combineText(newsletterData);
					setPages(divideTextIntoPages(combinedText, pageSize));
				}
			} catch (error) {
				console.error("Error: ", error);
			}
		} else {
			const { newsletter } = state;
			const combinedText = combineText(newsletter);
			setPages(divideTextIntoPages(combinedText, pageSize));
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
		if (e.key === "Enter") {
			const randomResponse =
				chatbotResponses[Math.floor(Math.random() * chatbotResponses.length)];

			const newMessage = { content: text, type: "user" };
			const newResponse = { content: randomResponse, type: "assistant" };

			setChatHistory((prevHistory) => [
				...prevHistory,
				newMessage,
				newResponse,
			]);

			e.target.value = "";

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
		}
	};

	return (
		<div>
			{state === null ? null : <Menu />}
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
						className="col newsletter-page"
						style={{
							backgroundImage: `url(${exampleCover})`,
							backgroundSize: "cover",
						}}
					></div>
					{pages.map((pageContent, index) => (
						<div key={index} className="col newsletter-page">
							{index === 0 ? <h1 className="title">{title}</h1> : null}
							<div
								className="two-columns"
								dangerouslySetInnerHTML={{ __html: pageContent }}
							/>
						</div>
					))}
				</div>
				<div className="right-view">
					<div className="notepad">
						<div className="chat-messages">
							{chatHistory.map((chatMessage, index) => (
								<div key={index} className={`${chatMessage.type} message`}>
									{chatMessage.content}
								</div>
							))}
						</div>
						<input
							className="message-input"
							type="text"
							placeholder="Type your message..."
							onKeyDown={(e) => {
								handleUserMessage(e, e.target.value);
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Conversation;
