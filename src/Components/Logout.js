import { BACKEND_URL, simpleCrypto } from "../HTTP";
import { useNavigate } from "react-router-dom";
import "./styles/Logout.css";

const Logout = () => {
	let navigate = useNavigate();

	const handleLogout = async () => {
		const encryptedObject = localStorage.getItem("JWT");
		const JWT = simpleCrypto.decrypt(encryptedObject);

		const logoutRes = await fetch(`${BACKEND_URL}/auth/logout`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: JWT.token_type + " " + JWT.access_token,
			},
		});

		const logoutData = await logoutRes.json();

		if (!logoutRes.ok) {
			console.error(logoutRes.status);
		} else {
			localStorage.clear();
			navigate("/");
			console.log(logoutData);
		}
	};

	return (
		<div className="logout">
			<div className="button-wrapper">
				<button onClick={() => handleLogout()}>Log out</button>
			</div>
		</div>
	);
};

export default Logout;
