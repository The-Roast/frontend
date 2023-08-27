import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { BACKEND_URL, simpleCrypto } from "../HTTP";
import NewsletterCard from "../Components/NewsletterCard";
import Menu from "../Components/Menu";
import Navbar from "../Components/Navbar";
import PlusIcon from "./images/Plus.svg";
import "./styles/Newsletters.css";

const Newsletters = () => {
	const [newsletters, setNewsletters] = useState([]);

	let location = useLocation();

	useEffect(() => {
		setNewsletters([]);
		getNewsletters();
		console.log("hi!");
	}, [location]);

	const getDigest = async (digest_uuid) => {
		const encryptedObject = localStorage.getItem("JWT");
		const JWT = simpleCrypto.decrypt(encryptedObject);

		try {
			const digestRes = await fetch(
				`${BACKEND_URL}/api/v1/digest/${digest_uuid}`,
				{
					method: "get",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: JWT.token_type + " " + JWT.access_token,
					},
				}
			);

			const digestData = await digestRes.json();
			if (!digestRes.ok) {
				console.error(digestRes.status);
			} else {
				return digestData;
			}
		} catch (error) {
			console.error(error);
		}
	};

	const getNewsletters = async () => {
		const encryptedObject = localStorage.getItem("JWT");
		const JWT = simpleCrypto.decrypt(encryptedObject);

		try {
			const newsletterRes = await fetch(
				`${BACKEND_URL}/api/v1/newsletter/all/`,
				{
					method: "get",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: JWT.token_type + " " + JWT.access_token,
					},
				}
			);

			const newsletterData = await newsletterRes.json();
			if (!newsletterRes.ok) {
				console.error(newsletterRes.status);
			} else {
				setNewsletters([]);
				newsletterData.map(async (data) => {
					const digest = await getDigest(data.digest_uuid);
					const newsletter = { newsletter: data, digest: digest };
					setNewsletters((newsletters) => [...newsletters, newsletter]);
				});
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	return (
		<div className="newsletters">
			<Menu />
			<div className="newsletters-container">
				<div className="header">
					<h1>Newsletters</h1>
				</div>
				<Navbar />
				<div className="newsletters-grid">
					{newsletters.map((data, index) => (
						<NewsletterCard
							newsletter={data.newsletter}
							digest={data.digest}
							key={index}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default Newsletters;
