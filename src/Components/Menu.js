import { BACKEND_URL, simpleCrypto } from "../HTTP";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import "./styles/Menu.css";

const Menu = () => {
	let navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="menu-wrapper">
			<Logout />
		</div>
	);
};

export default Menu;
