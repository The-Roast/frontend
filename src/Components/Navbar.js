import { BACKEND_URL, simpleCrypto } from "../HTTP";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./styles/Navbar.css";

const Navbar = () => {
	const navigate = useNavigate();
	const handleProfileClick = async () => {
		const encryptedObject = localStorage.getItem("JWT");
		const JWT = simpleCrypto.decrypt(encryptedObject);

		const userRes = await fetch(`${BACKEND_URL}/api/v1/user/public/current`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: JWT.token_type + " " + JWT.access_token,
			},
		});

		const userData = await userRes.json();

		if (!userRes.ok) {
			console.error(userRes.status);
		} else {
			navigate("/user-settings", { state: { user: userData } });
		}
	};

	const handleNewsletterClick = async () => {
		navigate("/newsletter");
	};

	return (
		<div className="navbar">
			<button onClick={() => handleNewsletterClick()}>Newsletters</button>
			<button onClick={() => navigate("/digest")}>Digests</button>
			<button onClick={() => handleProfileClick()}>Profile</button>
		</div>
	);
};

export default Navbar;
