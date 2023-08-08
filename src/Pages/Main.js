import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL, simpleCrypto } from "../HTTP";
import Card from "../Components/Card";
import PlusIcon from "./images/Plus.svg";
import "./styles/Main.css";

const UserView = () => {
	let navigate = useNavigate();
	const [digests, setDigests] = useState([]);

	useEffect(() => {
		getDigests();
	}, []);

	const getDigests = async () => {
		const encryptedObject = localStorage.getItem("JWT");
		const JWT = simpleCrypto.decrypt(encryptedObject);

		try {
			const digestRes = await fetch(
				`${BACKEND_URL}/api/v1/digest/aggregate/all`,
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
				const newDigests = [...digests];
				digestData.map(function (digest) {
					newDigests.push(digest);
				});
				setDigests(newDigests);
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};

	const handleCreate = () => {
		navigate("/create-digest");
	};

	return (
		<div className="main">
			<div className="main-container">
				<div className="header">
					<h1>Digests</h1>
				</div>
				<div className="digests-grid">
					{digests.map((digest, index) => (
						<Card digest={digest} index={index} />
					))}
					<div className="create-digest-card" onClick={() => handleCreate()}>
						<img src={PlusIcon} alt="Plus icon" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserView;